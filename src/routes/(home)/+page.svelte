<script setup lang="ts">
	import Hero from '$lib/components/landingPage/Hero.svelte';
	import NewFeature from '$lib/components/landingPage/NewFeature.svelte';
	import { goto } from '$app/navigation';

	export let data;

	// navigate to game
	async function play() {
		goto('/live/teams?tab=IPL');
	}
</script>

<div class="h-screen flex flex-col w-full text-center py-8 px-4 lg:py-16 lg:px-12">
	<div class="m-auto items-center">
		<!-- New feature badge -->
		<NewFeature featureText="IPL season pack is out!" onClickAction={play} />
		<!-- Copy -->
		<Hero metrics={data.metrics} />
	</div>
</div>
