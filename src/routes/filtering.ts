export function applyFilters(
	allExercises: any[],
	selectedGoal: string | undefined,
	selectedTarget: string | undefined
): any[] {
	if (!selectedGoal && !selectedTarget) {
		return allExercises;
	}
	if (selectedGoal && !selectedTarget) {
		return allExercises.filter((e) => e.goalId === selectedGoal);
	}
	if (!selectedGoal && selectedTarget) {
		return allExercises.filter((e) => e.targetId === selectedTarget);
	}
	return allExercises.filter((e) => e.goalId === selectedGoal && e.targetId === selectedTarget);
}
