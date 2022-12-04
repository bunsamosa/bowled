<script lang="ts">
	import { page } from '$app/stores';
	import { authClient } from '$lib/utils/authClient';
	import { managerName, teamName } from '$lib/stores/sessionStore';
	import { goto } from '$app/navigation';

	// active tabs
	$: homeTabActive = $page.url.pathname == '/game/home';
	$: financeTabActive = $page.url.pathname == '/game/finance';
	$: matchTabActive = $page.url.pathname == '/game/match';

	// signout and go home
	async function signout() {
		const { error } = await authClient.auth.signOut();
		goto('/');
	}
</script>

<!-- Layout for onboarding pages -->
<div class="h-screen max-w-screen-xl m-auto flex flex-col">
	<div class="navbar flex-none ">
		<div class="navbar-start">
			<a class="btn btn-ghost normal-case text-2xl" href="/">Bowled</a>
		</div>
		<div class="navbar-center btn-group">
			<a class="btn btn-ghost normal-case tab" class:btn-active={homeTabActive} href="/game/home">
				Home
			</a>
			<!-- <a
				class="btn btn-ghost normal-case tab"
				class:btn-active={financeTabActive}
				href="/game/finance">Finance</a
			> -->
			<a class="btn btn-ghost normal-case tab" class:btn-active={matchTabActive} href="/game/match"
				>Match</a
			>
		</div>
		<div class="navbar-end">
			<button class="btn btn-ghost normal-case" on:click={signout}>Exit</button>
		</div>
	</div>
	<slot />
</div>
