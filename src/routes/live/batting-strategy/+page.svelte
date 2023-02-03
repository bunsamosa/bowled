<script lang="ts">
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { battingLineUp, allPlayers, teamID } from '$lib/stores/gameStore';

	let hovering = false;
	let playersData: any = [];
	let myTeam = $teamID;

	async function loadPlayers() {
		try {
			playersData = JSON.parse($allPlayers);

			if (playersData.length < 11 || myTeam.length < 2) {
				goto('/live/teams');
			}
		} catch (e) {
			goto('/live/teams');
		}

		// console.log('loading players of team: ' + myTeam);

		// // load teams data
		// let url = serverURL + '/live/players?myteam=' + myTeam;
		// console.log(url);
		// const response = await fetch(url);
		// if (response.status == 200) {
		// 	let players = await response.json();
		// 	playersData = [...players];
		// 	playersData.set(JSON.stringify(playersData));
		// }
	}

	async function setLineUp() {
		battingLineUp.set(JSON.stringify(playersData));
		goto('/live/bowling-strategy');
	}

	const drop = (event, target) => {
		event.dataTransfer.dropEffect = 'move';
		const start = parseInt(event.dataTransfer.getData('text/plain'));
		const newTracklist = playersData;

		if (start < target) {
			newTracklist.splice(target + 1, 0, newTracklist[start]);
			newTracklist.splice(start, 1);
		} else {
			newTracklist.splice(target, 0, newTracklist[start]);
			newTracklist.splice(start + 1, 1);
		}
		playersData = newTracklist;
		hovering = null;
	};

	const dragstart = (event, i) => {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		const start = i;
		event.dataTransfer.setData('text/plain', start);
	};
</script>

<div class="hero flex-1">
	<div class="hero-content flex-col min-w-full">
		<div class="my-5 flex-none text-center">
			<h1 class="text-5xl font-bold mb-5">Batting Line Up</h1>
			<p>Click and drag to re-order</p>
		</div>
		<div><button class="btn btn-primary" on:click={setLineUp}>Continue</button></div>
		<div class="flex-1">
			{#await loadPlayers() then}
				<div class="list">
					{#each playersData as player, index (player.player_name)}
						<div
							class="list-item hover:bg-blue-600 hover:cursor-move w-96"
							animate:flip
							draggable={true}
							on:dragstart={(event) => dragstart(event, index)}
							on:drop|preventDefault={(event) => drop(event, index)}
							ondragover="return false"
							on:dragenter={() => (hovering = index)}
							class:is-active={hovering === index}
						>
							<div class="text-xl font-bold mb-5">{index + 1}. {player.player_name}</div>
							<div>
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
							</div>
							<!-- <div>
								<div class="rating rating-lg">
									{#each Array(10) as _, i}
										<input
											type="radio"
											name="rating-{player.player_name}"
											class="mask mask-star-2 bg-orange-400"
											checked={i < player.batting_rating}
											disabled={i >= player.batting_rating}
										/>
									{/each}
								</div>
							</div> -->
						</div>
					{/each}
				</div>
			{/await}
		</div>
	</div>
</div>

<style>
	.list {
		background-color: white;
		border-radius: 4px;
		box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
	}

	.list-item {
		display: block;
		padding: 0.5em 1em;
	}

	.list-item:not(:last-child) {
		border-bottom: 3px solid #dbdbdb;
	}

	.list-item.is-active {
		background-color: #3273dc;
		color: #fff;
	}
</style>
