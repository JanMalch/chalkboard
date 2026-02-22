<script lang="ts">
	export let dialog: HTMLDialogElement;
	export let title: string;
</script>

<dialog
	bind:this={dialog}
	on:close
	on:click={(event) => {
		// close dialog when clicking on backdrop
		if (event.target === event.currentTarget) {
			dialog.close();
		}
	}}
>
	<!-- full-size div, so that it captures the clicks -->
	<div class="sheet">
		<div class="sheet-header">
			<h2>{title}</h2>
			<button on:click={() => dialog.close()} aria-label="Schließen">
				<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
					><path
						d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
					/></svg
				>
			</button>
		</div>
		<div class="sheet-content">
			<slot />
		</div>
	</div>
</dialog>

<style lang="scss">
	dialog {
		top: unset;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60ch;
		max-width: 100vw;
		max-height: 80vh;
		color: var(--text-color);
		background-color: var(--background-color);
		border-radius: 2rem 2rem 0 0;
		border: none;
		outline: none;
		padding: 0;
		margin: 0;

		&::backdrop {
			background-color: rgba(0, 0, 0, 0.8);
		}
	}

	.sheet-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		position: sticky;
		top: 0;
		background-color: var(--background-color);
		z-index: 1;

		& > h2 {
			font-size: 1.5rem;
			flex: 1 0 auto;
			margin: 0;
		}

		& > button {
			background: none;
			outline: none;
			border: none;
			border-radius: 50%;
			transition: background-color 0.22s;
			display: grid;
			place-items: center;
			width: 2rem;
			height: 2rem;

			&:hover {
				background-color: var(--hover-color);
			}
		}
	}
</style>
