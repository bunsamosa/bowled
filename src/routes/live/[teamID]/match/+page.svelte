<script setup lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TeamBanner from '$lib/components/match/TeamBanner.svelte';
	import BallLoader from '$lib/components/core/BallLoader.svelte';
	import PlayerBanner from '$lib/components/match/PlayerBanner.svelte';
	export let data;
	const { gameData } = data;

	// define game state variables
	let current_ball = 150;
	let current_ball_data: any = {};
	let current_over = 0;
	let current_over_number = 0;
	let current_over_data: any = [];
	let current_over_outcomes: any = [];
	let previous_over = 0;
	let batsman: any = {};
	let bowler: any = {};
	let streaming = false;
	let timeoutID: any;
	let runs_required = 0;
	let full_match_commentary: any = [];
	let all_players: any = {};

	// stream match data
	function streamData() {
		console.log('Streaming: Ball ' + (current_ball + 1) + ' of ' + full_match_commentary.length);

		if (current_ball < full_match_commentary.length) {
			current_ball_data = full_match_commentary[current_ball];
			batsman = all_players[current_ball_data.batsman_score_card.player_id];
			bowler = all_players[current_ball_data.bowler_score_card.player_id];

			current_ball_data = full_match_commentary[current_ball];
			current_over = current_ball_data.innings_score_card.overs;
			current_over_outcomes = current_ball_data.over_score_card.outcomes;
			current_over_data = [current_ball_data, ...current_over_data];
			current_over_number = current_ball_data.over_score_card.overs;

			if (current_over_number != previous_over) {
				current_over_data = [current_ball_data];
			}

			current_ball++;
			previous_over = current_over_number;
			if (current_ball < full_match_commentary.length) {
				streaming = true;
				timeoutID = setTimeout(streamData, 3000);
			}
		}
	}

	// start the match on mount
	onMount(() => {
		// read state data from game data
		full_match_commentary = [
			...gameData.first_innings_score_card.innings_outcomes,
			...gameData.second_innings_score_card.innings_outcomes
		];
		current_ball_data = full_match_commentary[current_ball];
		all_players = {
			...gameData.enemy_team,
			...gameData.user_team
		};
		console.log(gameData);

		streamData();
	});

	// clear timeout on closing the page
	onDestroy(() => {
		if (streaming) {
			clearTimeout(timeoutID);
		}
	});
</script>

<div class="flex flex-col h-full overflow-y-scroll">
	{#if streaming}
		<!-- Score banner -->
		<div class="flex flex-col lg:flex-row w-full justify-center items-center">
			{#if current_ball_data.innings_score_card.first_innings}
				<!-- First innings banner -->
				<div class="w-4/5 lg:w-1/2 m-2 lg:m-5">
					<TeamBanner
						active={true}
						position="left"
						tossHeader={gameData.toss_result}
						teamName={gameData.team_name}
						runs={current_ball_data.innings_score_card.runs}
						wickets={current_ball_data.innings_score_card.wickets}
						overs={current_over}
						{current_over_outcomes}
					/>
				</div>
				<div class="w-4/5 lg:w-1/2 m-2 lg:m-5">
					<TeamBanner
						active={false}
						tossHeader="Yet to bat"
						teamName={gameData.enemy_team_name}
						runs={0}
						wickets={0}
						overs={0}
					/>
				</div>
			{:else}
				<!-- Second innings banner -->
				<div class="w-4/5 lg:w-1/2 m-2 lg:m-5">
					<TeamBanner
						position="left"
						tossHeader={gameData.toss_result}
						teamName={gameData.team_name}
						runs={gameData.first_innings_score_card.runs}
						wickets={gameData.first_innings_score_card.wickets}
						overs={gameData.first_innings_score_card.overs}
					/>
				</div>
				<div class="w-4/5 lg:w-1/2 m-2 lg:m-5">
					<TeamBanner
						active={true}
						tossHeader="Need {gameData.second_innings_score_card.target} runs to win"
						teamName={gameData.enemy_team_name}
						runs={current_ball_data.innings_score_card.runs}
						wickets={current_ball_data.innings_score_card.wickets}
						overs={current_over}
						{current_over_outcomes}
					/>
				</div>
			{/if}
		</div>
		<!-- Player banner -->
		<div class="flex flex-col lg:flex-row w-full justify-center items-center">
			<!-- Batsman -->
			<div class="w-4/5 lg:w-1/2 mx-5 my-2">
				<PlayerBanner position="left" bannerType="batsman" player={batsman} {current_ball_data} />
			</div>
			<!-- Bowler -->
			<div class="w-4/5 lg:w-1/2 m-5 my-2">
				<PlayerBanner position="right" bannerType="bowler" player={bowler} {current_ball_data} />
			</div>
		</div>
		<!-- Commentary -->
		<span class="text-xl font-bold text-center my-4">Live Commentary</span>
		<div class="flex flex-col justify-center items-center w-full">
			{#each current_over_data as ball_data}
				<div
					class="card my-2 p-3 w-2/3
				{ball_data.outcome == 'out' ? 'variant-filled-error' : 'variant-filled-success'}"
				>
					<span class="text-lg font-semibold">
						{ball_data.innings_score_card.overs.toFixed(1)}
						{all_players[ball_data.bowler_score_card.player_id].player_name} to
						{all_players[ball_data.batsman_score_card.player_id].player_name}
						<span class="capitalize">{ball_data.outcome}</span>
					</span>
				</div>
			{/each}
		</div>
	{:else}
		<BallLoader />
	{/if}
</div>
