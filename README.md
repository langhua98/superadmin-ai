# Web CAD

一款直接在浏览器中运行的 3D CAD 应用，实现在线模型设计与编辑。

**在线使用：** https://langhua98.github.io/superadmin-ai/

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

## 致谢与许可

本项目基于开源项目 [chili3d](https://github.com/xiangechen/chili3d)（作者：仙阁）改名定制而来，遵循 **AGPL-3.0** 许可证发布，完整许可证见 [LICENSE](./LICENSE)。
