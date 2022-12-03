<script lang="ts">
	import { authClient } from '$lib/utils/authClient';
	import { appSession } from '$lib/stores/sessionStore';
	import { goto } from '$app/navigation';

	// update app session on auth state change
	authClient.auth.onAuthStateChange((event, session) => {
		appSession.set(session);
		// if user is not logged in - send him to home page
		if (!$appSession) {
			console.log('User not logged in');
			goHome();
		}
	});

	// set app session from auth
	appSession.set(authClient.auth.session());

	// signout and go home
	async function signout() {
		const { error } = await authClient.auth.signOut();
		goHome();
	}

	// navigate to home page
	function goHome() {
		goto('/');
	}
</script>

<!-- Layout for onboarding pages -->
<div class="h-screen max-w-screen-xl m-auto flex flex-col">
	<div class="navbar flex-none">
		<div class="flex-1">
			<a class="btn btn-ghost normal-case text-2xl" href="/">Bowled</a>
		</div>
		<div class="flex-none">
			<button class="btn btn-ghost normal-case" on:click={signout}>Exit</button>
		</div>
	</div>
	<slot />
</div>
