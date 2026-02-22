<script lang="ts">
	import { browser } from '$app/environment';
	import BottomSheet from '$lib/BottomSheet.svelte';
	import debounce from 'debounce';

	const storageKey = 'chalkboard_notes';
	// FIXME
	// svelte-ignore non_reactive_update
	let sheet: any;
	let value = $state(browser ? localStorage.getItem(storageKey) || '' : '');
	const storeNotes = debounce((v) => localStorage.setItem(storageKey, v), 200);
	$effect(() => storeNotes(value));
</script>

<button class="text-btn" onclick={() => sheet.showModal()}>Notizen</button>

<BottomSheet bind:dialog={sheet} title="Notizen">
	<div>
		<textarea bind:value placeholder="Notizen werden nur auf diesem Gerät gespeichert."></textarea>
	</div>
</BottomSheet>

<style lang="scss">
	div {
		padding: 0 1rem 2rem;
	}
	textarea {
		background-color: var(--hover-color);
		color: var(--text-color);
		border: none;
		outline: none;
		padding: 1rem;
		border-radius: 0.5rem;
		width: 100%;
		height: 60vh;
		resize: none;
		line-height: 1.65;
	}
</style>
