import HomePageContent from '@/components/pages/HomePageContent';

// 中文首页——/zh/layout.tsx 已经包了 LangProvider lang="zh"，
// 共享同一份 HomePageContent 组件，文案通过字典动态取
export default function ZhHomePage() {
  return <HomePageContent />;
}
