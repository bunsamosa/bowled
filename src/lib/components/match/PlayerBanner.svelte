<script setup lang="ts">
	export let player: any;
	export let bannerType: string = 'batsman';
	export let current_ball_data: any;
	export let position: string = 'right';
</script>

<div
	class="card variant-glass-secondary flex flex-col py-2 px-4 rounded-xl overflow-hidden shadow-lg
	{position == 'right' ? 'text-right' : 'text-left'}"
>
	<!-- Batsman name and attributes -->
	<span class="font-semibold text-gray-500">
		{bannerType == 'batsman' ? 'Batsman' : 'Bowler'}
	</span>
	<span class="font-bold text-xl lg:text-2xl"> {player.player_name}</span>
	<span class="justify-start my-1">
		<span class="badge variant-filled rounded-xl capitalize">
			{bannerType == 'batsman' ? player.batting_type : player.bowling_type}
		</span>
	</span>

	{#if bannerType == 'batsman'}
		<!-- Batsman current score and stats -->
		<div class="flex flex-row justify-between my-1 mt-2">
			<!-- Runs -->
			<span>
				<span>Runs:</span>
				<span class="font-bold">
					{current_ball_data.batsman_score_card.runs}
					({current_ball_data.batsman_score_card.balls})*
				</span>
			</span>
			<!-- Fours -->
			<span>
				<span>Fours:</span>
				<span class="font-bold">
					{current_ball_data.batsman_score_card.four}
				</span>
			</span>
		</div>
		<div class="flex flex-row justify-between">
			<!-- Strike rate -->
			<span>
				<span>Strike rate:</span>
				<span class="font-bold">
					{current_ball_data.batsman_score_card.strike_rate.toFixed(2)}%
				</span>
			</span>
			<!-- Sixes -->
			<span>
				<span>Sixes:</span>
				<span class="font-bold">
					{current_ball_data.batsman_score_card.six}
				</span>
			</span>
		</div>
	{:else}
		<!-- Bowler current score and stats -->
		<div class="flex flex-row justify-between my-1 mt-2">
			<!-- Overs -->
			<span>
				<span>Overs:</span>
				<span class="font-bold">
					{current_ball_data.bowler_score_card.overs_bowled}
				</span>
			</span>
			<!-- Runs -->
			<span>
				<span>Runs:</span>
				<span class="font-bold">
					{current_ball_data.bowler_score_card.runs}
				</span>
			</span>
		</div>
		<div class="flex flex-row justify-between">
			<!-- Wickets -->
			<span>
				<span>Wickets:</span>
				<span class="font-bold">
					{current_ball_data.bowler_score_card.wickets}
				</span>
			</span>
			<!-- Economy -->
			<span>
				<span>Economy:</span>
				<span class="font-bold">
					{current_ball_data.bowler_score_card.economy}
				</span>
			</span>
		</div>
	{/if}
</div>
