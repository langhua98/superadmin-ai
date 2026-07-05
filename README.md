# Web CAD

一款直接在浏览器中运行的 3D CAD 应用，实现在线模型设计与编辑。

**在线使用：**

- 3D 建模：https://langhua98.github.io/superadmin-ai/
- 2D 平面制图（DWG/DXF）：https://langhua98.github.io/superadmin-ai/2d/

## 功能

- 草图：直线、矩形、圆弧、多段线等
- 建模：拉伸、放样、扫掠、旋转、布尔运算（交/并/差）
- 编辑：移动、旋转、镜像、阵列、圆角、倒角、修剪
- 捕捉：端点、中点、圆心、垂足、交点等智能捕捉
- 文件：打开/保存文档，导入/导出 STEP、IGES、BREP、STL 等格式
- 插件系统：内置宏（Macro）与可视化编程（Visual Programming）插件
- 多语言（简体中文 / English / Português）与深浅色主题

## 技术架构

- **几何内核：** [OpenCascade (OCCT)](https://www.opencascade.com/) 编译为 WebAssembly，全部计算在浏览器本地完成，无需后端服务器
- **渲染：** [Three.js](https://threejs.org/)（WebGL）
- **语言与构建：** TypeScript + [Rspack](https://rspack.rs/)

## 本地开发

```bash
npm install
npm run dev        # 开发服务器 http://localhost:8080
npm run build      # 生产构建（输出到 dist/）
npm run test       # 单元测试
```

插件构建需要先安装插件依赖：

```bash
npm install --prefix plugins/macro
npm install --prefix plugins/visual-programming
```

## 2D 平面制图（webcad2d/）

`webcad2d/` 目录是独立的 2D 平面制图应用（Web CAD 2D），界面与操作类似 AutoCAD：

- 打开/编辑/保存 DWG、DXF 图纸，导出 PDF/SVG
- 绘制（直线/多段线/圆/圆弧）、修改（移动/旋转/复制/偏移/删除）、图层、文字
- AutoCAD 式命令行与命令别名（L=直线、C=圆…）、Model/布局标签页
- 默认简体中文界面，CAD 字体与图纸模板已本地化（不依赖境外 CDN）

基于 [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer)（MIT 许可证）定制。

```bash
cd webcad2d
pnpm install
pnpm dev        # 开发服务器 http://localhost:5173
pnpm build      # 输出到 packages/cad-viewer-example/dist/
```

## 致谢与许可

本项目基于开源项目 [chili3d](https://github.com/xiangechen/chili3d)（作者：仙阁）改名定制而来，遵循 **AGPL-3.0** 许可证发布，完整许可证见 [LICENSE](./LICENSE)。
