<script lang="ts">
	import './layout.scss';
	import favicon from '$lib/assets/favicon.svg';
	import { version } from '$app/environment';

	let { children } = $props();
</script>

<svelte:head>
	<title>Chalkboard</title>
	<link rel="icon" href={favicon} />
	<meta content="v{version}" name="version" />
</svelte:head>
{@render children()}
