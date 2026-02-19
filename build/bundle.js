import esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

export function bundleCss() {
  esbuild.buildSync({
    entryPoints: ['src/app.css'],
    outfile: 'public/styles.min.css',
    bundle: true,
    minify: true,
    sourcemap: true,
    loader: {
      '.woff': 'file',
      '.woff2': 'file',
    },
  });
  // TODO: use font-display: block to briefly render nothing (when font is downloading), instead of layout shifts?
  // writeFileSync('public/styles.min.css', readFileSync('public/styles.min.css', 'utf-8').replaceAll('font-display:swap;', 'font-display:block;'), 'utf-8');
}

export function bundleJs() {
  esbuild.buildSync({
    entryPoints: ['src/app.js'],
    outfile: 'public/app.min.js',
    bundle: true,
    minify: true,
    sourcemap: true,
  });
}
