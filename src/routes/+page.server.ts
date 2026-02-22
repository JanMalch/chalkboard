import type { PageServerLoad } from './$types';
import { goals } from '$lib/assets/data/goals.json';
import { targets } from '$lib/assets/data/targets.json';
import { exercises } from '$lib/assets/data/exercises.json';
import { compareBy, localeCompare } from 'comparing';

export const load: PageServerLoad = () => {
	let longestGoal = 0;
	let longestTarget = 0;
	let longestAbbreviation = 0;
	for (const exercise of exercises) {
		longestAbbreviation = Math.max(exercise.abbreviation.length, longestAbbreviation);
		longestTarget = Math.max(exercise.targetId.length, longestTarget);
		longestGoal = Math.max(exercise.goalId.length, longestGoal);
	}

	goals.sort(compareBy((x) => x.id, localeCompare));
	targets.sort(compareBy((x) => x.id, localeCompare));

	return {
		goals,
		targets,
		longestGoal,
		longestTarget,
		longestAbbreviation
	};
};
