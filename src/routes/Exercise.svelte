<script lang="ts">
	import { building } from '$app/environment';
	import { page } from '$app/state';
	import { hasShare } from '$lib/world';
	const {
		item,
		longestTarget,
		longestGoal,
		longestAbbreviation
	}: {
		// FIXME
		item: {
			id: string;
			targetId: string;
			goalId: string;
			abbreviation: string;
			name: string;
			description: string;
		};
		longestTarget: number;
		longestGoal: number;
		longestAbbreviation: number;
	} = $props();
	const exerciseId = $derived(`${item.targetId}${item.goalId}${item.abbreviation}`);

	const isOpen = $derived(building ? false : page.url.searchParams.get('id') === item.id);

	function onShareExerciseLink(id: string, text: string) {
		const url = new URL(page.url.href);
		url.search = '';
		url.searchParams.set('id', id);
		if (hasShare) {
			navigator.share({ url: url.toString(), text, title: text }).catch((err) => {
				console.error('Error while sharing link:', err);
				navigator.clipboard.writeText(url.toString()).catch((err) => {
					console.error('Error while copying link:', err);
				});
			});
		} else {
			navigator.clipboard.writeText(url.toString()).catch((err) => {
				console.error('Error while copying link:', err);
			});
		}
	}
</script>

<details class="exercise" id={exerciseId} open={isOpen}>
	<summary>
		<div class="exercise-id">
			<span>{item.targetId}</span>
			<div class="line" aria-hidden="true">
				{#each { length: longestTarget - item.targetId.length + 1 }}&nbsp;{/each}
			</div>
			<span>{item.goalId}</span>
			<div class="line" aria-hidden="true">
				{#each { length: longestGoal - item.goalId.length + 1 }}&nbsp;{/each}
			</div>
			<span>{item.abbreviation}</span>
			<div class="line" aria-hidden="true">
				{#each { length: longestAbbreviation - item.abbreviation.length + 1 }}&nbsp;{/each}
			</div>
			<div class="line-end" aria-hidden="true"></div>
		</div>
		<div class="exercise-name">
			{item.name}
		</div>
	</summary>

	<div class="exercise-description">
		<b role="heading" aria-level="2" class="exercise-name">{item.name}</b>
		<p>{@html item.description}</p>
	</div>
	<footer class="exercise-footer">
		<button class="text-btn" onclick={() => onShareExerciseLink(item.id, item.name)}
			>Direktlink {hasShare ? 'teilen' : 'kopieren'}</button
		>
	</footer>
</details>

<style lang="scss">
	details {
		border-bottom: 1px solid var(--border-color);
		transition: background-color 0.22s;

		&:hover {
			background-color: var(--hover-color);
		}

		&:open {
			background-color: var(--hover-color);

			&:hover {
				background-color: var(--open-hover-color);
			}
		}
	}

	summary {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 1rem;
		line-height: var(--exercise-height);
		height: var(--exercise-height);
		content-visibility: auto;
		contain-intrinsic-size: var(--exercise-height);
		white-space: nowrap;
		cursor: pointer;

		&::marker {
			content: '';
		}

		& > .exercise-name {
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}

	.exercise-id {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.line {
		width: 100%;
		height: 1px;
		background-color: currentColor;
		opacity: 0.3;
		user-select: none;
	}

	.line-end {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		border: 1px solid currentColor;
		opacity: 0.3;
		flex-shrink: 0;
		margin: 0 0.25rem 0 -0.5rem;
		user-select: none;
	}

	.exercise-description,
	.exercise-footer {
		border-top: 1px dashed var(--border-color);
		padding: 1rem;
	}

	p {
		margin: 1rem 0 0;
	}

	@media (min-width: 600px) {
		.exercise-description .exercise-name {
			display: none;
		}
	}
</style>
