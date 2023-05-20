<script setup lang="ts">
	import { goto } from '$app/navigation';
	export let data: any;

	async function viewPlayers(teamID: string) {
		// navigate to players page
		goto(`/live/${teamID}/players`);
	}
</script>

<button
	class="card w-56 lg:h-80 m-4 p-2 lg:p-0 rounded-lg shadow-lg cursor-pointer overflow-hidden
    hover:brightness-50 hover:scale-105 transition-all variant-filled
	flex flex-col items-center justify-center"
	on:click={() => viewPlayers(data.team_id)}
>
	<!-- Team logo -->
	<img class="object-contain w-48 h-48 hidden lg:block" src={data.team_logo} alt={data.team_name} />
	<!-- Team name -->
	<div class="flex items-center justify-center m-2">
		<span class="text-xl font-bold text-center">{data.team_name}</span>
	</div>
	<!-- Team tags -->
	<div class="flex items-center justify-center flex-wrap">
		{#each data.tags as tag}
			<span class="mx-1 variant-ringed rounded-xl text-sm font-semibold px-2">{tag}</span>
		{/each}
	</div>
</button>
