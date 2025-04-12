<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import CardSkill from '$lib/components/player/CardSkill.svelte';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { LiveTeamPlayer } from '$lib/stores/turnBasedState';

	// Props for carousel mode
	export let players: LiveTeamPlayer[] = [];
	export let selectedPlayerId1: string | null = null;
	export let selectedPlayerId2: string | null = null;
	export let label1: string = 'Selected 1';
	export let label2: string = 'Selected 2';
	export let disabled: boolean = false;
	export let displayMode: 'batting' | 'bowling' = 'batting';

	// Props for fixed display mode (optional)
	export let fixedPlayers: (LiveTeamPlayer | null)[] | null = null;
	export let fixedLabels: (string | null)[] = [];

	const dispatch = createEventDispatcher();

	let scrollContainer: HTMLElement;
	let showLeftScroll = false;
	let showRightScroll = false;

	// Function to check scroll state
	function checkScroll() {
		if (!scrollContainer) return;
		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
		// Add a small tolerance (e.g., 1 pixel) for floating point inaccuracies
		showLeftScroll = scrollLeft > 1;
		showRightScroll = scrollLeft < scrollWidth - clientWidth - 1;
	}

	// Function to scroll the container
	function scrollCarousel(direction: 'left' | 'right') {
		if (!scrollContainer) return;
		const scrollAmount = scrollContainer.clientWidth * 0.7; // Scroll by 70% of visible width
		scrollContainer.scrollBy({
			left: direction === 'left' ? -scrollAmount : scrollAmount,
			behavior: 'smooth'
		});
		// Re-check scroll after a short delay to allow smooth scroll to update
		setTimeout(checkScroll, 350);
	}

	// Reactive check ONLY for when players array updates after mount
	// Setup and initial check happen in onMount
	$: if (scrollContainer && players) {
		checkScroll(); // Re-check scroll if players list changes
	}

	// Setup ResizeObserver on mount
	onMount(() => {
		if (scrollContainer) {
			const resizeObserver = new ResizeObserver(() => {
				checkScroll();
			});
			resizeObserver.observe(scrollContainer);
			checkScroll(); // Initial check on mount

			// Return the cleanup function to be called on component destroy
			return () => {
				resizeObserver.disconnect();
			};
		}
	});

	function handleSelect(playerId: string) {
		if (!disabled) {
			dispatch('select', { playerId });
		}
	}
</script>

