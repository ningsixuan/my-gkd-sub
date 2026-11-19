import type { RawApp, RawAppGroup } from '@gkd-kit/api';
import { defineGkdSubscription } from '@gkd-kit/define';
import { batchImportApps } from '@gkd-kit/tools';
import categories from './categories';
import globalGroups, { OPEN_AD_ORDER } from './globalGroups';

const apps = await batchImportApps(`${import.meta.dirname}/apps`);
const rawApps: RawApp[] = [];
apps.forEach((appConfig) => {
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
