// 中文 loop 路由——/zh/layout.tsx 已经包了 LangProvider lang="zh"。
// 阶段 1：模块组件尚未接入 i18n，渲染时仍为中文（与原英文路径一致）。
// 阶段 2 会逐个翻译并接入 useT()。
export { default } from '../../loop/page';
