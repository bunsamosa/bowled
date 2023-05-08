<script lang="ts">
	import { serverURL } from '$lib/utils/bowledClient';
	import { goto } from '$app/navigation';
	import { teamID } from '$lib/stores/gameStore';
	import BallLoader from '$lib/components/core/BallLoader.svelte';
	import LiveTeam from '$lib/components/teams/LiveTeam.svelte';

	let teamData: any = [];

	async function loadTeams() {
		// load teams data
		let url = serverURL + '/live/teams';
		console.log(url);
		const response = await fetch(url);
		if (response.status == 200) {
			let teams = await response.json();
			teamData = [...teams];
		}
	}

	async function meetPlayers(myTeam: string, myPlayers: any) {
		teamID.set(myTeam);
		goto('/live/players');
	}
</script>

<div class="flex flex-col h-full items-center">
	{#await loadTeams()}
		<BallLoader />
	{:then _}
		<div class="m-4 text-xl lg:text-4xl font-bold text-center">Choose your favorite team</div>
		<div class="flex flex-row flex-wrap justify-center items-center">
			{#each teamData as team}
				<LiveTeam data={team} />
			{/each}
		</div>
	{/await}
</div>
