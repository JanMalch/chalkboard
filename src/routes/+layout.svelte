<script lang="ts">
	import './layout.scss';
	import { version } from '$app/environment';

	let { children } = $props();
</script>

<svelte:head>
	<title>Chalkboard</title>
	<meta content="v{version}" name="version" />
</svelte:head>
{@render children()}
