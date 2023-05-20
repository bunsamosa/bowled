<script setup lang="ts">
	export let tossHeader: string;
	export let teamName: string;
	export let runs: number;
	export let wickets: number;
	export let overs: number;
	export let current_over_outcomes: string[] = [];
	export let active: boolean = false;
	export let position: string = 'right';
</script>

<div
	class="card flex flex-col p-4 rounded-xl lg:h-44 overflow-hidden shadow-lg
{position == 'right' ? 'text-right' : 'text-left'}
{active ? 'variant-filled' : 'variant-surface'}"
>
	<!-- Toss result -->
	<span class="font-semibold text-gray-500">
		{tossHeader}
	</span>
	<!-- Team name -->
	<span class="text-2xl lg:text-4xl font-bold lg:my-2">
		{teamName}
	</span>
	<!-- Running score -->
	<span class="text-xl lg:text-3xl font-bold lg:my-1">
		{runs}/{wickets}
		<span class="text-xl">in {overs} overs</span>
	</span>

	<!-- Current over score -->
	{#if current_over_outcomes.length > 0}
		<span class="font-semibold">
			This over: {current_over_outcomes.join(' ')}
		</span>
	{/if}
	<span class="font-semibold" />
</div>
