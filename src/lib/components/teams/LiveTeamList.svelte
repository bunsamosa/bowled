<script setup lang="ts">
	import LiveTeam from '$lib/components/teams/LiveTeam.svelte';
	export let data: any = [];
</script>

<div class="flex flex-row flex-wrap justify-center items-center">
	{#each data as team}
		<LiveTeam data={team} />
	{/each}
</div>
