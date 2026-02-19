import { mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { getData } from './data.js';
import { bundleCss, bundleJs } from './bundle.js';
import Handlebars from 'handlebars';
import { minify as minifyHtml } from 'html-minifier';
import { writeSearchJsons } from './searches.js';

const data = getData();

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

rmSync('public', { recursive: true, force: true });
mkdirSync('public');
writeSearchJsons(
  process.env.CI === 'true'
    ? 'https://janmalch.github.io/chalkboard/'
    : 'http://localhost:8080/',
  data
);

let longestGoal = 0;
let longestTarget = 0;
let longestAbbreviation = 0;
for (const exercise of data.exercises) {
  longestAbbreviation = Math.max(
    exercise.abbreviation.length,
    longestAbbreviation
  );
  longestTarget = Math.max(exercise.targetId.length, longestTarget);
  longestGoal = Math.max(exercise.goalId.length, longestGoal);
}

Handlebars.registerHelper('json', function (aValue) {
  return new Handlebars.SafeString(JSON.stringify(aValue));
});

Handlebars.registerHelper('padPostTarget', function (aString) {
  let result = '';
  for (let i = -1; i < longestTarget - aString.length; i++) {
    result += '&nbsp;';
  }
  return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('padPostGoal', function (aString) {
  let result = '';
  for (let i = -1; i < longestTarget - aString.length; i++) {
    result += '&nbsp;';
  }
  return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('padPostAbbreviation', function (aString) {
  let result = '';
  for (let i = -4; i < longestAbbreviation - aString.length; i++) {
    result += '&nbsp;';
  }
  return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('padTarget', function (aString) {
  let result = Handlebars.escapeExpression(aString);
  for (let i = 0; i < longestTarget - aString.length; i++) {
    result += '&nbsp;';
  }
  return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('padGoal', function (aString) {
  let result = Handlebars.escapeExpression(aString);
  for (let i = 0; i < longestGoal - aString.length; i++) {
    result += '&nbsp;';
  }
  return new Handlebars.SafeString(result);
});

const indexTemplate = Handlebars.compile(
  readFileSync('build/index.html.handlebars', 'utf-8')
);

writeFileSync('public/.nojekyll', '', 'utf-8');
writeFileSync(
  'public/index.html',
  minifyHtml(
    '<!DOCTYPE html>' +
      indexTemplate({
        pkg,
        data,
        goalIds: data.goals.map((x) => x.id),
        targetIds: data.targets.map((x) => x.id),
        longestAbbreviation,
        base: process.env.CI === 'true' ? '/chalkboard/' : '/',
      }),
    {
      collapseWhitespace: true,
      removeComments: true,
      sortAttributes: true,
      sortClassName: true,
      minifyJS: { mangle: false },
    }
  ),
  'utf-8'
);

bundleCss();
bundleJs();
