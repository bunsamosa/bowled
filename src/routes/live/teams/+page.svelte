<script lang="ts">
	import { serverURL } from '$lib/utils/bowledClient';
	import { appSession } from '$lib/stores/sessionStore';
	import { goto } from '$app/navigation';

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

	async function chooseOpponent(myTeam: string) {
		goto('/live/opponent?self=' + myTeam);
	}
</script>

<div class="hero flex-1">
	<div class="hero-content flex-col lg:flex-row flex-wrap">
		{#await loadTeams() then}
			{#each teamData as team}
				<div class="card w-96 bg-base-100 shadow-xl">
					<figure>
						<img src={team.team_logo} alt={team.team_name} class="max-h-40" />
					</figure>
					<div class="card-body">
						<h2 class="card-title">{team.team_name}</h2>
						<div class="card-actions justify-end">
							<button class="btn btn-primary" on:click={() => chooseOpponent(team.team_id)}
								>Pick</button
							>
						</div>
					</div>
				</div>
			{/each}
		{/await}
	</div>
</div>
