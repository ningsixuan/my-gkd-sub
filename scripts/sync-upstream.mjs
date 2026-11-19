import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const upstream = process.env.UPSTREAM_DIR;
if (!upstream) {
  throw new Error('缺少 UPSTREAM_DIR 环境变量（上游仓库克隆目录）');
}

const srcDir = path.resolve('src');
const appsDir = path.join(srcDir, 'apps');
const upSrc = path.join(upstream, 'src');
const upApps = path.join(upSrc, 'apps');

mkdirSync(appsDir, { recursive: true });

// 1. 清理旧的 app 文件，只保留生成文件 allApps.ts
for (const f of readdirSync(appsDir)) {
  if (f.endsWith('.ts') && f !== 'allApps.ts') {
    rmSync(path.join(appsDir, f), { force: true });
  }
}

// 2. 读取上游全部 app 规则，去掉 import / defineGkdApp 包装，合并成一个数组
const files = readdirSync(upApps)
  .filter((f) => f.endsWith('.ts'))
  .sort();

const parts = [];
for (const f of files) {
  let c = readFileSync(path.join(upApps, f), 'utf8');
  c = c.replace(/import\s*\{\s*defineGkdApp\s*\}\s*from\s*'@gkd-kit\/define';/, '');
  c = c.replace(/export\s+default\s+defineGkdApp\(/, '');
  c = c.trim();
  if (c.endsWith(');')) {
    c = c.slice(0, -2);
  }
  parts.push(c.trimEnd());
}

const content = `import type { RawApp } from '@gkd-kit/api';

// 本文件由 scripts/sync-upstream.mjs 自动生成，请勿手动修改。
// 规则来源：https://github.com/Lin-arm/GKD_subscription
const apps: RawApp[] = [
${parts.join(',\n')},
];

export default apps;
`;

writeFileSync(path.join(appsDir, 'allApps.ts'), content, 'utf8');

// 3. 同步上游的分类 / 全局规则 / 全局黑名单
for (const name of ['categories.ts', 'globalGroups.ts', 'globalDefaultApps.ts']) {
  const from = path.join(upSrc, name);
  const to = path.join(srcDir, name);
  writeFileSync(to, readFileSync(from, 'utf8'), 'utf8');
}

console.log(`已同步 ${files.length} 个 App 规则 -> src/apps/allApps.ts`);
