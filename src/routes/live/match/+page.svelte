<script lang="ts">
	import { serverURL } from '$lib/utils/bowledClient';
	import { goto } from '$app/navigation';
	import savedGame from './gameData.json';
	import { teamID, battingLineUp, bowlingLineUp } from '$lib/stores/gameStore';

	let myTeam: string;
	let gameData = savedGame;
	let batting: any = [];
	let bowling: any = [];
	myTeam = $teamID;

	async function loadGame() {
		try {
			batting = JSON.parse($battingLineUp);
			bowling = JSON.parse($bowlingLineUp);

			if (batting.length < 11 || myTeam.length < 3 || bowling.length < 5) {
				goto('/live/teams');
			}
		} catch (e) {
			goto('/live/teams');
		}

		// load player data
		let url = serverURL + '/live/game?myteam=' + myTeam;
		const response = await fetch(url);

		if (response.status == 200) {
			let data = await response.json();
			gameData = data;
		}
		streamData();
	}

	// stream match data from server
	$: full_match_commentary = gameData.match_commentary;
	// $: current_ball = Math.floor(full_match_commentary.length / 2);
	$: current_ball = 0;
	$: current_ball_data = full_match_commentary[current_ball];
	$: player1 = current_ball_data.striker;
	$: player2 = current_ball_data.bowler;

	if (current_ball_data?.innings == 'Second') {
		player1 = current_ball_data.bowler;
		player2 = current_ball_data.striker;
	}
	async function streamData() {
		while (current_ball < full_match_commentary.length) {
			current_ball += 1;
			await sleep(3000);
		}
	}

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms ?? 200));
	}
</script>

