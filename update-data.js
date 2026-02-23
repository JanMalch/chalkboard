import { readFileSync, writeFileSync } from 'node:fs';
import { compareBy, localeCompare, composeComparators } from 'comparing';
import Fuse from 'fuse.js';

const idComparator = compareBy((x) => x.id, localeCompare);
const exercisesComparator = composeComparators([
	compareBy((x) => x.targetId, localeCompare),
	compareBy((x) => x.goalId, localeCompare),
	compareBy((x) => x.abbreviation, localeCompare)
]);

const goalCount = new Map();
const targetCount = new Map();

const seen = new Set();

const exercises = JSON.parse(readFileSync('src/lib/assets/data/exercises.json', 'utf-8'));
exercises.exercises.sort(exercisesComparator);
exercises.exercises.forEach((e) => {
	goalCount.set(e.goalId, (goalCount.get(e.goalId) ?? 0) + 1);
	targetCount.set(e.targetId, (targetCount.get(e.targetId) ?? 0) + 1);
	e.id = `${e.targetId}${e.goalId}${e.abbreviation}`;
	if (seen.has(e.id)) {
		console.error('Duplicate exercise ID:', e.id);
		process.exit(1);
	}
	seen.add(e.id);
});
writeFileSync('src/lib/assets/data/exercises.json', JSON.stringify(exercises, null, 2), 'utf-8');

const goals = JSON.parse(readFileSync('src/lib/assets/data/goals.json', 'utf-8'));
goals.goals.sort(idComparator);
goals.goals = goals.goals.map((g) => ({ ...g, count: goalCount.get(g.id) ?? 0 }));
writeFileSync('src/lib/assets/data/goals.json', JSON.stringify(goals, null, 2), 'utf-8');

const targets = JSON.parse(readFileSync('src/lib/assets/data/targets.json', 'utf-8'));
targets.targets.sort(idComparator);
targets.targets = targets.targets.map((g) => ({ ...g, count: targetCount.get(g.id) ?? 0 }));
writeFileSync('src/lib/assets/data/targets.json', JSON.stringify(targets, null, 2), 'utf-8');

writeFileSync(
	'src/lib/assets/data/index.fuse.json',
	JSON.stringify(Fuse.createIndex(['name', 'id'], exercises.exercises), null, 2),
	'utf-8'
);
