import * as THREE from 'three'

/**
 * Full-screen adaptive grid background for 2d drafting views, similar to the
 * grid displayed by AutoCAD.
 *
 * The grid is drawn by a screen-space shader on a full-screen quad:
 * - Fragment positions are un-projected into world space, so the grid is
 *   infinite and never needs to be rebuilt while panning or zooming.
 * - Line spacing snaps to powers of 10 based on the current zoom level and
 *   cross-fades between levels, with major lines every 10 minor cells.
 * - The world X/Y axes are highlighted in red/green.
 *
 * The material is opaque (line colour is mixed with the canvas background in
 * the shader) and is rendered first via a negative `renderOrder`, so entities
 * always draw on top of it regardless of render-list sorting.
 */
export class AcTrGridOverlay {
  private _mesh: THREE.Mesh
  private _material: THREE.ShaderMaterial
  private _invViewProj = new THREE.Matrix4()

  constructor() {
    this._material = new THREE.ShaderMaterial({
      uniforms: {
        uInvViewProj: { value: this._invViewProj },
        uBackground: { value: new THREE.Color(0x000000) },
        uLineColor: { value: new THREE.Color(0xffffff) },
        uAxisXColor: { value: new THREE.Color(0xa03030) },
        uAxisYColor: { value: new THREE.Color(0x30a030) }
      },
      vertexShader: /* glsl */ `
        varying vec2 vNdc;
        void main() {
          vNdc = position.xy;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vNdc;
        uniform mat4 uInvViewProj;
        uniform vec3 uBackground;
        uniform vec3 uLineColor;
        uniform vec3 uAxisXColor;
        uniform vec3 uAxisYColor;

        // Anti-aliased distance-to-grid-line factor (1 on a line, 0 between).
        float gridLine(vec2 w, float spacing, vec2 fw) {
          vec2 px = abs(fract(w / spacing - 0.5) - 0.5) * spacing / fw;
          return 1.0 - min(min(px.x, px.y), 1.0);
        }

        void main() {
          vec4 p = uInvViewProj * vec4(vNdc, 0.0, 1.0);
          vec2 w = p.xy / p.w;
          vec2 fw = fwidth(w);
          float worldPerPixel = max(max(fw.x, fw.y), 1e-12);

          // Choose a power-of-10 spacing so minor cells stay >= ~12px wide.
          float level = log2(worldPerPixel * 12.0) / log2(10.0);
          float base = floor(level);
          float fade = 1.0 - fract(level);
          float minor = pow(10.0, base + 1.0);
          float major = minor * 10.0;

          float gMinor = gridLine(w, minor, fw);
          float gMajor = gridLine(w, major, fw);
          float alpha = max(gMinor * 0.10 * fade, gMajor * 0.22);

          vec3 color = mix(uBackground, uLineColor, alpha);

          // Highlight the world X/Y axes (thin anti-aliased lines).
          float ax = 1.0 - min(abs(w.y) / fw.y, 1.0);
          float ay = 1.0 - min(abs(w.x) / fw.x, 1.0);
          color = mix(color, uAxisXColor, ax * 0.9);
          color = mix(color, uAxisYColor, ay * 0.9);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: false,
      depthTest: false,
      depthWrite: false
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    this._mesh = new THREE.Mesh(geometry, this._material)
    this._mesh.name = 'grid-overlay'
    this._mesh.frustumCulled = false
    this._mesh.renderOrder = -1000
    this._mesh.matrixAutoUpdate = false
    // The quad must never participate in picking.
    this._mesh.raycast = () => {}
    this._mesh.onBeforeRender = (_renderer, _scene, camera) => {
      this._invViewProj
        .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
        .invert()
    }
  }

  /** Adds the grid quad to the rendered scene root. */
  attach(scene: THREE.Scene) {
    scene.add(this._mesh)
  }

  /** Removes the grid quad from its parent scene. */
  detach() {
    this._mesh.removeFromParent()
  }

  /** Shows or hides the grid. */
  get visible() {
    return this._mesh.visible
  }
  set visible(value: boolean) {
    this._mesh.visible = value
  }

  /**
   * Keeps grid colours readable when the canvas background changes:
   * light lines on dark backgrounds, dark lines on light backgrounds.
   */
  setBackgroundColor(value: number) {
    const bg = new THREE.Color(value)
    const luminance = 0.299 * bg.r + 0.587 * bg.g + 0.114 * bg.b
    this._material.uniforms.uBackground.value.copy(bg)
    this._material.uniforms.uLineColor.value.set(
      luminance > 0.5 ? 0x000000 : 0xffffff
    )
  }

  /** Releases GPU resources owned by the overlay. */
  dispose() {
    this.detach()
    this._mesh.geometry.dispose()
    this._material.dispose()
  }
}
