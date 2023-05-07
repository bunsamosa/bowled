<script setup lang="ts">
	import Hero from '$lib/components/landingPage/Hero.svelte';
	import NewFeature from '$lib/components/landingPage/NewFeature.svelte';

	export let data;
</script>

<div class="h-screen flex flex-col w-full text-center py-8 px-4 lg:py-16 lg:px-12">
	<div class="m-auto items-center">
		<!-- New feature badge -->
		<NewFeature featureText="IPL season pack is out!" />
		<!-- Copy -->
		<Hero metrics={data.metrics} />
	</div>
</div>
