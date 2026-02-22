<script lang="ts">
	import BottomSheet from './BottomSheet.svelte';

	// FIXME:
	// svelte-ignore non_reactive_update
	let sheet: any;
	let {
		items,
		selected = $bindable(),
		label
	}: {
		items: Array<{ id: string; label: string; count: number }>;
		label: string;
		selected?: string;
	} = $props();
</script>

<button onclick={() => sheet.showModal()} class="text-btn">{label}</button>

<BottomSheet bind:dialog={sheet} title={label}>
	<ul>
		{#each items as item (item.id)}
			{@const isSelected = selected === item.id}
			<li>
				<button
					class={isSelected ? 'active' : ''}
					onclick={() => {
						selected = isSelected ? undefined : item.id;
						sheet.close();
					}}
				>
					<span class="label">
						<b>{item.id}</b>
						<span class="dimmed">&ndash;</span>
						{item.label}
						<span class="dimmed">({item.count})</span>
					</span>
					<!-- https://pictogrammers.com/library/mdi/-->
					{#if isSelected}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							aria-hidden="true"
							fill="currentColor"
						>
							<path
								d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"
							/></svg
						>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							aria-hidden="true"
							fill="currentColor"
							><path
								d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"
							/></svg
						>
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</BottomSheet>

<style lang="scss">
	ul {
		list-style: none;
		padding: 0 1rem 2rem;
		margin: 0;

		button {
			outline: none;
			border: none;
			background: none;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			line-height: 3rem;
			padding: 0 1.25rem 0 1rem;
			border-radius: 0.25rem;
			transition: background-color 0.22s;

			span {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			svg {
				flex-shrink: 0;
			}

			&:hover {
				background-color: var(--hover-color);
			}

			&.active {
				background-color: var(--hover-color);

				svg {
					opacity: 1;
				}
			}

			&.active:hover {
				background-color: var(--open-hover-color);
			}
		}
	}

	.dimmed {
		opacity: 0.7;
	}
</style>
