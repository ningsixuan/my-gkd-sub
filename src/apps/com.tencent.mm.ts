import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.tencent.mm',
  name: '微信',
  groups: [
    {
      key: 0,
      name: '开屏广告',
      desc: '跳过启动时的开屏广告（示例规则，默认关闭，确认效果后再手动开启）',
      enable: false,
      rules: [
        {
          key: 0,
          matches: '[text*="跳过"]',
          action: 'clickNode',
        },
      ],
    },
  ],
});
