<script setup lang="ts">
	export let data: any;
</script>

<div
	class="card w-56 h-80 m-4 rounded-lg shadow-lg cursor-pointer overflow-hidden
    hover:brightness-50 hover:scale-105 transition-all variant-filled
	flex flex-col items-center justify-center"
>
	<!-- Team logo -->
	<img class="object-contain w-48 h-48" src={data.team_logo} alt={data.team_name} />
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
</div>