{#if fixedPlayers}
	<!-- Fixed Player Display Mode -->
	<div class="flex flex-wrap justify-center gap-4">
		{#each fixedPlayers as player, i}
			{#if player}
				<div
					class="card w-52 h-[260px] rounded-lg shadow-md overflow-hidden variant-filled flex flex-col items-center p-1.5 font-['RobotoMono']"
				>
					<!-- Card Content (copied from carousel logic) -->
					<div class="flex flex-row w-full h-14 mb-1">
						<Avatar src={player.avatar_url} class="w-1/3 object-scale-down rounded-none" background="" width="w-auto"/>
						<div class="flex flex-col w-2/3 items-start text-left justify-center pl-2">
							<span class="font-semibold text-sm leading-tight">{player.player_name}</span>
							<span class="text-[10px] capitalize variant-ringed-secondary rounded-lg px-1 mt-0.5">
								{player.player_type}
							</span>
						</div>
					</div>
					<!-- Show Label if provided -->
					{#if fixedLabels[i]}
						<span class="badge text-xs variant-filled-primary mb-1 w-full justify-center">{fixedLabels[i]}</span>
					{/if}

					<!-- Relevant Skills -->
					<div class="w-full space-y-1 mt-1 flex-grow">
						{#if displayMode === 'batting'}
							<CardSkill skillName="Bat vs Seam" skillColor={player.batting_seam_color} skillLevel={player.batting_seam} skillIndex={player.batting_seam_index} />
							<CardSkill skillName="Bat vs Spin" skillColor={player.batting_spin_color} skillLevel={player.batting_spin} skillIndex={player.batting_spin_index} />
						{:else if displayMode === 'bowling'}
							<CardSkill skillName="Bowling Main" skillColor={player.bowling_main_color} skillLevel={player.bowling_main} skillIndex={player.bowling_main_index} />
							<CardSkill skillName="Bowling Var" skillColor={player.bowling_variation_color} skillLevel={player.bowling_variation} skillIndex={player.bowling_variation_index} />
						{/if}
					</div>
				</div>
			{:else}
				<!-- Placeholder if player data is null in the fixed array -->
				<div class="card w-52 h-[260px] rounded-lg variant-filled flex items-center justify-center">
					<p class="text-surface-500 italic text-sm">-</p>
				</div>
			{/if}
		{/each}
	</div>
{:else}
	<!-- Original Carousel Mode -->
	<div class="relative w-full">
		<!-- Carousel Container -->
		<div
			bind:this={scrollContainer}
			on:scroll={checkScroll}
			class="flex overflow-x-auto space-x-3 p-2 bg-surface-200-700-token rounded-lg scroll-smooth snap-x snap-mandatory"
			style="scrollbar-width: none; /* Hide scrollbar for Firefox */ -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */"
		>
			<!-- Hide scrollbar for Chrome/Safari/Opera -->
			<style>
				div::-webkit-scrollbar {
					display: none;
				}
			</style>

			{#each players as player (player.player_id)}
				{@const playerIdStr = String(player.player_id)}
				{@const isSelected1 = selectedPlayerId1 === playerIdStr}
				{@const isSelected2 = selectedPlayerId2 === playerIdStr}
				<button
					type="button"
					class="card w-52 h-[260px] rounded-lg shadow-md overflow-hidden variant-filled flex flex-col items-center p-1.5 font-['RobotoMono'] shrink-0 snap-start
						   {isSelected1 ? 'ring-4 ring-primary-500' : ''}
						   {isSelected2 ? 'ring-4 ring-secondary-500' : ''}
						   {(!isSelected1 && !isSelected2 && !disabled) ? 'hover:ring-2 hover:ring-primary-300 cursor-pointer' : ''}
						   {disabled ? 'opacity-70 cursor-not-allowed' : ''}"
					on:click={() => handleSelect(playerIdStr)}
					{disabled}
				>
					<!-- Reduced Height Card Content -->
					<div class="flex flex-row w-full h-14 mb-1">
						<Avatar src={player.avatar_url} class="w-1/3 object-scale-down rounded-none" background="" width="w-auto"/>
						<div class="flex flex-col w-2/3 items-start text-left justify-center pl-2">
							<span class="font-semibold text-sm leading-tight">{player.player_name}</span>
							<span class="text-[10px] capitalize variant-ringed-secondary rounded-lg px-1 mt-0.5">
								{player.player_type}
							</span>
						</div>
					</div>
					<!-- Show Labels if selected -->
					{#if isSelected1}
						<span class="badge text-xs variant-filled-primary mb-1 w-full justify-center">{label1}</span>
					{/if}
					{#if isSelected2}
						<span class="badge text-xs variant-filled-secondary mb-1 w-full justify-center">{label2}</span>
					{/if}
					<!-- Relevant Skills -->
					<div class="w-full space-y-1 mt-1 flex-grow">
						{#if displayMode === 'batting'}
							<CardSkill skillName="Bat vs Seam" skillColor={player.batting_seam_color} skillLevel={player.batting_seam} skillIndex={player.batting_seam_index} />
							<CardSkill skillName="Bat vs Spin" skillColor={player.batting_spin_color} skillLevel={player.batting_spin} skillIndex={player.batting_spin_index} />
						{:else if displayMode === 'bowling'}
							<CardSkill skillName="Bowling Main" skillColor={player.bowling_main_color} skillLevel={player.bowling_main} skillIndex={player.bowling_main_index} />
							<CardSkill skillName="Bowling Var" skillColor={player.bowling_variation_color} skillLevel={player.bowling_variation} skillIndex={player.bowling_variation_index} />
						{/if}
					</div>
				</button>
			{:else}
				<p class="w-full text-center py-10 text-surface-500">No players to display.</p>
			{/each}
		</div>

		<!-- Scroll Buttons -->
		{#if showLeftScroll}
			<button
				on:click={() => scrollCarousel('left')}
				class="absolute left-0 top-1/2 transform -translate-y-1/2 btn btn-sm rounded-full variant-filled-surface opacity-70 hover:opacity-100 z-10 -ml-3"
				aria-label="Scroll left"
			>
				<Fa icon={faChevronLeft} size="xs"/>
			</button>
		{/if}
		{#if showRightScroll}
			<button
				on:click={() => scrollCarousel('right')}
				class="absolute right-0 top-1/2 transform -translate-y-1/2 btn btn-sm rounded-full variant-filled-surface opacity-70 hover:opacity-100 z-10 -mr-3"
				aria-label="Scroll right"
			>
				<Fa icon={faChevronRight} size="xs" />
			</button>
		{/if}
	</div>
{/if}
