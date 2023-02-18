<script lang="ts">
	import { serverURL } from '$lib/utils/bowledClient';
	import { goto } from '$app/navigation';
	import { teamID } from '$lib/stores/gameStore';
	import BallLoader from '$lib/components/core/BallLoader.svelte';

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

<div class="hero min-h-screen">
	<div class="hero-content flex-col min-w-full">
		{#await loadTeams()}
			<BallLoader />
		{:then}
			<div class="my-5"><h1 class="text-5xl font-bold">Choose your favorite team</h1></div>
			<div class="min-w-full">
				<div class="flex flex-row flex-wrap">
					{#each teamData as team}
						<div
							class="card w-72 h-72 mx-auto mb-10 shadow-xl image-full hover:scale-110 hover:bg-blue-600 outline"
						>
							<figure>
								<img src={team.team_logo} alt={team.team_name} />
							</figure>
							<div class="card-body justify-around">
								<h2 class="card-title justify-center text-3xl">{team.team_name}</h2>
								<div class="card-actions justify-end">
									<button
										class="btn btn-primary"
										on:click={() => meetPlayers(team.team_id, team.players)}>Pick</button
									>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/await}
	</div>
</div>
