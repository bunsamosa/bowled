<script lang="ts">
	import '../app.css';
	import Notifications from 'svelte-notifications';
	import { page } from '$app/stores';

	let GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID;
	console.log(GA_MEASUREMENT_ID, import.meta.env.VITE_PROD);

	$: if (typeof gtag !== 'undefined' && import.meta.env.VITE_PROD == true) {
		if ($page.query.toString().length > 0) {
			gtag('config', GA_MEASUREMENT_ID, {
				page_path: $page.path,
				page_location: `${$page.host}${$page.path}?${$page.query}`
			});
		} else {
			gtag('config', GA_MEASUREMENT_ID, {
				page_path: $page.path,
				page_location: `${$page.host}${$page.path}`
			});
		}
	}
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id={GA_MEASUREMENT_ID}"></script>
</svelte:head>

<Notifications>
	<slot />
</Notifications>
