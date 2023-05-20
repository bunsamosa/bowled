<script lang="ts">
	import { serverURL } from '$lib/utils/bowledClient';
	import { goto } from '$app/navigation';
	import { teamID, allPlayers } from '$lib/stores/gameStore';
	import BallLoader from '$lib/components/core/BallLoader.svelte';

	let playersData: any = [];
	let myTeam = $teamID;

	async function loadPlayers() {
		// load teams data
		let url = serverURL + '/live/players?team=' + myTeam;
		console.log(url);
		const response = await fetch(url);
		if (response.status == 200) {
			let players = await response.json();
			playersData = [...players];
			allPlayers.set(JSON.stringify(playersData));
		}
	}

	async function setLineUp() {
		goto('/live/batting-strategy');
	}
</script>

<div class="hero min-h-screen">
	<div class="hero-content flex-col min-w-full">
		{#await loadPlayers()}
			<BallLoader />
		{:then}
			<div class="my-5"><h1 class="text-5xl font-bold">Meet your players</h1></div>
			<div><button class="btn btn-primary" on:click={setLineUp}>Play Now</button></div>
			<div class="min-w-full">
				<div class="flex flex-row flex-wrap">
					{#each playersData as player}
						<div class=" card w-96 m-auto mb-5 bg-base-100 shadow-2xl outline">
							<div class="card-body">
								<h2 class="card-title text-xl font-bold">
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
										<span class="badge badge-accent badge-outline">{player.form}</span>
									</p>
									<p class="text-right">
										<span>Fitness</span>
										<span class="badge badge-accent badge-outline">{player.fitness}</span>
									</p>
								</div>
								<div class="divider-horizontal" />
								<p class="flex flex-row">
									<span class="text-left flex-none font-bold">Fielding</span>
									<span class="text-right flex-1 font-bold" style="color: {player.fielding_color};"
										>{player.fielding}</span
									>
								</p>
								<progress
									class="progress progress-warning w-90"
									value={player.fielding_index}
									max="20"
								/>

								<p class="flex flex-row">
									<span class="text-left flex-none font-bold">Wicket Keeping </span>
									<span
										class="text-right flex-1 font-bold"
										style="color: {player.wicket_keeping_color};">{player.wicket_keeping}</span
									>
								</p>
								<progress
									class="progress progress-warning w-90"
									value={player.wicket_keeping_index}
									max="20"
								/>

								<p class="flex flex-row">
									<span class="text-left flex-none font-bold">Batting vs Seam </span>
									<span
										class="text-right flex-1 font-bold"
										style="color: {player.batting_seam_color};">{player.batting_seam}</span
									>
								</p>
								<progress
									class="progress progress-warning w-90"
									value={player.batting_seam_index}
									max="20"
								/>

								<p class="flex flex-row">
									<span class="text-left flex-none font-bold">Batting vs Spin </span>
									<span
										class="text-right flex-1 font-bold"
										style="color: {player.batting_spin_color};">{player.batting_spin}</span
									>
								</p>
								<progress
									class="progress progress-warning w-90"
									value={player.batting_spin_index}
									max="20"
								/>

								<p class="flex flex-row">
									<span class="text-left flex-none font-bold">Bowling Main </span>
									<span
										class="text-right flex-1 font-bold"
										style="color: {player.bowling_main_color};">{player.bowling_main}</span
									>
								</p>
								<progress
									class="progress progress-warning w-90"
									value={player.bowling_main_index}
									max="20"
								/>

								<p class="flex flex-row">
									<span class="text-left flex-none font-bold">Bowling Variation </span>
									<span
										class="text-right flex-1 font-bold"
										style="color: {player.bowling_variation_color};"
										>{player.bowling_variation}</span
									>
								</p>
								<progress
									class="progress progress-warning w-90"
									value={player.bowling_variation_index}
									max="20"
								/>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/await}
	</div>
</div>
