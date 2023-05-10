<script setup lang="ts">
	import { navigating } from '$app/stores';
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { page } from '$app/stores';
	import BallLoader from '$lib/components/core/BallLoader.svelte';

	let GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID;

	// Google analytics
	$: if (typeof gtag !== 'undefined' && import.meta.env.VITE_ENV == 'PROD') {
		if ($page.url.searchParams.toString().length > 0) {
			gtag('config', GA_MEASUREMENT_ID, {
				page_path: $page.url.pathname,
				page_location: `${$page.url.hostname}${$page.url.pathname}?${$page.url.searchParams}`
			});
		} else {
			gtag('config', GA_MEASUREMENT_ID, {
				page_path: $page.url.pathname,
				page_location: `${$page.url.hostname}${$page.url.pathname}`
			});
		}
	}
</script>

{#if $navigating}
	<div class="flex h-full m-auto">
		<BallLoader />
	</div>
{:else}
	<slot />
{/if}
