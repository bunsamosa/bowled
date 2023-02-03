<script lang="ts">
	import { serverURL } from '$lib/utils/bowledClient';
	import { goto } from '$app/navigation';
	import { teamID, allPlayers } from '$lib/stores/gameStore';

	let teamData: any = [];

	async function loadTeams() {
		// load teams data
		// let access_token = $appSession?.access_token;
		let url = serverURL + '/live/teams';
		console.log(url);
		const response = await fetch(url);
		if (response.status == 200) {
			let teams = await response.json();
			teamData = [...teams];
		}
	}

	async function setLineUp(myTeam: string, myPlayers: any) {
		teamID.set(myTeam);
		allPlayers.set(JSON.stringify(myPlayers));
		goto('/live/batting-strategy');
	}
</script>

<div class="hero flex-1">
	<div class="hero-content flex-col min-w-full">
		<div class="my-5"><h1 class="text-5xl font-bold">Choose your favorite team</h1></div>
		<div class="min-w-full">
			<div class="flex flex-row flex-wrap">
				{#await loadTeams() then}
					{#each teamData as team}
						<div
							class="card w-72 h-72 mx-auto mb-10 shadow-xl image-full hover:scale-110 hover:bg-blue-600"
						>
							<figure>
								<img src={team.team_logo} alt={team.team_name} />
							</figure>
							<div class="card-body justify-around">
								<h2 class="card-title justify-center text-3xl">{team.team_name}</h2>
								<div class="card-actions justify-end">
									<button
										class="btn btn-primary"
										on:click={() => setLineUp(team.team_id, team.players)}>Pick</button
									>
								</div>
							</div>
						</div>
					{/each}
				{/await}
			</div>
		</div>
	</div>
</div>
