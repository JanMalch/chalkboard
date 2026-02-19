import { readFileSync } from 'node:fs';
import Ajv from 'ajv';
import { localeCompare, compareBy, composeComparators } from 'comparing';

const exerciseComparator = composeComparators([
  compareBy((x) => x.targetId, localeCompare),
  compareBy((x) => x.goalId, localeCompare),
  compareBy((x) => x.abbreviation, localeCompare),
]);

export function getData() {
  const schema = JSON.parse(readFileSync('data/schema.json', 'utf-8'));
  delete schema['$schema']; // TODO: add support for 2020-12 in Ajv
  const ajv = new Ajv({ strict: true }).addFormat('html', true);
  const validate = ajv.compile(schema);

  const data = JSON.parse(readFileSync('data/data.json', 'utf-8'));
  const valid = validate(data);
  if (!valid) {
    console.error(validate.errors);
    process.exit(1);
  }
  console.log('Data is valid!');
  data.exercises.sort(exerciseComparator);
  const seen = new Set();
  for (const exercise of data.exercises) {
    const humanId =
      exercise.goalId + '__' + exercise.targetId + '__' + exercise.abbreviation;
    if (seen.has(humanId)) {
      console.error('Duplicate ID:', humanId);
      process.exit(1);
    }
  }
  return data;
}
