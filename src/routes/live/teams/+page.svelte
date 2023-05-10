<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { teamID } from '$lib/stores/gameStore';
	import LiveTeamList from '$lib/components/teams/LiveTeamList.svelte';

	export let data;
	let { teams } = data;
	let tabSet: string = 'All';
	let searchQuery: string = '';

	async function meetPlayers(myTeam: string, myPlayers: any) {
		teamID.set(myTeam);
		goto('/live/players');
	}

	// search function: local search in the response array
	async function searchTeam() {
		// reset array when search query is empty
		if (searchQuery === '') {
			teams = data.teams;
			return;
		}

		// filter array based on search query
		teams = teams.filter((team) =>
			team.team_name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}
</script>

<div class="flex flex-col h-full">
	<!-- Title -->
	<div class="m-4 text-xl lg:text-4xl font-bold text-center">Choose your favorite team</div>

	<!-- Search bar -->
	<div class="w-1/2 mx-auto">
		<input
			class="input"
			type="search"
			placeholder="Type here to search..."
			bind:value={searchQuery}
			on:input={searchTeam}
		/>
	</div>
	<!-- Tab Group -->
	<TabGroup justify="justify-center">
		<Tab bind:group={tabSet} name="All" value={'All'}>All</Tab>
		<Tab bind:group={tabSet} name="ICC" value={'ICC'}>ICC</Tab>
		<Tab bind:group={tabSet} name="IPL" value={'IPL'}>IPL</Tab>
	</TabGroup>

	<!-- Tab Panels --->
	<div class="overflow-y-scroll">
		{#if tabSet === 'All'}
			<LiveTeamList data={teams} />
		{:else if tabSet === 'IPL'}
			<LiveTeamList data={teams.filter((team) => team.tags.includes(tabSet))} />
		{:else if tabSet === 'ICC'}
			<LiveTeamList data={teams.filter((team) => team.tags.includes(tabSet))} />
		{/if}
	</div>
</div>
