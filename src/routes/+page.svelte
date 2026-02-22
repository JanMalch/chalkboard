<script lang="ts">
	import { building } from '$app/environment';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import SvelteVirtualList from '@humanspeak/svelte-virtual-list';
	import Exercise from './Exercise.svelte';
	import type { PageProps } from './$types';
	import FilterChip from '$lib/FilterChip.svelte';
	import type Fuse from 'fuse.js';
	import debounce from 'debounce';
	import { applyFilters } from './filtering';
	import Notes from './Notes.svelte';
	import { onMount, tick } from 'svelte';

	let listRef: SvelteVirtualList;
	let { data }: PageProps = $props();

	let query = $state(building ? '' : (page.url.searchParams.get('q') ?? ''));
	let debouncedQuery = $state('');
	const updateQuery = debounce((q) => (debouncedQuery = q), 200);
	$effect(() => updateQuery(query));

	let selectedGoal = $state<string>();
	let selectedTarget = $state<string>();
	let fuse = $state<Fuse<any>>();

	let allExercises = $state<any[]>([]);

	let queriedExercises = $derived.by(() =>
		debouncedQuery && fuse ? fuse.search(debouncedQuery).map((result) => result.item) : allExercises
	);
	let exercises = $derived.by(() => applyFilters(queriedExercises, selectedGoal, selectedTarget));

	onMount(async () => {
		const {
			default: { exercises }
		} = await import('$lib/assets/data/exercises.json');
		allExercises = exercises;

		const initialId = page.url.searchParams.get('id');
		if (initialId) {
			const initialIndex = allExercises.findIndex((e) => e.id === initialId);
			if (initialIndex > 0) {
				tick().then(() =>
					listRef.scroll({ index: initialIndex, smoothScroll: false, align: 'top' })
				);
			}
		}

		const [Fuse, index] = await Promise.all([
			import('fuse.js').then((m) => m.default),
			import('$lib/assets/data/index.fuse.json').then((m) => m.default)
		]);
		fuse = new Fuse(
			exercises,
			{
				keys: ['name', 'id'],
				shouldSort: false,
				threshold: 0.4
			},
			Fuse.parseIndex(index as any)
		);
	});
</script>

<div id="app">
	<header>
		<div class="search-container">
			<input
				type="search"
				bind:value={query}
				disabled={!fuse}
				placeholder="Chalkboard durchsuchen …"
			/>
		</div>

		<div class="action-container">
			<FilterChip items={data.targets} label="Bereich" bind:selected={selectedTarget}></FilterChip>
			<FilterChip items={data.goals} label="Ziel" bind:selected={selectedGoal}></FilterChip>
			<Notes />
			<a href={resolve('/info')} class="text-btn">Info</a>
		</div>
	</header>

	<main>
		<SvelteVirtualList items={exercises} defaultEstimatedItemHeight={40} bind:this={listRef}>
			{#snippet renderItem(item)}
				<Exercise
					{item}
					longestTarget={data.longestTarget}
					longestGoal={data.longestGoal}
					longestAbbreviation={data.longestAbbreviation}
				></Exercise>
			{/snippet}
		</SvelteVirtualList>
	</main>
</div>

<style lang="scss">
	#app {
		display: grid;
		grid-template-rows: 1fr auto;
	}

	header {
		border-top: 1px solid var(--border-color);
		order: 1;
		padding: 1rem;
	}

	.search-container input {
		outline: none;
		border: none;
		background-color: var(--hover-color);
		color: var(--text-color);
		padding: 0.25rem 1rem;
		width: 100%;
		height: 2.5rem;
		border-radius: 1.25rem;
	}

	.action-container {
		margin-top: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	@media (min-width: 600px) {
		#app {
			width: 90ch;
			max-width: 90vw;
			margin: 0 auto;
			border-left: 1px solid var(--border-color);
			border-right: 1px solid var(--border-color);
			grid-template-rows: auto 1fr;
		}

		header {
			border-top: none;
			border-bottom: 1px solid var(--border-color);
			order: 0;
		}

		.action-container {
			justify-content: flex-start;
			gap: 2rem;
			padding: 0 0.75rem;
		}
	}
</style>
