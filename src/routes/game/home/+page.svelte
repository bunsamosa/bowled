<script lang="ts">
	import { serverURL } from '$lib/utils/bowledClient';
	import { appSession } from '$lib/stores/sessionStore';

	let playersData: any = [];

	async function loadPlayers() {
		// load player data
		let access_token = $appSession?.access_token;
		let url = serverURL + '/team/players';
		const response = await fetch(url, {
			headers: {
				Authorization: 'Bearer ' + access_token
			}
		});
		if (response.status == 200) {
			let players = await response.json();
			playersData = [...players];
		}
	}
</script>

<div class="hero flex-1">
	<div class="hero-content flex-col lg:flex-row flex-wrap">
		{#await loadPlayers() then}
			{#each playersData as player}
				<div class=" card w-96 bg-base-100 shadow-xl">
					<!-- <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure> -->
					<div class="card-body">
						<h2 class="card-title">
							{player.player_name}
						</h2>
						<div class="card-actions justify-start">
							{#if player.player_type == 'batsman'}
								<div class="badge badge-outline">{player.batting_type}</div>
							{:else if player.player_type == 'bowler'}
								<div class="badge badge-outline">{player.bowling_type}</div>
							{:else if player.player_type == 'all-rounder'}
								<div class="badge badge-outline">All Rounder</div>
							{:else}
								<div class="badge badge-outline">Wicket Keeper</div>
							{/if}
						</div>
						<div class="divider-horizontal" />
						<div class="flex flex-row">
							<p class="text-left">
								<span>Form</span>
								<span class="badge">{player.form}</span>
							</p>
							<p class="text-right">
								<span>Fitness</span>
								<span class="badge">{player.fitness}</span>
							</p>
						</div>
						<div class="divider-horizontal" />
						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Fielding</span>
							<span class="text-right flex-1">{player.fielding}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player.fielding_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Wicket Keeping </span>
							<span class="text-right flex-1">{player.wicket_keeping}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player.wicket_keeping_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Batting vs Seam </span>
							<span class="text-right flex-1">{player.batting_seam}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player.batting_seam_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Batting vs Spin </span>
							<span class="text-right flex-1">{player.batting_spin}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player.batting_spin_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Bowling Main </span>
							<span class="text-right flex-1">{player.bowling_main}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player.bowling_main_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Bowling Variation </span>
							<span class="text-right flex-1">{player.bowling_variation}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player.bowling_variation_index}
							max="20"
						/>
					</div>
				</div>
			{/each}
		{/await}
	</div>
</div>
