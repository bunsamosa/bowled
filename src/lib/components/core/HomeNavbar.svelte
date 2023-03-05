<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { themeChange } from 'theme-change';

	import Fa from 'svelte-fa/src/fa.svelte';
	import { faTwitter } from '@fortawesome/free-brands-svg-icons';
	import { faLightbulb } from '@fortawesome/free-regular-svg-icons';

	$: notHome = $page.url.pathname != '/';
	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<!-- Navbar -->
<div class="{notHome ? 'sticky' : 'fixed'} z-50 top-2 navbar max-w-screen-xl backdrop-blur-xl">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-2xl" href="/">Bowled</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal p-0 ">
			{#if notHome}
				<li>
					<button
						data-toggle-theme="bumblebee,halloween"
						data-act-class="ACTIVECLASS"
						type="button"
					>
						<Fa icon={faLightbulb} /></button
					>
				</li>
			{/if}
			<li>
				<!-- Twitter icon -->
				<a href="https://twitter.com/bowledGG" target="_blank"><Fa icon={faTwitter} /></a>
			</li>
			<!-- <li>
				<a href="https://wiki.bunsamosa.org/" target="_blank" class="btn btn-ghost normal-case"
					>Wiki</a
				>
			</li> -->
		</ul>
	</div>
</div>
