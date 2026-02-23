import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { compareBy, localeCompare, composeComparators } from 'comparing';
import goals from './src/lib/assets/data/goals.json' with { type: 'json' };
import targets from './src/lib/assets/data/targets.json' with { type: 'json' };
import exercises from './src/lib/assets/data/exercises.json' with { type: 'json' };

const baseUrl =
	process.env.CI === 'true' ? 'https://janmalch.github.io/chalkboard/' : 'http://localhost:8080/';

rmSync('static/search', { recursive: true, force: true });
mkdirSync('static/search');

const goalIds = goals.goals.map((v) => v.id);
const targetIds = targets.targets.map((v) => v.id);
const filterIds = [
	...goalIds,
	...targetIds,
	...goalIds.flatMap((g) => targetIds.map((t) => t + g))
];
/** @type {Map<string, any[]>} */
const exercisesByFilterId = new Map(filterIds.map((filterId) => [filterId, []]));
for (const v of exercises.exercises) {
	const vGoal = v.goalId;
	const vTarget = v.targetId;
	exercisesByFilterId.get(vGoal).push(v);
	exercisesByFilterId.get(vTarget).push(v);
	exercisesByFilterId.get(vTarget + vGoal).push(v);
}
exercisesByFilterId.forEach((value, key) => {
	if (value.length === 0) {
		return;
	}
	// https://github.com/dewitt/opensearch/blob/master/mediawiki/Specifications/OpenSearch/Extensions/Suggestions/1.1/Draft%201.wiki
	const data = [
		key.toLowerCase(),
		value.map((v) => v.id),
		value.map((v) => v.name),
		value.map((v) => baseUrl + '?id=' + v.id)
	];
	writeFileSync(`static/search/${key.toLowerCase()}.json`, JSON.stringify(data), 'utf-8');
});
