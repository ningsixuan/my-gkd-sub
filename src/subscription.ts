import type { RawApp, RawAppGroup } from '@gkd-kit/api';
import { defineGkdSubscription } from '@gkd-kit/define';
import categories from './categories';
import globalGroups, { OPEN_AD_ORDER } from './globalGroups';
import allApps from './apps/allApps';

// 全部应用规则集中在 src/apps/allApps.ts（来源见仓库根目录 来源说明.md）
const rawApps: RawApp[] = [];
allApps.forEach((appConfig: RawApp) => {
  appConfig.groups?.forEach((g: RawAppGroup) => {
    if (g.name.startsWith('开屏广告')) {
      g.order = OPEN_AD_ORDER;
    }
  });
  rawApps.push(appConfig);
});

export default defineGkdSubscription({
  id: 486735,
  name: '我的GKD订阅',
  version: 1,
  author: 'my-subscription',
  checkUpdateUrl: './gkd.version.json5',
  supportUri: 'https://github.com/ningsixuan/my-gkd-sub',
  categories,
  globalGroups,
  apps: rawApps,
});
