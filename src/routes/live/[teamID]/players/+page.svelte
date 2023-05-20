<script lang="ts">
	import CardSkill from '$lib/components/player/CardSkill.svelte';
	import { faQuestionCircle, faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { goto } from '$app/navigation';
	import { sortByWicketKeeping, sortByBatting, sortByBowling } from '$lib/utils/players';
	import { LivePlayers } from '$lib/stores/LiveGame';

	// read players data
	export let data;
	let { players, teamID } = data;
	// sort by name
	players = players.sort((a: any, b: any) => a.player_name.localeCompare(b.player_name));

	// create a map of player id to player data
	let playersData: any = {};
	players.forEach((player: any) => {
		playersData[player.player_id] = player;
	});

	//  selected players array
	let selectedPlayers = Array.from({ length: 0 }, (i) => 0);

	// pick a player: add the player to selected players if not already present
	function selectPlayer(id: number) {
		// enforce 11 player limit
		if (selectedPlayers.length >= 11) {
			alert('You can pick a maximum of 11 players');
			return;
		}

		if (!selectedPlayers.includes(id)) {
			selectedPlayers = [...selectedPlayers, id];
		}
	}

	// remove a player: remove the player from selected players if present
	function removePlayer(id: number) {
		if (selectedPlayers.includes(id)) {
			selectedPlayers = selectedPlayers.filter((playerID) => playerID != id);
		}
	}

	// auto fill: select 11 players from the list
	// 1 wicket keeper, 5 batsmen, 5 bowlers in the order of their batting/bowling index
	function autoFill() {
		clearAll();

		// sort by wicket keeping index and pick the first player
		let wicketKeepers = sortByWicketKeeping(players);
		let wicketKeeperID = wicketKeepers[0].player_id;
		selectPlayer(wicketKeeperID);

		// sort by batting index and pick the first 5 players who are not already selected
		let batsmen = sortByBatting(players);
		// remove the WK from the list
		batsmen = batsmen.filter((player) => !selectedPlayers.includes(player.player_id));
		// pick the first 5 players
		for (let i = 0; i < 5; i++) {
			selectPlayer(batsmen[i].player_id);
		}

		// sort by bowling index and pick the first 5 players who are not already selected
		let bowlers = sortByBowling(players);

		// remove selected players from the list
		bowlers = bowlers.filter((player) => !selectedPlayers.includes(player.player_id));
		// pick the first 5 players
		for (let i = 0; i < 5; i++) {
			selectPlayer(bowlers[i].player_id);
		}
	}

	// clear all players
	function clearAll() {
		// clear selected players
		selectedPlayers = Array.from({ length: 0 }, (i) => 0);
	}

	// play game: store player data and navigate to game page
	function playGame() {
		// store player data
		LivePlayers.set({ players: selectedPlayers });

		// navigate to game page
		goto(`/live/${teamID}/match`);
	}
</script>

<div class="flex flex-col h-full">
	<!-- Title -->
	<div class="m-2 text-xl lg:text-4xl font-bold text-center">Choose playing XI</div>

	<div class="flex flex-col variant-ringed m-2 rounded-xl">
		<!-- Subtitle section -->
		<div class="flex flex-row items-center justify-center">
			<span class="text-lg text-center">You need a team of 11 players to play a game</span>
			<!-- Help button -->
			<button class="btn p-0 m-2 hover:brightness-50">
				<Fa size="lg" icon={faQuestionCircle} />
			</button>
		</div>

		<!-- Selected players section -->
		<div class="flex flex-row min-h-[48px] flex-wrap items-center justify-center">
			{#each selectedPlayers as playerID}
				<div
					class="card m-2 p-2 rounded-lg shadow-lg overflow-hidden
            flex flex-row items-center justify-center"
				>
					{#if playerID > 0}
						<span class="font-semibold text-center">{playersData[playerID]?.player_name}</span>
						<button
							class="btn p-0 ml-2 hover:brightness-50"
							on:click={() => removePlayer(playerID)}
						>
							<Fa size="2x" color="red" icon={faRectangleXmark} />
						</button>
					{:else}
						<Fa size="2x" color="gray" icon={faPlus} />
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Action buttons: Auto-fill, clear all and Play -->
	<div class="flex flex-row justify-center items-center">
		<button class="btn variant-filled-secondary m-2" type="button" on:click={autoFill}>
			Pick for me
		</button>
		<button
			class="btn variant-filled m-2"
			type="button"
			on:click={clearAll}
			disabled={selectedPlayers.length == 0}>Clear All</button
		>
		<button
			class="btn variant-filled-primary m-2"
			type="button"
			on:click={playGame}
			disabled={selectedPlayers.length < 11}>Play Now</button
		>
	</div>
	<span class="text-lg text-center m-1"
		>Select players from below ({selectedPlayers.length}/11 selected)</span
	>

	<!-- Player cards -->
	<div class="flex flex-row flex-wrap overflow-y-scroll justify-center">
		{#each players as player}
			<div
				class="card w-72 h-auto m-3 rounded-xl shadow-lg overflow-hidden
				variant-filled flex flex-col items-center py-2 px-4"
			>
				<!-- Player avatar -->
				<img
					class="object-cover object-top h-36 w-full"
					src={player.avatar_url}
					alt={player.name}
				/>
				<!-- Player name -->
				<div class="text-xl font-bold text-center my-1">{player.player_name}</div>
				<!-- Player type -->
				<div class="variant-ringed-secondary rounded-xl text-sm font-semibold px-2 capitalize">
					{player.player_type}
				</div>
				<!-- Form and Fitness -->
				<div class="flex flex-row justify-between w-full my-2">
					<div>
						<span class="">Form:</span>
						<span class="font-semibold">{player.form}</span>
					</div>
					<div>
						<span>Fitness:</span>
						<span class="font-semibold">{player.fitness}</span>
					</div>
				</div>
				<!-- Player skills -->
				<CardSkill
					skillName="Fielding"
					skillColor={player.fielding_color}
					skillLevel={player.fielding}
					skillIndex={player.fielding_index}
				/>
				<CardSkill
					skillName="Wicket Keeping"
					skillColor={player.wicket_keeping_color}
					skillLevel={player.wicket_keeping}
					skillIndex={player.wicket_keeping_index}
				/>
				<CardSkill
					skillName="Batting vs Seam"
					skillColor={player.batting_seam_color}
					skillLevel={player.batting_seam}
					skillIndex={player.batting_seam_index}
				/>
				<CardSkill
					skillName="Batting vs Spin"
					skillColor={player.batting_spin_color}
					skillLevel={player.batting_spin}
					skillIndex={player.batting_spin_index}
				/>
				<CardSkill
					skillName="Bowling Main"
					skillColor={player.bowling_main_color}
					skillLevel={player.bowling_main}
					skillIndex={player.bowling_main_index}
				/>
				<CardSkill
					skillName="Bowling Variation"
					skillColor={player.bowling_variation_color}
					skillLevel={player.bowling_variation}
					skillIndex={player.bowling_variation_index}
				/>
				{#if selectedPlayers.includes(player.player_id)}
					<button
						class="btn w-full my-2 variant-filled-error"
						on:click={() => removePlayer(player.player_id)}
					>
						Remove
					</button>
				{:else}
					<button
						class="btn w-full my-2 variant-filled-secondary"
						on:click={() => selectPlayer(player.player_id)}
					>
						Pick
					</button>
				{/if}
			</div>
		{/each}
	</div>
</div>
