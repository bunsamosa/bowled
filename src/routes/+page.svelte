<script lang="ts">
	import { authClient } from '$lib/utils/authClient';
	import { appSession } from '$lib/stores/sessionStore';
	import { goto } from '$app/navigation';

	// set app session from auth
	appSession.set(authClient.auth.session());

	// update app session on auth state change
	authClient.auth.onAuthStateChange((event, session) => {
		appSession.set(session);
	});

	// sign in with oauth provider
	async function signIn() {
		try {
			const { error } = await authClient.auth.signIn(
				{ provider: 'google' },
				{ redirectTo: window.location.origin + '/onboard/welcome' }
			);
			if (error) throw error;
		} catch (error: any) {
			alert(error.error_description || error.message);
		}
	}

	// if user is logged in - redirect to welcome page
	// if ($appSession) {
	// 	console.log('User logged in: ', $appSession.access_token);
	// 	welcome();
	// } else {
	// 	console.log('User not logged in');
	// }

	// move to welcome page
	// function welcome() {
	// 	goto('/onboard/welcome');
	// }
</script>

<div class="bg-[#1d3a85]">
	<div class="flex flex-col h-screen max-w-screen-xl m-auto">
		<div class="navbar flex-none text-white">
			<div class="flex-1">
				<a class="btn btn-ghost normal-case text-2xl" href="/">Bowled</a>
			</div>
			<div class="flex-none">
				<ul class="menu menu-horizontal p-0">
					<li><a href="https://wiki.bunsamosa.org/" class="btn btn-ghost normal-case">Wiki</a></li>
				</ul>
			</div>
		</div>
		<div class="hero flex-1">
			<div class="hero-content text-center">
				<div class="max-w-2xl">
					<img
						src="images/hero.png"
						class="my-5"
						alt="You are the owner of a T20 Cricket franchise"
					/>
					<button class="btn btn-outline text-white" on:click={signIn}> Get Started </button>
					<!-- <p class="text-white text-xl">Coming Soon</p> -->
					<!-- {#if !$appSession}
						<button class="btn btn-outline text-white" on:click={signIn}> Get Started </button>
					{/if} -->
				</div>
			</div>
		</div>
	</div>
</div>
