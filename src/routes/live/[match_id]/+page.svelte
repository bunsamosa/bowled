<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation'; // Import goto
	import { Modal, modalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton'; // Import Skeleton modal components
	import PlayerSelectorCarousel from '$lib/components/match/PlayerSelectorCarousel.svelte'; // Import the new component

	// Import the game state store and type/helpers
	import {
		turnBasedGameState,
		setGameState,
		resetGameState,
		type GameState,
		type LiveTeamPlayer, // Use the imported type
		type PlayerScorecard, // Import the PlayerScorecard type
		type BowlResultOutput // Import the BowlResultOutput type
	} from '$lib/stores/turnBasedState';

	// Import the API client helper
	import { serverURL } from '$lib/utils/bowledClient';

	// Reactive variable for the match ID from the route
	let matchId: string | null = null;
	$: matchId = $page.params.match_id;

	// Subscribe to the game state store
	let currentGameState: GameState | null = null;
	$: currentGameState = $turnBasedGameState;

	// --- State for UI actions ---
	let selectedStrikerId: string = '';
	let selectedNonStrikerId: string = '';
	let isSubmittingOpeners = false;
	let openerError: string | null = null;

	let selectedBowlerId: string = ''; // State for bowler selection
	let isSubmittingBowler = false;    // Loading state for bowler submission
	let bowlerError: string | null = null; // Error state for bowler submission

	let isBowlingNextBall = false; // Loading state for bowling next ball
	let bowlError: string | null = null; // Error state for bowling next ball

	let selectedNextBatsmanId: string = ''; // State for next batsman selection
	let isSubmittingNextBatsman = false; // Loading state for next batsman submission
	let nextBatsmanError: string | null = null; // Error state for next batsman submission

	let isStartingNextInnings = false; // Loading state for starting next innings
	let startNextInningsError: string | null = null; // Error state for starting next innings

	// --- Derived state for UI ---
	// Helper function to get player details from combined squads
	const getPlayerDetails = (state: GameState | null, playerId: string | null | undefined): LiveTeamPlayer | null => {
		if (!state || !playerId) return null;
		const allPlayers = [...(state.team1_squad || []), ...(state.team2_squad || [])];
		return allPlayers.find(p => String(p.player_id) === playerId) || null;
	};

	// Get current players on field
	const currentStriker = derived(turnBasedGameState, $state => getPlayerDetails($state, $state?.batsman_on_strike_id));
	const currentNonStriker = derived(turnBasedGameState, $state => getPlayerDetails($state, $state?.batsman_off_strike_id));
	const currentBowler = derived(turnBasedGameState, $state => getPlayerDetails($state, $state?.current_bowler_id));

	// Get current player scorecards
	const currentStrikerScorecard = derived(turnBasedGameState, $state =>
		$state?.player_scorecards && $state.batsman_on_strike_id
		? $state.player_scorecards[$state.batsman_on_strike_id]
		: null
	);
	const currentNonStrikerScorecard = derived(turnBasedGameState, $state =>
		$state?.player_scorecards && $state.batsman_off_strike_id
		? $state.player_scorecards[$state.batsman_off_strike_id]
		: null
	);
	const currentBowlerScorecard = derived(turnBasedGameState, $state =>
		$state?.player_scorecards && $state.current_bowler_id
		? $state.player_scorecards[$state.current_bowler_id]
		: null
	);

	// Helper to get FULL available batsmen details for the cards
	const availableBatsmenFullDetails = derived(turnBasedGameState, ($state): LiveTeamPlayer[] => {
		if (!$state || !$state.batting_team_id || !$state.available_batsman_ids) return [];

		const battingSquad = $state.batting_team_id === $state.team1_id
			? $state.team1_squad
			: $state.team2_squad;

		if (!battingSquad) return [];

		// Map available IDs to full player objects from the squad
		const playerMap = new Map(battingSquad.map(p => [String(p.player_id), p]));
		return $state.available_batsman_ids
			.map(playerId => playerMap.get(playerId))
			.filter((p): p is LiveTeamPlayer => p !== undefined)
			.sort((a, b) => {
				const skillSumA = (a.batting_seam_index || 0) + (a.batting_spin_index || 0);
				const skillSumB = (b.batting_seam_index || 0) + (b.batting_spin_index || 0);
				return skillSumB - skillSumA; // Sort descending
			});
	});

	// Helper to get FULL available bowler details
	const availableBowlersFullDetails = derived(turnBasedGameState, ($state): LiveTeamPlayer[] => {
		if (!$state || !$state.bowling_team_id || !$state.available_bowler_ids) return [];

		const bowlingSquad = $state.bowling_team_id === $state.team1_id
			? $state.team1_squad
			: $state.team2_squad;

		if (!bowlingSquad) return [];

		const playerMap = new Map(bowlingSquad.map(p => [String(p.player_id), p]));
		return $state.available_bowler_ids
			.map(playerId => playerMap.get(playerId))
			.filter((p): p is LiveTeamPlayer => p !== undefined)
			.sort((a, b) => {
				const skillSumA = (a.bowling_main_index || 0) + (a.bowling_variation_index || 0);
				const skillSumB = (b.bowling_main_index || 0) + (b.bowling_variation_index || 0);
				return skillSumB - skillSumA; // Sort descending
			});
	});

	// Determine if the current action requires INTERACTIVE selection by the user (team1)
	const isUserSelectionRequired = derived(turnBasedGameState, ($state) => {
		if (!$state || !$state.status) return false;

		const userTeamId = $state.team1_id; // Assuming team1 is always user

		switch ($state.status) {
			case GameStatus.REQUIRES_OPENERS:
			case GameStatus.REQUIRES_BATSMAN:
				return $state.batting_team_id === userTeamId;
			case GameStatus.REQUIRES_BOWLER:
				return $state.bowling_team_id === userTeamId;
			// case GameStatus.READY_FOR_BALL: // No interactive selection needed
			// case GameStatus.INNINGS_BREAK: // Button click, not selection
			// case GameStatus.COMPLETED: // No action
			default:
				return false;
		}
	});

	// Determine if user team (team1) is currently batting or bowling
	const isUserTeamBatting = derived(turnBasedGameState, $state => $state?.batting_team_id === $state?.team1_id);

	// Helper to get the latest OverSummary
	const latestOverSummary = derived(turnBasedGameState, $state => {
		if (!$state || !$state.over_summaries || $state.over_summaries.length === 0) return null;
		return $state.over_summaries[$state.over_summaries.length - 1];
	});

	// Helper to format overs
	const formatOvers = (state: GameState | null): string => {
		if (!state) return "0.0";
		return `${state.current_over}.${state.current_ball_in_over}`;
	};

	// Helper to format bowler figures
	const formatBowlerFigures = (scorecard: PlayerScorecard | null): string => {
		if (!scorecard?.bowling) return "-";
		const b = scorecard.bowling;
		return `${b.overs_bowled.toFixed(1)}-${b.maidens}-${b.runs_conceded}-${b.wickets_taken}`;
	};

	// Helper to format ball outcome for commentary
	const formatOutcome = (ball: any, state: GameState | null): string => {
		if (!ball) return "";
		if (ball.is_wicket) {
			return `OUT! ${ball.wicket_type || 'Wicket'}`;
		}
		if (ball.extras_type) {
			return `${ball.extras_runs} ${ball.extras_type}`;
		}
		if (ball.runs_scored === 0) return "dot ball";
		if (ball.runs_scored === 1) return "1 run";
		if (ball.runs_scored === 4) return "FOUR";
		if (ball.runs_scored === 6) return "SIX";
		return `${ball.runs_scored} runs`;
	};

	// Helper to get full team name from ID
	const getTeamName = (state: GameState | null, teamId: string | null | undefined): string => {
		if (!state || !teamId) return teamId || "?"; // Fallback to ID or ?
		if (state.team1_id === teamId) return state.team1_name || teamId;
		if (state.team2_id === teamId) return state.team2_name || teamId;
		return teamId; // Fallback if ID doesn't match somehow
	};

	// Helper to format status ID to human-readable text
	const formatStatus = (statusId: string | null | undefined): string => {
		if (!statusId) return "N/A";
		// Simple mapping, can be extended
		const map: { [key: string]: string } = {
			[GameStatus.REQUIRES_OPENERS]: "Select Openers",
			[GameStatus.REQUIRES_BOWLER]: "Select Bowler",
			[GameStatus.READY_FOR_BALL]: "Ready to Bowl",
			[GameStatus.REQUIRES_BATSMAN]: "Select Next Batsman",
			[GameStatus.INNINGS_BREAK]: "Innings Break",
			[GameStatus.COMPLETED]: "Completed",
			[GameStatus.ERROR]: "Error State",
			[GameStatus.INITIALIZING]: "Initializing..."
		};
		return map[statusId] || statusId; // Fallback to ID if not found
	};

	// Define GameStatus enum locally
	const GameStatus = {
		REQUIRES_OPENERS: "requires_openers",
		REQUIRES_BOWLER: "requires_bowler",
		READY_FOR_BALL: "ready_for_ball",
		REQUIRES_BATSMAN: "requires_batsman",
		INNINGS_BREAK: "innings_break",
		COMPLETED: "completed",
		ERROR: "error",
		INITIALIZING: "initializing"
	};

	let isLoading = true;
	let errorLoading: string | null = null;
	let eventSource: EventSource | null = null; // Variable to hold the EventSource instance
	let hasShownCompletionModal = false; // Flag to prevent double modal
	let frontendLastBowlerId: string | null | undefined = undefined; // Frontend workaround

	onMount(async () => {
		console.log('Turn-based match page mounted for match ID:', matchId);
		isLoading = true;
		errorLoading = null;
		resetGameState(); // Reset store on mount

		if (matchId) {
			try {
				// Fetch initial state first
				const apiUrl = `${serverURL}/matches/${matchId}`;
				console.log(`Fetching initial state from: ${apiUrl}`);
				const response = await fetch(apiUrl);
				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
				}
				const initialState: GameState = await response.json();
				setGameState(initialState); // Update the store
				console.log('Initial game state loaded:', initialState.status);

				// Now, establish SSE connection for updates
				const sseUrl = `${serverURL}/matches/${matchId}/stream`;
				console.log(`Establishing SSE connection to: ${sseUrl}`);
				eventSource = new EventSource(sseUrl);

				eventSource.onmessage = (event) => {
					try {
						const updatedState: GameState = JSON.parse(event.data);
						console.log('SSE message received:', updatedState.status);
						setGameState(updatedState); // Update the store with the new state
						// Update frontend memory of last bowler when state updates
						if (updatedState.status !== GameStatus.REQUIRES_BOWLER && updatedState.current_bowler_id) {
							frontendLastBowlerId = updatedState.current_bowler_id;
						}
					} catch (error) {
						console.error('Error parsing SSE message:', error, 'Data:', event.data);
					}
				};

				eventSource.onerror = (error) => {
					console.error('SSE connection error:', error);
					// Optionally, update UI to indicate connection issue
					errorLoading = 'Live update connection failed. Please refresh.';
					// Consider closing the source if it errors definitively
					if (eventSource && eventSource.readyState === EventSource.CLOSED) {
						console.log('SSE connection closed by server or error.');
					}
					eventSource?.close(); // Close on error
				};

			} catch (error) {
				console.error("Error during initial fetch or SSE setup:", error);
				errorLoading = error instanceof Error ? error.message : String(error);
			} finally {
				isLoading = false;
			}
		} else {
			errorLoading = "Match ID not found in URL.";
			isLoading = false;
		}
	});

	onDestroy(() => {
		if (eventSource) {
			console.log('Closing SSE connection on component destroy.');
			eventSource.close();
			eventSource = null;
		}
		resetGameState(); // Also reset store when navigating away
	});

	// --- Reactive statement for Bot/Game Automation ---
	$: if (!isLoading && currentGameState) {
		const status = currentGameState.status;
		console.log(`Reactive check. Status: ${status}, isUserSelectionRequired: ${$isUserSelectionRequired}`);

		if (!$isUserSelectionRequired) {
			// Bot Selection Logic (functions have internal submitting checks)
			if (status === GameStatus.REQUIRES_OPENERS) {
				console.log("Attempting autoSelectOpeners");
				setTimeout(() => {
					autoSelectOpeners();
				}, 5000); // 5 second delay
			} else if (status === GameStatus.REQUIRES_BOWLER) {
				 console.log("Attempting autoSelectBowler");
				setTimeout(() => {
					autoSelectBowler();
				}, 5000); // 5 second delay
			} else if (status === GameStatus.REQUIRES_BATSMAN) {
				console.log("Attempting autoSelectNextBatsman");
				setTimeout(() => {
					autoSelectNextBatsman();
				}, 5000); // 5 second delay
			}
		}

		// Auto-bowl Logic (function has internal submitting check)
		if (status === GameStatus.READY_FOR_BALL) {
			 console.log("Attempting handleBowlNextBall (auto-bowl)");
			handleBowlNextBall();
		}
	}

	// --- Reactive statement for Game Completion Popup ---
	$: if (
		currentGameState?.status === GameStatus.COMPLETED &&
		!hasShownCompletionModal // Check the flag
	) {
		console.log("Game completed! Triggering modal.");
		// Determine winner
		let winnerName = "Match Tied or Result Unclear"; // Default/Tie
		let margin = "";
		const state = currentGameState; // Alias for brevity

		if (state.current_innings === 2 && state.target) { // Check if 2nd innings result
			// Check for Tie first
			if (state.score === state.target - 1) {
				winnerName = "Match Tied";
				margin = "";
			}
			// Check if Batting team won
			else if (state.score >= state.target) {
				winnerName = getTeamName(state, state.batting_team_id);
				const wicketsRemaining = 10 - state.wickets; // Assuming 10 wickets max
				margin = `by ${wicketsRemaining} wicket${wicketsRemaining !== 1 ? 's' : ''}`;
			}
			// Otherwise, Bowling team won
			else {
				winnerName = getTeamName(state, state.bowling_team_id);
				const runsMargin = state.target - state.score - 1;
				margin = `by ${runsMargin} run${runsMargin !== 1 ? 's' : ''}`;
			}
		} else if (state.current_innings === 1) {
			// Handle case where match might end in first innings (e.g., error, not usually completion)
			winnerName = "Match Incomplete";
		}

		const modal: ModalSettings = {
			type: 'confirm', // Changed from 'alert' to 'confirm'
			title: 'Match Finished',
			body: `${winnerName} won ${margin}!`, // Displays winner and margin
			buttonTextConfirm: 'New Game', // Should now be respected
			// Define the response callback function
			response: (r: boolean) => {
				if (r) { // User clicked Confirm ('New Game')
					console.log("Redirecting to home page...");
					goto('/');
				} else {
					// Optional: Handle Cancel action if needed
					console.log("Completion modal cancelled.");
				}
				// Reset flag regardless of choice, in case user navigates back somehow
				hasShownCompletionModal = false;
			}
		};
		modalStore.trigger(modal);
		hasShownCompletionModal = true; // Set the flag after triggering
	}

	// --- Click Handler for Player Cards (Opener Selection) ---
	function handleOpenerSelect(event: CustomEvent<{ playerId: string }>) {
		const playerId = event.detail.playerId;
		if (isSubmittingOpeners) return;
		openerError = null;

		// Logic to set striker/non-striker based on clicks
		if (selectedStrikerId === playerId) { selectedStrikerId = ''; return; }
		if (selectedNonStrikerId === playerId) { selectedNonStrikerId = ''; return; }
		if (!selectedStrikerId) { selectedStrikerId = playerId; return; }
		if (!selectedNonStrikerId) { selectedNonStrikerId = playerId; return; }
		// Both set, replace non-striker (could adjust this logic)
		selectedNonStrikerId = playerId;
	}

	// --- API Call Functions ---
	async function handleSelectOpeners() {
		if (!matchId || !selectedStrikerId || !selectedNonStrikerId) {
			openerError = "Please select both an on-strike and off-strike batsman.";
			return;
		}
		if (selectedStrikerId === selectedNonStrikerId) {
			openerError = "On-strike and off-strike batsmen must be different players.";
			return;
		}

		isSubmittingOpeners = true;
		openerError = null;

		try {
			const apiUrl = `${serverURL}/matches/${matchId}/select-openers`;
			const payload = {
				batsman_on_strike_id: selectedStrikerId,
				batsman_off_strike_id: selectedNonStrikerId
			};
			console.log('Sending select openers request:', payload);
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ detail: 'Failed to select openers.' }));
				throw new Error(errorData.detail || `HTTP error ${response.status}`);
			}

			console.log('Openers selected successfully. Waiting for SSE update...');
			// Clear selection, SSE will update the main game state
			selectedStrikerId = '';
			selectedNonStrikerId = '';

		} catch (error) {
			console.error("Error selecting openers:", error);
			openerError = error instanceof Error ? error.message : String(error);
		} finally {
			isSubmittingOpeners = false;
		}
	}
	async function handleSelectBowler(bowlerId: string | null) {
		if (!bowlerId || !currentGameState) return;
		console.log(`TODO: Select Bowler API Call ${bowlerId}`);
		isSubmittingBowler = true;
		bowlerError = null;

		try {
			const apiUrl = `${serverURL}/matches/${currentGameState.match_id}/select-bowler`;
			const payload = { bowler_id: bowlerId };
			console.log('Sending select bowler request:', payload);
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ detail: 'Failed to select bowler.' }));
				throw new Error(errorData.detail || `HTTP error ${response.status}`);
			}
			console.log('Bowler selected successfully. Waiting for SSE update...');
			selectedBowlerId = ''; // Clear selection
			// Update frontend memory of last bowler AFTER successful selection
			frontendLastBowlerId = bowlerId;
		} catch (error) {
			console.error("Error selecting bowler:", error);
			bowlerError = error instanceof Error ? error.message : String(error);
		} finally {
			isSubmittingBowler = false;
		}
	}
	async function handleSelectNextBatsman(batsmanId: string) {
		console.log('TODO: Select Next Batsman API Call', batsmanId);
		if (!matchId) return;

		isSubmittingNextBatsman = true;
		nextBatsmanError = null;
		try {
			const apiUrl = `${serverURL}/matches/${matchId}/select-next-batsman`;
			const payload = { next_batsman_id: batsmanId };
			console.log('Sending select next batsman request:', payload);
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ detail: 'Failed to select next batsman.' }));
				throw new Error(errorData.detail || `HTTP error ${response.status}`);
			}
			console.log('Next batsman selected successfully. Waiting for SSE update...');
			selectedNextBatsmanId = ''; // Clear selection
		} catch (error) {
			console.error("Error selecting next batsman:", error);
			nextBatsmanError = error instanceof Error ? error.message : String(error);
		} finally {
			isSubmittingNextBatsman = false;
		}
	}
	async function handleBowlNextBall() {
		if (!matchId || isBowlingNextBall) return; // Prevent multiple clicks

		isBowlingNextBall = true;
		bowlError = null;
		try {
			const apiUrl = `${serverURL}/matches/${matchId}/bowl-next-ball`;
			console.log('Sending bowl next ball request...');
			const response = await fetch(apiUrl, {
				method: 'POST'
			});

			if (!response.ok) {
				// Try to parse error, provide generic fallback
				let errorDetail = 'Failed to bowl next ball.';
				try {
					const errorData = await response.json();
					errorDetail = errorData.detail || `HTTP error ${response.status}`;
				} catch (e) { /* Ignore parsing error */ }
				throw new Error(errorDetail);
			}

			// Attempt to parse response and update state immediately
			try {
				const data: BowlResultOutput = await response.json();
				if (data && data.updated_game_state) {
					console.log('Updating state from direct bowl response:', data.updated_game_state.status);
					setGameState(data.updated_game_state);
				} else {
					console.warn('Bowl response missing updated_game_state');
				}
			} catch (parseError) {
				console.error('Error parsing bowl response JSON:', parseError);
			}

			console.log('Bowl next ball request successful. State updated from response (if available), waiting for SSE update...');

		} catch (error) {
			console.error("Error bowling next ball:", error);
			bowlError = error instanceof Error ? error.message : String(error);
		} finally {
			isBowlingNextBall = false;
		}
	}
	async function handleStartNextInnings() {
		console.log('TODO: Start Next Innings API Call');
		if (!matchId || isStartingNextInnings) return;

		isStartingNextInnings = true;
		startNextInningsError = null;
		try {
			const apiUrl = `${serverURL}/matches/${matchId}/start-second-innings`;
			console.log('Sending start second innings request...');
			const response = await fetch(apiUrl, {
				method: 'POST'
			});

			if (!response.ok) {
				let errorDetail = 'Failed to start second innings.';
				try {
					const errorData = await response.json();
					errorDetail = errorData.detail || `HTTP error ${response.status}`;
				} catch (e) { /* Ignore parsing error */ }
				throw new Error(errorDetail);
			}

			console.log('Start second innings request successful. Waiting for SSE update...');
			// State transition happens via SSE

		} catch (error) {
			console.error("Error starting second innings:", error);
			startNextInningsError = error instanceof Error ? error.message : String(error);
		} finally {
			isStartingNextInnings = false;
		}
	}

	// --- Bot Auto-Selection Logic ---
	async function autoSelectBowler() {
		if (!currentGameState || !$availableBowlersFullDetails || $availableBowlersFullDetails.length === 0 || isSubmittingBowler) {
			console.warn("Bot cannot select bowler: No bowlers, state invalid, or already submitting.");
			return;
		}
		console.log("Bot is selecting bowler smartly...");

		// Use frontend memory for the previous bowler ID
		// const previousBowlerId = currentGameState.previous_bowler_id;
		const previousBowlerId = frontendLastBowlerId;
		console.log(`Previous bowler ID (from frontend memory): ${previousBowlerId}`);

		// 1. Filter out the previous bowler
		let eligibleBowlers = $availableBowlersFullDetails.filter(p => String(p.player_id) !== previousBowlerId);

		// 2. Handle case where no eligible bowlers remain (should be rare)
		if (eligibleBowlers.length === 0) {
			console.error("Bot Error: No eligible bowlers available after filtering out the previous bowler. Cannot select.");
			// Optional: Fallback to selecting *any* available bowler if rules absolutely must be bent
			// eligibleBowlers = [...$availableBowlersFullDetails];
			// if (eligibleBowlers.length === 0) return; // Still no bowlers?
			return; // Strict adherence: Cannot select if only previous bowler is available
		}

		// 3. Sort remaining bowlers by skill (descending)
		eligibleBowlers.sort((a, b) => {
			const skillA = (a.bowling_main_index || 0) + (a.bowling_variation_index || 0);
			const skillB = (b.bowling_main_index || 0) + (b.bowling_variation_index || 0);
			return skillB - skillA;
		});

		// 4. Determine the high-skill pool (top 50%, min 1, max 4)
		const poolSize = Math.min(Math.max(1, Math.ceil(eligibleBowlers.length * 0.5)), 4);
		const highSkillPool = eligibleBowlers.slice(0, poolSize);
		console.log(`High skill pool size: ${highSkillPool.length}`, highSkillPool.map(p => p.player_id));

		// 5. Randomly select from the high-skill pool
		const randomIndex = Math.floor(Math.random() * highSkillPool.length);
		const botSelectedBowlerId = highSkillPool[randomIndex]?.player_id;

		if (botSelectedBowlerId) {
			console.log(`Bot selected bowler ID ${botSelectedBowlerId} from high skill pool.`);
			await handleSelectBowler(String(botSelectedBowlerId)); // Call the API handler
		} else {
			console.error("Bot failed to determine bowler ID from the high skill pool.");
		}
	}

	async function autoSelectNextBatsman() {
		if (!currentGameState || !$availableBatsmenFullDetails || $availableBatsmenFullDetails.length === 0 || isSubmittingNextBatsman) {
			console.warn("Bot cannot select next batsman: No batsmen, state invalid, or already submitting.");
			return;
		}
		console.log("Bot is selecting next batsman randomly...");

		// Random logic: Select a random available batsman
		const randomIndex = Math.floor(Math.random() * $availableBatsmenFullDetails.length);
		const botSelectedBatsmanId = $availableBatsmenFullDetails[randomIndex]?.player_id;

		if (botSelectedBatsmanId) {
			console.log(`Bot randomly selected next batsman ID: ${botSelectedBatsmanId}`);
			await handleSelectNextBatsman(String(botSelectedBatsmanId));
		} else {
			console.error("Bot failed to determine random next batsman ID.");
		}
	}

	// TODO: Implement autoSelectOpeners (Updated to random)
	async function autoSelectOpeners() {
		if (!$availableBatsmenFullDetails || $availableBatsmenFullDetails.length < 2 || isSubmittingOpeners) {
			console.warn("Bot cannot select openers: Not enough players, or already submitting.");
			return;
		}
		console.log("Bot is selecting openers randomly...");

		// Random logic: Select two distinct random batsmen
		let availableIndices = Array.from($availableBatsmenFullDetails.keys());

		// Select first random index
		let index1 = Math.floor(Math.random() * availableIndices.length);
		const botStrikerId = $availableBatsmenFullDetails[availableIndices[index1]]?.player_id;

		// Remove the selected index so we don't pick the same player twice
		availableIndices.splice(index1, 1);

		// Select second random index from remaining
		let index2 = Math.floor(Math.random() * availableIndices.length);
		const botNonStrikerId = $availableBatsmenFullDetails[availableIndices[index2]]?.player_id;

		if (botStrikerId && botNonStrikerId) {
			console.log(`Bot randomly selected openers: Striker=${botStrikerId}, NonStriker=${botNonStrikerId}`);
			// Temporarily set state for the handler function to use
			selectedStrikerId = String(botStrikerId);
			selectedNonStrikerId = String(botNonStrikerId);
			await handleSelectOpeners(); // Call the existing handler
			// State vars (selectedStrikerId etc.) will be cleared by the handler on success
		} else {
			console.error("Bot failed to determine random opener IDs.");
		}
	}

	// TODO: Implement autoSelectNextBatsman

