<script lang="ts">
	// Use standard script tag for lifecycle functions
	import { navigating, page } from '$app/stores';
	import { onMount, afterUpdate } from 'svelte';
	import { browser } from '$app/environment'; // Import browser check

	// Import styles and components
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import BallLoader from '$lib/components/core/BallLoader.svelte';
	import { Modal} from '@skeletonlabs/skeleton'; // Import Skeleton modal components
	// Environment variables are safe to access in module scope
	const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID;
	const isProd = import.meta.env.VITE_ENV === 'PROD';

	// Function to send GA page view
	function trackPageView(url: URL) {
		if (browser && isProd && typeof gtag !== 'undefined') {
			const page_path = url.pathname;
			let page_location = `${url.hostname}${url.pathname}`;
			if (url.searchParams.toString().length > 0) {
				page_location += `?${url.searchParams}`;
			}
			console.debug(`GA Track: ${page_path} Loc: ${page_location}`); // Keep debug log
			gtag('config', GA_MEASUREMENT_ID, { page_path, page_location });
		}
	}

	// Track initial page view on mount (client-side only)
	onMount(() => {
		if (browser) { // Ensure this runs only in the browser
			trackPageView($page.url);
		}
	});

	// Track subsequent page views after navigation using reactive statement
	// This subscription to $page happens within the component instance
	$: if (browser && $page.url) {
		trackPageView($page.url);
	}

</script>

{#if $navigating}
	<div class="flex h-full m-auto">
		<BallLoader />
	</div>
{:else}
	<slot />
	<Modal />
{/if}
