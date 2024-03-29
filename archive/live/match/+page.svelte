<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { serverURL } from '$lib/utils/bowledClient';
	import { goto } from '$app/navigation';
	import { teamID, battingLineUp, bowlingLineUp } from '$lib/stores/gameStore';
	import BallLoader from '$lib/components/core/BallLoader.svelte';
	// import sampleGame from './sample_game.json';

	let myTeam: string = $teamID;
	let gameData: any = {};
	let batting: any = [];
	let bowling: any = [];
	let payload: any = {};
	let current_over_data = [];
	let full_match_commentary = [];
	let current_ball = 0;
	let current_ball_data = {};
	let current_over = 0;
	let current_over_number = 0;
	let current_over_outcomes = [];
	let previous_over = 0;
	let allPlayers = {};
	let batsman = {};
	let bowler = {};
	let streaming = false;
	let timeoutID: any;
	let runs_required = 0;

	onMount(async () => {
		// load lineup data from store
		try {
			batting = JSON.parse($battingLineUp);
			bowling = JSON.parse($bowlingLineUp);

			if (batting.length < 11 || myTeam.length < 2 || bowling.length < 5) {
				goto('/live/teams');
			}

			let battingPayload = [];
			batting.forEach((player) => {
				battingPayload.push(player.player_id);
			});

			let bowlingPayload = [];
			bowling.forEach((player) => {
				bowlingPayload.push(player.player_id);
			});
			payload = {
				team_id: myTeam,
				batting_lineup: battingPayload,
				bowling_lineup: bowlingPayload
			};
		} catch (e) {
			goto('/live/teams');
		}

		// send lineup data to server and fetch game data
		let url = serverURL + '/live/game';
		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.status == 200) {
			let data = await response.json();
			gameData = data;
			// if (true) {
			// 	gameData = sampleGame;

			full_match_commentary = [
				...gameData.first_innings_score_card.innings_outcomes,
				...gameData.second_innings_score_card.innings_outcomes
			];
			current_ball_data = full_match_commentary[current_ball];
			allPlayers = {
				...gameData.enemy_team,
				...gameData.user_team
			};
			streamData();
		} else {
			alert("We're sorry, something went wrong. Please try again later.");
			goto('/');
		}
	});

	function streamData() {
		console.log('Streaming: Ball ' + (current_ball + 1) + ' of ' + full_match_commentary.length);

		if (current_ball < full_match_commentary.length) {
			current_ball_data = full_match_commentary[current_ball];
			batsman = allPlayers[current_ball_data.batsman_score_card.player_id];
			bowler = allPlayers[current_ball_data.bowler_score_card.player_id];

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

	onDestroy(() => {
		if (streaming) {
			clearTimeout(timeoutID);
		}
	});
</script>

<div class="min-h-screen max-w-screen-xl m-auto flex flex-col mt-5">
	<div>
		{#if streaming}
			<div class="flex w-full flex-col lg:flex-row">
				{#if current_ball_data.innings_score_card.first_innings}
					<div class="stat text-left bg-primary text-primary-content rounded-box">
						<div class="stat-title">{gameData.toss_result}</div>
						<div class="stat-value text-black">{gameData.team_name}</div>
						<div class="stat-value ">
							<span class="text-3xl"
								>{current_ball_data.innings_score_card.runs} / {current_ball_data.innings_score_card
									.wickets}</span
							>
							<span class="text-xl">
								in {current_over} overs
							</span>
						</div>
						<div class="stat-value text-base">This over: {current_over_outcomes.join(' ')}</div>
					</div>
					<div class="divider divider-horizontal">vs</div>
					<div class="stat text-right bg-base-200 rounded-box">
						<div class="stat-title">Yet to bat</div>
						<div class="stat-value text-black">{gameData.enemy_team_name}</div>
						<div class="stat-value ">
							<span class="text-3xl">0 / 0</span>
							<span class="text-xl" />
						</div>
					</div>
				{:else}
					<div class="stat text-left bg-base-200 rounded-box">
						<div class="stat-title">{gameData.toss_result}</div>
						<div class="stat-value text-black">{gameData.team_name}</div>
						<div class="stat-value ">
							<span class="text-3xl"
								>{gameData.first_innings_score_card.runs} / {gameData.first_innings_score_card
									.wickets}</span
							>
							<span class="text-xl">
								in {gameData.first_innings_score_card.overs} overs
							</span>
						</div>
					</div>
					<div class="divider divider-horizontal">vs</div>
					<div class="stat text-right bg-primary text-primary-content rounded-box">
						<div class="stat-title">
							{#if current_ball == full_match_commentary.length}
								{gameData.team_two_game_over_title}
							{:else}
								Need {gameData.second_innings_score_card.target} runs to win
							{/if}
						</div>
						<div class="stat-value text-black">{gameData.enemy_team_name}</div>
						<div class="stat-value ">
							<span class="text-3xl"
								>{current_ball_data.innings_score_card.runs} / {current_ball_data.innings_score_card
									.wickets}</span
							>
							<span class="text-xl">
								in {current_over} overs
							</span>
							<div class="stat-value text-base">This over: {current_over_outcomes.join(' ')}</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="p-5 divider-horizontal" />
			<div class="flex flex-col w-full lg:flex-row">
				<div class="card bg-base-100 shadow-xl flex-1">
					<div class="card-body">
						<h2 class="card-title text-xl font-bold">
							{batsman.player_name}
						</h2>
						<div class="card-actions justify-start">
							{#if batsman.player_type == 'batsman'}
								<div class="badge badge-outline">{batsman.batting_type}</div>
							{:else if batsman.player_type == 'bowler'}
								<div class="badge badge-outline">{batsman.bowling_type}</div>
							{:else if batsman.player_type == 'all-rounder'}
								<div class="badge badge-outline">All Rounder</div>
							{:else}
								<div class="badge badge-outline">Wicket Keeper</div>
							{/if}
						</div>
						<div class="divider-horizontal" />
						<!-- <div class="flex flex-row">
							<p class="text-left">
								<span>Form</span>
								<span class="badge">{batsman.form}</span>
							</p>
							<p class="text-right">
								<span>Fitness</span>
								<span class="badge">{batsman.fitness}</span>
							</p>
						</div> -->
						<div class="divider-horizontal" />
						<div class="flex flex-row">
							<p class="text-left">
								<span>Runs:</span>
								<span class="font-bold"
									>{current_ball_data.batsman_score_card.runs}
									({current_ball_data.batsman_score_card.balls})*</span
								>
							</p>
							<p class="text-right">
								<span>Fours:</span>
								<span class="font-bold">{current_ball_data.batsman_score_card.four}</span>
							</p>
						</div>
						<div class="flex flex-row">
							<p class="text-left">
								<span>Strike rate:</span>
								<span class="font-bold">{current_ball_data.batsman_score_card.strike_rate}%</span>
							</p>
							<p class="text-right">
								<span>Sixes:</span>
								<span class="font-bold">{current_ball_data.batsman_score_card.six}</span>
							</p>
						</div>
						<div class="divider-horizontal" />
						<div>
							<div class="rating rating-lg">
								{#each Array(10) as _, i}
									{#if i + 1 == batsman.batting_rating}
										<input
											type="radio"
											name="rating-batsman"
											class="mask mask-star-2 bg-orange-400"
											checked
										/>
									{:else}
										<input
											type="radio"
											name="rating-batsman"
											class="mask mask-star-2 bg-orange-400"
											disabled
										/>
									{/if}
								{/each}
							</div>
						</div>
					</div>
				</div>
				<div class="divider lg:divider-horizontal">VS</div>
				<div class=" card bg-base-100 shadow-xl flex-1">
					<div class="card-body">
						<h2 class="card-title">
							{bowler.player_name}
						</h2>
						<div class="card-actions justify-start">
							{#if bowler.player_type == 'batsman'}
								<div class="badge badge-outline">{bowler.batting_type}</div>
							{:else if bowler.player_type == 'bowler'}
								<div class="badge badge-outline">{bowler.bowling_type}</div>
							{:else if bowler.player_type == 'all-rounder'}
								<div class="badge badge-outline">All Rounder</div>
							{:else}
								<div class="badge badge-outline">Wicket Keeper</div>
							{/if}
						</div>
						<div class="divider-horizontal" />
						<!-- <div class="flex flex-row">
							<p class="text-left">
								<span>Form</span>
								<span class="badge">{bowler.form}</span>
							</p>
							<p class="text-right">
								<span>Fitness</span>
								<span class="badge">{bowler.fitness}</span>
							</p>
						</div> -->
						<div class="flex flex-row">
							<p class="text-left">
								<span>Overs:</span>
								<span class="font-bold">{current_ball_data.bowler_score_card.overs_bowled}</span>
							</p>
							<p class="text-right">
								<span>Runs:</span>
								<span class="font-bold">{current_ball_data.bowler_score_card.runs}</span>
							</p>
						</div>
						<div class="flex flex-row">
							<p class="text-left">
								<span>Wickets:</span>
								<span class="font-bold">{current_ball_data.bowler_score_card.wickets}</span>
							</p>
							<p class="text-right">
								<span>Economy:</span>
								<span class="font-bold">{current_ball_data.bowler_score_card.economy}</span>
							</p>
						</div>
						<div class="rating rating-lg">
							{#each Array(10) as _, i}
								{#if i + 1 == bowler.bowling_rating}
									<input
										type="radio"
										name="rating-bowler"
										class="mask mask-star-2 bg-orange-400"
										checked
									/>
								{:else}
									<input
										type="radio"
										name="rating-bowler"
										class="mask mask-star-2 bg-orange-400"
										disabled
									/>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			</div>
			<div class="p-5 divider-horizontal" />
			{#each current_over_data as ball_data}
				<div
					class="alert shadow-2xl font-bold mb-3
					{ball_data.outcome == 'wicket' ? 'alert-error' : 'alert-success'}"
				>
					<div>
						{ball_data.innings_score_card.overs}
						{allPlayers[ball_data.bowler_score_card.player_id].player_name} to
						{allPlayers[ball_data.batsman_score_card.player_id].player_name}
						<span class="capitalize">{ball_data.outcome}</span>
					</div>
				</div>
			{/each}
		{:else}<BallLoader />
		{/if}
	</div>
</div>
