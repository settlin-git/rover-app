#!/usr/bin/env node
/**
 * Generates src/global.css from src/theme/tokens.js.
 *
 * Tailwind cannot read JavaScript values at runtime on the device, so each
 * token is emitted as a CSS custom property. Colours are written as
 * space-separated RGB channels so Tailwind's opacity modifiers keep working
 * (`bg-brand/40`).
 *
 * Run with `npm run tokens` after editing tokens.js.
 */

import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { colors } = require(join(root, 'src/theme/tokens.js'));

function hexToRgbChannels(hex) {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Token value "${hex}" is not a 3- or 6-digit hex colour.`);
  }

  const int = parseInt(full, 16);
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
}

const lightKeys = Object.keys(colors.light);
const darkKeys = Object.keys(colors.dark);
const missing = lightKeys.filter((k) => !darkKeys.includes(k));
const extra = darkKeys.filter((k) => !lightKeys.includes(k));

if (missing.length || extra.length) {
  console.error('Light and dark token sets must match.');
  if (missing.length) console.error(`  Missing from dark: ${missing.join(', ')}`);
  if (extra.length) console.error(`  Missing from light: ${extra.join(', ')}`);
  process.exit(1);
}

const declarations = (mode, indent) =>
  lightKeys.map((key) => `${indent}--color-${key}: ${hexToRgbChannels(colors[mode][key])};`).join('\n');

const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

/*
 * GENERATED FILE — do not edit.
 * Change src/theme/tokens.js instead, then run \`npm run tokens\`.
 */

:root {
${declarations('light', '  ')}
}

@media (prefers-color-scheme: dark) {
  :root {
${declarations('dark', '    ')}
  }
}
`;

writeFileSync(join(root, 'src/global.css'), css);
console.log(`Wrote src/global.css (${lightKeys.length} colour tokens x 2 modes).`);