</script>

	<!-- Page Content -->
<!-- Use max-w-4xl for better readability on wider screens -->
<div class="container mx-auto p-4 pb-48 max-w-4xl">
	{#if isLoading}
		<div class="flex justify-center items-center h-64">
			<p>Loading game state...</p> <!-- TODO: Add spinner -->
		</div>
	{:else if errorLoading}
		<div class="alert variant-filled-error">
			<p>Error loading game: {errorLoading}</p>
		</div>
	{:else if !currentGameState}
		<div class="flex justify-center items-center h-64">
			<p>No game state available.</p>
		</div>
		{:else}
		<h1 class="h1 mb-6 text-center">Match Simulation</h1> <!-- Centered Title -->

			<!-- Display Scoreboard Component -->
		<!-- Add slightly darker bg and subtle shadow -->
		<div class="card p-4 mb-6 bg-surface-700/30 shadow-lg">
			<!-- Removed h2 title -->
			<!-- Team Scores - Split View -->
			<div class="flex justify-between items-start mb-3">
				<!-- Batting Team -->
				<div class="text-left">
					<span class="block text-xl font-bold tracking-tight">{getTeamName(currentGameState, currentGameState.batting_team_id)}</span>
					<span class="block text-2xl font-bold font-mono mt-1">{currentGameState.score}/{currentGameState.wickets}</span>
					<span class="block text-sm text-surface-400">({formatOvers(currentGameState)} ov)</span>
				</div>
				<!-- Bowling Team & Target -->
				<div class="text-right">
					<span class="block text-xl font-bold tracking-tight">{getTeamName(currentGameState, currentGameState.bowling_team_id)}</span>
					{#if currentGameState.current_innings === 2 && currentGameState.target}
						<span class="block text-base mt-1 font-mono">Score: {currentGameState.target - 1}</span>
						<span class="block text-xs text-surface-400">(Target: {currentGameState.target})</span>
					{:else}
						<span class="block text-base mt-1">&nbsp;</span> <!-- Placeholder -->
					{/if}
				</div>
			</div>

			<!-- Divider -->
			<hr class="!border-t !border-surface-600 mb-3" />

			<!-- Batsmen -->
			<div class="flex justify-between items-center mb-2 text-sm">
				<span>
					{#if $currentStriker}
						{$currentStriker.player_name}*
					{:else} Striker: - {/if}
				</span>
				<span class="font-mono text-right">
					{$currentStrikerScorecard?.batting?.runs_scored || 0} ({$currentStrikerScorecard?.batting?.balls_faced || 0})
				</span>
			</div>
			<div class="flex justify-between items-center mb-3 text-sm">
				<span>
					{#if $currentNonStriker}
						{$currentNonStriker.player_name}
					{:else} Non-Striker: - {/if}
				</span>
				<span class="font-mono text-right">
					{$currentNonStrikerScorecard?.batting?.runs_scored || 0} ({$currentNonStrikerScorecard?.batting?.balls_faced || 0})
				</span>
			</div>

			<!-- Bowler -->
			<div class="flex justify-between items-center text-sm">
				<span>
					{#if $currentBowler}
						{$currentBowler.player_name}
					{:else} Bowler: - {/if}
				</span>
				<span class="font-mono text-right">
					{formatBowlerFigures($currentBowlerScorecard)}
				</span>
			</div>

			<!-- Status Line -->
			<p class="mt-4 text-xs text-surface-500 italic text-center">Status: {formatStatus(currentGameState.status)}</p>

		</div>

		<!-- Display Commentary / Ball Log Component -->
		<div class="card p-4 mb-6">
			<h2 class="h4 mb-2">Current Over</h2> <!-- Slightly smaller heading -->
			{#if $latestOverSummary && $latestOverSummary.balls_in_over.length > 0}
				<div class="font-mono text-sm space-y-1.5"> <!-- Increased line spacing -->
					{#each $latestOverSummary.balls_in_over as ball ((ball.over + '.' + ball.ball_in_over + Math.random()))}
						<div class="flex items-center">
							<span class="mr-3 text-surface-400">{ball.over}.{ball.ball_in_over || '?'}</span>
							<span class="flex-1">{getPlayerDetails(currentGameState, ball.bowler_id)?.player_name || 'Bowler'} to {getPlayerDetails(currentGameState, ball.batsman_on_strike_id)?.player_name || 'Batsman'}</span>
							<span class="ml-2 font-semibold text-right">{formatOutcome(ball, currentGameState)}</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-surface-500 italic">{currentGameState.commentary || 'Waiting for first ball...'}</p>
			{/if}
		</div>

		<!-- Display Current Players: Batsmen (Left) and Bowler (Right) -->
		<div class="mb-6 flex flex-wrap md:flex-nowrap justify-center gap-4 items-start">
			<!-- Batsmen Container -->
			<div class="flex flex-col items-center w-full md:w-auto">
				<h4 class="h5 mb-2">Batsmen</h4>
				<PlayerSelectorCarousel
					fixedPlayers={[$currentStriker, $currentNonStriker]}
					fixedLabels={["Striker *", "Non-Striker"]}
					displayMode="batting"
				/>
			</div>
			<!-- Bowler Container -->
			<div class="flex flex-col items-center w-full md:w-auto">
				<h4 class="h5 mb-2">Bowler</h4>
				<PlayerSelectorCarousel
					fixedPlayers={[$currentBowler]}
					fixedLabels={["Current Bowler"]}
					displayMode="bowling"
				/>
			</div>
		</div>

		<!-- Moved Actions Card to be rendered last and fixed at bottom -->

	{/if}

	<!-- Fixed Action Bar at the bottom -->
	{#if currentGameState}
		<div class="fixed bottom-0 left-0 right-0 w-full z-20 bg-surface-800/95 backdrop-blur-sm shadow-2xl border-t border-surface-600">
			<div class="container mx-auto p-3">
			<!-- Conditionally Render Action UI based on gameState.status -->
				{#if currentGameState.status === GameStatus.REQUIRES_OPENERS}
					{#if $isUserSelectionRequired}
						<div class="flex flex-col space-y-2">
							<div class="flex justify-between items-center">
								<h3 class="h3 text-lg">Select Openers</h3>
								<button
									type="button"
									class="btn btn-sm variant-filled-primary"
									on:click={handleSelectOpeners}
									disabled={!selectedStrikerId || !selectedNonStrikerId || isSubmittingOpeners}
								>
									{isSubmittingOpeners ? 'Submitting...' : 'Confirm'}
								</button>
							</div>
							{#if openerError}
								<p class="text-red-500 text-xs -mt-1">{openerError}</p>
							{/if}
							<PlayerSelectorCarousel
								players={$availableBatsmenFullDetails}
								selectedPlayerId1={selectedStrikerId}
								selectedPlayerId2={selectedNonStrikerId}
								label1="Striker"
								label2="Non-Striker"
								disabled={isSubmittingOpeners}
								on:select={handleOpenerSelect}
							/>
						</div>
					{:else}
						<p class="text-center italic">Opponent is selecting openers...</p>
					{/if}
				{:else if currentGameState.status === GameStatus.REQUIRES_BOWLER}
					{#if $isUserSelectionRequired}
						<!-- UI for User to select bowler -->
						<div class="flex flex-col space-y-2">
							<div class="flex justify-between items-center">
								<h3 class="h3 text-lg">Select Bowler</h3>
								<button
									type="button"
									class="btn btn-sm variant-filled-primary"
									on:click={() => handleSelectBowler(selectedBowlerId)}
									disabled={!selectedBowlerId || isSubmittingBowler}
								>
									{isSubmittingBowler ? 'Confirming...' : 'Confirm Bowler'}
								</button>
							</div>
							{#if bowlerError}
								<p class="text-red-500 text-xs -mt-1">{bowlerError}</p>
							{/if}
							<PlayerSelectorCarousel
								players={$availableBowlersFullDetails}
								selectedPlayerId1={selectedBowlerId}
								label1="Bowler"
								displayMode="bowling"
								disabled={isSubmittingBowler}
								on:select={(e) => selectedBowlerId = e.detail.playerId}
							/>
						</div>
					{:else}
						<p class="text-center italic">Opponent is selecting bowler...</p>
					{/if}
				{:else if currentGameState.status === GameStatus.REQUIRES_BATSMAN}
					{#if $isUserSelectionRequired}
						<!-- UI for User to select next batsman -->
						<div class="flex flex-col space-y-2">
							<div class="flex justify-between items-center">
								<h3 class="h3 text-lg">Select Next Batsman</h3>
								<button
									type="button"
									class="btn btn-sm variant-filled-primary"
									on:click={() => handleSelectNextBatsman(selectedNextBatsmanId)}
									disabled={!selectedNextBatsmanId || isSubmittingNextBatsman}
								>
									{isSubmittingNextBatsman ? 'Confirming...' : 'Confirm Batsman'}
								</button>
							</div>
							{#if nextBatsmanError}
								<p class="text-red-500 text-xs -mt-1">{nextBatsmanError}</p>
							{/if}
							<PlayerSelectorCarousel
								players={$availableBatsmenFullDetails}
								selectedPlayerId1={selectedNextBatsmanId}
								label1="Next Batsman"
								disabled={isSubmittingNextBatsman}
								on:select={(e) => selectedNextBatsmanId = e.detail.playerId}
							/>
						</div>
					{:else}
						<p class="text-center italic">Opponent is selecting next batsman...</p>
					{/if}
					<!-- Example: handleSelectNextBatsman(selectedBatsman) -->
				{:else if currentGameState.status === GameStatus.READY_FOR_BALL}
					{#if bowlError}
						<p class="text-red-500 text-xs text-center">Error bowling: {bowlError}</p>
					{:else}
						<p class="text-center italic">Simulating next ball...</p>
					{/if}
				{:else if currentGameState.status === GameStatus.INNINGS_BREAK}
					<div class="flex justify-center">
						<button
							type="button"
							class="btn variant-filled-secondary"
							on:click={handleStartNextInnings}
							disabled={isStartingNextInnings}
						>
							{isStartingNextInnings ? 'Starting...' : 'Start Next Innings'}
					</button>
					</div>
					{#if startNextInningsError} <p class="text-red-500 text-xs text-center mt-1">{startNextInningsError}</p> {/if}
				{:else if currentGameState.status === GameStatus.COMPLETED}
					<p class="text-center font-bold">Match Completed!</p>
				{:else}
					<p class="text-center">Waiting... (Status: {currentGameState.status})</p>
				{/if}
			</div>
			</div>
		{/if}
	</div>

<!-- IMPORTANT: Need to include the Modal component instance somewhere in the layout -->
<!-- Typically placed in the root layout (+layout.svelte) -->
<!-- Add this line if not already present in a parent layout -->
<!-- <Modal /> -->
