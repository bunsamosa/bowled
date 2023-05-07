<script setup lang="ts">
	import { goto } from '$app/navigation';

	export let metrics = {
		games_played: 0,
		games_live: 0
	};

	// navigate to game
	async function play() {
		goto('/live/teams');
	}
</script>

<section>
	<div class="p-4 text-4xl font-bold md:text-5xl lg:text-6xl copy-gradient">
		Beat your friends in Cricket
	</div>
	<div class="text-xl mb-8 font-semibold lg:text-2xl sm:px-16 xl:px-48">
		Experience the battle of cricket strategy in a card-game!
	</div>
	<div
		class="flex flex-col mb-8 lg:mb-32 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
	>
		<button type="button" class="btn py-3 px-7 rounded-xl variant-filled-primary" on:click={play}>
			Play Now
		</button>
		<button type="button" class="btn py-3 px-5 rounded-xl variant-ringed-secondary">
			Learn more
		</button>
	</div>
	<dl class="grid max-w-screen-sm mx-auto sm:grid-cols-3">
		<div class="flex flex-col items-center justify-center">
			<dt class="mb-2 text-3xl md:text-4xl font-bold copy-gradient">20</dt>
			<dd class="text-gray-400">International Teams</dd>
		</div>
		<div class="flex flex-col items-center justify-center">
			<dt class="mb-2 text-3xl md:text-4xl font-bold copy-gradient">{metrics.games_live}</dt>
			<dd class="text-gray-400">Players online</dd>
		</div>
		<div class="flex flex-col items-center justify-center">
			<dt class="mb-2 text-3xl md:text-4xl font-bold copy-gradient">{metrics.games_played}</dt>
			<dd class="font-semi-bold text-gray-400">Games played</dd>
		</div>
	</dl>
</section>

<style>
	.copy-gradient {
		@apply bg-gradient-to-b from-yellow-50 via-yellow-300 to-red-400 text-transparent bg-clip-text;
	}
</style>
