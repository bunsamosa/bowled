import { writable } from 'svelte/store';

// Define the type for our GameState based on the backend model
// TODO: Ideally, generate this type from the OpenAPI spec or share types

// Define LiveTeamPlayer based on openapi.json components.schemas.LiveTeamPlayer
export interface LiveTeamPlayer {
    player_id: number; // Keep as number based on schema
    team_id: string;
    player_name: string;
    player_type: string;
    dob: number;
    avatar_url: string;
    fitness: string;
    form: string;
    batting_type: string;
    bowling_type: string;
    fielding_index: number;
    fielding: string;
    fielding_color: string;
    wicket_keeping_index: number;
    wicket_keeping: string;
    wicket_keeping_color: string;
    batting_seam_index: number;
    batting_seam: string;
    batting_seam_color: string;
    batting_spin_index: number;
    batting_spin: string;
    batting_spin_color: string;
    bowling_main_index: number;
    bowling_main: string;
    bowling_main_color: string;
    bowling_variation_index: number;
    bowling_variation: string;
    bowling_variation_color: string;
    batting_rating: number;
    bowling_rating: number;
}

export interface PlayerScorecard { // Simplified for example
    player_id: string;
    batting: { runs_scored: number; balls_faced: number; dismissed: boolean; fours: number; sixes: number };
    bowling: { overs_bowled: number; balls_bowled: number; runs_conceded: number; wickets_taken: number; maidens: number; wides: number; noballs: number };
}

export interface BallData { // Simplified
    outcome: string;
    runs_scored: number;
    is_wicket: boolean;
    commentary?: string;
    innings: number;
    over: number;
    ball_in_over: number;
    total_balls_bowled_innings: number;
    batsman_on_strike_id: string;
    bowler_id: string;
    wicket_type?: string | null;
    extras_type?: "wide" | "noball" | "legbye" | "bye" | null;
    extras_runs: number;
    score_at_ball: number;
    wickets_at_ball: number;
    // ... other fields
}

export interface OverSummary { // Simplified
    over_number: number;
    bowler_id: string;
    runs_conceded: number;
    wickets_taken: number;
    balls_in_over: BallData[];
}

export interface GameState {
    match_id: string;
    status: string; // GameStatus enum as string
    team1_id: string;
    team2_id: string;
    team1_name?: string; // Add team name fields
    team2_name?: string;
    team1_squad: LiveTeamPlayer[]; // Add squad with correct type
    team2_squad: LiveTeamPlayer[]; // Add squad with correct type
    total_overs?: number; // Make optional if not always present initially
    current_innings: number;
    batting_team_id: string | null;
    bowling_team_id: string | null;
    current_over: number;
    current_ball_in_over: number;
    total_balls_bowled: number;
    score: number;
    wickets: number;
    target: number | null;
    batsman_on_strike_id: string | null;
    batsman_off_strike_id: string | null;
    current_bowler_id: string | null;
    previous_bowler_id?: string | null;
    available_batsman_ids: string[];
    available_bowler_ids: string[];
    dismissed_batsman_ids: string[];
    // bowlers_used_this_innings: string[];
    player_scorecards: { [key: string]: PlayerScorecard };
    over_summaries: OverSummary[];
    last_ball_outcome: any | null; // Could be more specific
    commentary: string | null;
    error_message: string | null;
    isUserSelectionRequired?: boolean;
}

export interface BowlResultOutput {
    ball_outcome: string;
    updated_game_state: GameState;
}

// Create the writable store, initialized to null
export const turnBasedGameState = writable<GameState | null>(null);

// Optional: Helper function to update the store
export function setGameState(newState: GameState) {
    turnBasedGameState.set(newState);
}

// Optional: Helper function to reset the store
export function resetGameState() {
    turnBasedGameState.set(null);
}