<div class="h-screen max-w-screen-xl m-auto flex flex-col">
	<div>
		{#await loadGame() then}
			<div class="flex w-full flex-none">
				{#if current_ball_data.innings == 'First'}
					<div class="stat text-left bg-primary text-primary-content rounded-box">
						<div class="stat-title">Batting first</div>
						<div class="stat-value text-black">{gameData.team_name}</div>
						<div class="stat-value ">
							<span class="text-3xl"
								>{current_ball_data.current_score} / {current_ball_data.current_wickets}</span
							>
							<span class="text-xl">
								in {current_ball_data.current_over}.{current_ball_data.current_ball} overs
							</span>
						</div>
						<div class="stat-value text-base">This over: {current_ball_data.over_score}</div>
					</div>
					<div class="divider divider-horizontal">vs</div>
					<div class="stat text-right bg-base-200 rounded-box">
						<div class="stat-title">Yet to bat</div>
						<div class="stat-value text-black">{gameData.enemy_team}</div>
						<div class="stat-value ">
							<span class="text-3xl">0 / 0</span>
							<span class="text-xl" />
						</div>
					</div>
				{:else}
					<div class="stat text-left bg-base-200 rounded-box">
						<div class="stat-title">Won the toss, chose to bat first</div>
						<div class="stat-value text-black">{gameData.team_name}</div>
						<div class="stat-value ">
							<span class="text-3xl"
								>{gameData.first_innings.score} / {gameData.first_innings.wickets}</span
							>
							<span class="text-xl">
								in {gameData.first_innings.current_over}.{gameData.first_innings.current_ball} overs
							</span>
						</div>
					</div>
					<div class="divider divider-horizontal">vs</div>
					<div class="stat text-right bg-primary text-primary-content rounded-box">
						<div class="stat-title">
							Chasing {current_ball_data.target - current_ball_data.current_score}
						</div>
						<div class="stat-value text-black">{gameData.enemy_team}</div>
						<div class="stat-value ">
							<span class="text-3xl"
								>{current_ball_data.current_score} / {current_ball_data.current_wickets}</span
							>
							<span class="text-xl">
								in {current_ball_data.current_over}.{current_ball_data.current_ball} overs
							</span>
							<div class="stat-value text-base">This over: {current_ball_data.over_score}</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="p-5 divider-horizontal" />
			<div class="alert alert-success shadow-lg">
				<div>
					{current_ball_data.current_over}.{current_ball_data.current_ball}
					{current_ball_data.bowler?.player_name} to {current_ball_data.striker?.player_name}
					<span>{current_ball_data.outcome_label}</span>
				</div>
			</div>
			<div class="p-5 divider-horizontal" />
			<div class="flex flex-col w-full lg:flex-row">
				<div class="card w-96 bg-base-100 shadow-xl flex-1">
					<!-- <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure> -->
					<div class="card-body">
						<h2 class="card-title">
							{player1.player_name}
						</h2>
						<div class="card-actions justify-start">
							{#if player1.player_type == 'batsman'}
								<div class="badge badge-outline">{player1.batting_type}</div>
							{:else if player1.player_type == 'bowler'}
								<div class="badge badge-outline">{player1.bowling_type}</div>
							{:else if player1.player_type == 'all-rounder'}
								<div class="badge badge-outline">All Rounder</div>
							{:else}
								<div class="badge badge-outline">Wicket Keeper</div>
							{/if}
						</div>
						<div class="divider-horizontal" />
						<div class="flex flex-row">
							<p class="text-left">
								<span>Form</span>
								<span class="badge">{player1.form}</span>
							</p>
							<p class="text-right">
								<span>Fitness</span>
								<span class="badge">{player1.fitness}</span>
							</p>
						</div>
						<div class="divider-horizontal" />
						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Fielding</span>
							<span class="text-right flex-1">{player1.fielding}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player1.fielding_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Wicket Keeping </span>
							<span class="text-right flex-1">{player1.wicket_keeping}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player1.wicket_keeping_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Batting vs Seam </span>
							<span class="text-right flex-1">{player1.batting_seam}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player1.batting_seam_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Batting vs Spin </span>
							<span class="text-right flex-1">{player1.batting_spin}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player1.batting_spin_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Bowling Main </span>
							<span class="text-right flex-1">{player1.bowling_main}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player1.bowling_main_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Bowling Variation </span>
							<span class="text-right flex-1">{player1.bowling_variation}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player1.bowling_variation_index}
							max="20"
						/>
					</div>
				</div>
				<div class="divider lg:divider-horizontal">VS</div>
				<div class=" card w-96 bg-base-100 shadow-xl flex-1">
					<!-- <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure> -->
					<div class="card-body">
						<h2 class="card-title">
							{player2.player_name}
						</h2>
						<div class="card-actions justify-start">
							{#if player2.player_type == 'batsman'}
								<div class="badge badge-outline">{player2.batting_type}</div>
							{:else if player2.player_type == 'bowler'}
								<div class="badge badge-outline">{player2.bowling_type}</div>
							{:else if player2.player_type == 'all-rounder'}
								<div class="badge badge-outline">All Rounder</div>
							{:else}
								<div class="badge badge-outline">Wicket Keeper</div>
							{/if}
						</div>
						<div class="divider-horizontal" />
						<div class="flex flex-row">
							<p class="text-left">
								<span>Form</span>
								<span class="badge">{player2.form}</span>
							</p>
							<p class="text-right">
								<span>Fitness</span>
								<span class="badge">{player2.fitness}</span>
							</p>
						</div>
						<div class="divider-horizontal" />
						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Fielding</span>
							<span class="text-right flex-1">{player2.fielding}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player2.fielding_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Wicket Keeping </span>
							<span class="text-right flex-1">{player2.wicket_keeping}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player2.wicket_keeping_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Batting vs Seam </span>
							<span class="text-right flex-1">{player2.batting_seam}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player2.batting_seam_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Batting vs Spin </span>
							<span class="text-right flex-1">{player2.batting_spin}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player2.batting_spin_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Bowling Main </span>
							<span class="text-right flex-1">{player2.bowling_main}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player2.bowling_main_index}
							max="20"
						/>

						<p class="flex flex-row">
							<span class="text-left flex-none font-bold">Bowling Variation </span>
							<span class="text-right flex-1">{player2.bowling_variation}</span>
						</p>
						<progress
							class="progress progress-warning w-90"
							value={player2.bowling_variation_index}
							max="20"
						/>
					</div>
				</div>
			</div>
		{/await}
	</div>
</div>
