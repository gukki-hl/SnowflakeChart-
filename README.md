# 🌟 Snowflake Chart - 交互式雪花图可视化

一个基于 React + Canvas 构建的交互式雪花图（Radar Chart）可视化组件，用于展示多维度数据分析。

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-3.29.0-319795?logo=chakra-ui)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 特性

- 🎨 **动态雪花图渲染**：使用 Canvas 绘制的高性能雪花图，支持贝塞尔曲线平滑过渡
- 🎯 **智能 Tooltip**：鼠标悬浮时显示详细维度信息，箭头自动指向扇形中心
- 🔄 **实时交互**：支持动态调整各维度分数，实时更新图表
- 🌈 **动态配色**：根据总分自动计算图表颜色（红色 → 黄色 → 绿色）
- 🎭 **双模式切换**：
  - **COMPANY 模式**：默认模式，支持 hover 交互
  - **TOC 模式**：高亮单个维度，带放大和遮罩效果
- 📱 **响应式设计**：基于 Chakra UI 构建的现代化 UI
- 🚀 **性能优化**：组件记忆化、条件重绘、内存泄漏防护

## 🎬 在线演示

<!-- 添加你的演示链接或截图 -->
```bash
# 克隆项目后本地运行查看效果
npm run dev
```

## 📦 技术栈

- **React 19.2.0** - UI 框架
- **Vite** - 构建工具（使用 Rolldown）
- **Chakra UI 3.29.0** - UI 组件库
- **Canvas API** - 图表绘制
- **TailwindCSS 4.1.17** - CSS 工具库

## 🚀 快速开始

### 前置要求

- Node.js >= 16.0.0
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/SnowflakeChart.git

# 进入项目目录
cd SnowflakeChart

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📂 项目结构

```
SnowflakeChart/
├── src/
│   ├── components/
│   │   ├── SnowflakeChart.jsx      # 主容器组件
│   │   ├── SnowflakeCanvas.jsx     # Canvas 渲染层（纯绘制）
│   │   ├── SnowflakeTooltip.jsx    # 交互层（鼠标事件 + Tooltip）
│   │   ├── Tooltipmessage.jsx      # Tooltip UI 组件
│   │   ├── ControlPanel.jsx        # 控制面板容器
│   │   ├── ScoresRadio.jsx         # 分数调整控件
│   │   ├── HighlightSection.jsx    # 高亮维度选择器
│   │   └── Sliders.jsx             # 滑块组件
│   ├── dimensionData.json          # 维度数据配置
│   ├── App.jsx                     # 应用入口
│   ├── main.jsx                    # React 挂载点
│   └── index.css                   # 全局样式
├── public/                         # 静态资源
├── package.json                    # 依赖配置
├── vite.config.js                  # Vite 配置
└── README.md                       # 项目文档
```

## 🎨 组件架构

### 核心组件职责分离

```
SnowflakeChart (业务逻辑层)
    ├── ControlPanel (用户输入)
    │   ├── ScoresRadio (分数调整)
    │   ├── HighlightSection (维度选择)
    │   └── Reset Button
    │
    └── SnowflakeTooltip (交互层)
        ├── 鼠标事件处理
        ├── Tooltip 数据计算
        ├── TooltipMessage (UI 展示)
        └── SnowflakeCanvas (渲染层)
            └── Canvas 绘制逻辑
```

### 数据流

```
dimensionData.json
    ↓
SnowflakeChart (数据处理 & 状态管理)
    ↓
SnowflakeTooltip (交互状态 hoveredSection)
    ↓
SnowflakeCanvas (根据 props 渲染)
```

## 🔧 数据配置

编辑 `src/dimensionData.json` 自定义维度数据：

```json
{
  "companies_score": [
    {
      "name": "value",           // 维度名称
      "value": 3,                // 分数 (0-7)
      "description": "...",      // 维度描述
      "section": [true, false, ...] // 6个检查项状态
    }
  ]
}
```

### 支持的维度

- **VALUE** - 价值评估
- **FUTURE** - 未来预期
- **PAST** - 历史表现
- **HEALTH** - 财务健康
- **DIVIDEND** - 股息分析

## 🎯 核心功能

### 1. 动态雪花图绘制

- 使用三次贝塞尔曲线绘制平滑的雪花形状
- 7 层同心圆背景（交替颜色）
- 5 条参考线（从圆心到外圈）
- 根据总分动态计算颜色（HSL 色相 0-100）

### 2. 智能 Tooltip 定位

- 自动计算每个扇形的 Tooltip 位置
- 箭头精确指向扇形中心点
- 显示维度分数、描述和分析检查项

### 3. TOC 模式高亮

- 选中维度后自动进入 TOC 模式
- 高亮扇形 1.05 倍放大
- 其他区域添加 50% 黑色蒙版
- 使用离屏 Canvas 实现缩放效果

## 🚀 性能优化

- ✅ **组件记忆化**：使用 `React.memo` 和 `useMemo`
- ✅ **回调稳定**：使用 `useCallback` 避免重复创建函数
- ✅ **Canvas 分层**：基础层与交互层分离，减少重绘
- ✅ **事件清理**：useEffect 清理函数防止内存泄漏
- ✅ **纯函数提取**：计算函数移到组件外部，避免重复定义

## 🛠️ 开发指南

### 添加新维度

1. 在 `dimensionData.json` 添加数据
2. 更新 `SnowflakeChart.jsx` 的 `dimensionOrder`
3. 调整 `getTooltipPlacement` 中的 placement 逻辑（如果需要）

### 自定义样式

- 修改 `SnowflakeCanvas.jsx` 中的常量：
  - `centerX/centerY`: Canvas 中心点
  - `outerRadius`: 雪花图半径
  - `hueStart/hueEnd`: 颜色范围

### 调试模式

在 `SnowflakeTooltip.jsx` 第 166 行启用调试日志：

```javascript
console.log("悬浮维度索引:", newHoveredSection);
console.log("维度名称:", dimensions[newHoveredSection]);
```

## 📝 代码规范

- 使用 ESLint 进行代码检查
- 遵循 React Hooks 最佳实践
- 组件按职责单一原则拆分
- 注释清晰，包含中文说明

## 🐛 已知问题

- [ ] Tooltip 在某些边缘位置可能超出视口
- [ ] 大量维度（>7）时布局需要调整
- [ ] 移动端触摸事件支持待完善

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👨‍💻 作者

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 致谢

- [Chakra UI](https://chakra-ui.com/) - 优秀的 React UI 组件库
- [Vite](https://vitejs.dev/) - 极速的前端构建工具
- Canvas API 文档和社区支持

---

⭐ 如果这个项目对你有帮助，请给个 Star！
