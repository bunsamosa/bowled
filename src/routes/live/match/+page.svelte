<script lang="ts">
	import { serverURL } from '$lib/utils/bowledClient';
	import { goto } from '$app/navigation';
	import savedGame from './gameData.json';
	import { teamID, battingLineUp, bowlingLineUp } from '$lib/stores/gameStore';

	let myTeam: string;
	let gameData = savedGame;
	let batting: any = [];
	let bowling: any = [];
	let payload;
	myTeam = $teamID;

	async function loadGame() {
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

		// load player data
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
		}
		streamData();
	}

	function isDisabled(a, b) {
		console.log(a, b, a >= b);
		return a >= b;
	}

	let current_over_data = [];
	// stream match data from server
	$: full_match_commentary = gameData.match_commentary;
	// $: current_ball = Math.floor(full_match_commentary.length / 2);
	$: current_ball = 0;
	$: current_ball_data = full_match_commentary[current_ball];
	$: player1 = current_ball_data.striker;
	$: player2 = current_ball_data.bowler;

	if (current_ball_data?.innings == 'Second') {
		player1 = current_ball_data.striker;
		player2 = current_ball_data.bowler;
	}
	async function streamData() {
		let current_over = 0;
		let previous_over = 0;

		current_over_data = [];
		while (current_ball < full_match_commentary.length) {
			previous_over = current_ball_data.current_over;
			current_ball_data = full_match_commentary[current_ball];
			current_over = current_ball_data.current_over;
			current_over_data = [current_ball_data, ...current_over_data];

			if (current_over != previous_over) {
				current_over_data = [current_ball_data];
			}
			await sleep(3000);
			current_ball += 1;
		}
	}

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms ?? 200));
	}
</script>

<div class="h-screen max-w-screen-xl m-auto flex flex-col">
	<div>
		{#await loadGame() then}
			<div class="flex w-full flex-col lg:flex-row">
				{#if current_ball_data.innings == 'First'}
					<div class="stat text-left bg-primary text-primary-content rounded-box">
						<div class="stat-title">{gameData.toss_result}</div>
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
			{#each current_over_data as ball_data}
				<div class="alert alert-success shadow-2xl font-bold mb-3">
					<div>
						{ball_data.current_over}.{ball_data.current_ball}
						{ball_data.bowler?.player_name} to {ball_data.striker?.player_name}
						<span>{ball_data.outcome_label}</span>
					</div>
				</div>
			{/each}
			<div class="p-5 divider-horizontal" />
			<div class="flex flex-col w-full lg:flex-row">
				<div class="card bg-base-100 shadow-xl flex-1">
					<div class="card-body">
						<h2 class="card-title text-xl font-bold">
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
						<div>
							<div class="rating rating-lg">
								{#each Array(10) as _, i}
									{#if i + 1 == player1.batting_rating}
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
						<div class="rating rating-lg">
							{#each Array(10) as _, i}
								{#if i + 1 == player2.bowling_rating}
									<input
										type="radio"
										name="rating-bowler"
										class="mask mask-star-2 bg-orange-400"
										checked
									/>
								{:else}
									<input type="radio" name="rating-bowler" class="mask mask-star-2 bg-orange-400" />
								{/if}
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/await}
	</div>
</div>
