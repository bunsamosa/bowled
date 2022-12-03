<script lang="ts">
	import { authClient } from '$lib/utils/authClient';
	import { appSession, updateUserData } from '$lib/stores/sessionStore';
	import { goto } from '$app/navigation';
	import { serverURL } from '$lib/utils/bowledClient';
	import { getNotificationsContext } from 'svelte-notifications';

	// notification handler
	const { addNotification } = getNotificationsContext();

	// update app session on auth state change
	authClient.auth.onAuthStateChange((event, session) => {
		appSession.set(session);

		// if user is logged in - redirect based on user status
		if ($appSession) {
			checkUserStatus();
		}
	});

	// set app session from auth
	appSession.set(authClient.auth.session());

	// check user status
	async function checkUserStatus() {
		let access_token = $appSession?.access_token;
		let url = serverURL + '/user';
		const response = await fetch(url, {
			headers: {
				Authorization: 'Bearer ' + access_token
			}
		});

		// if user has completed sign-up send the user to game home
		// else onboard the user
		let data = await response.json();
		if (data['signup_complete']) {
			await updateUserData(data);
			goto('/game/home');
		} else {
			goto('/onboard/welcome');
		}
	}

	// sign in with oauth provider
	async function signIn() {
		try {
			const { error } = await authClient.auth.signIn(
				{ provider: 'google' },
				{ redirectTo: window.location.origin }
			);
			if (error) throw error;
			else {
				addNotification({
					text: 'Sign-in successful!',
					position: 'bottom-center',
					type: 'success',
					removeAfter: 2000
				});
			}
		} catch (error: any) {
			console.log(error.message);
			addNotification({
				text: 'Unable to sign-in, please try again!',
				position: 'bottom-center',
				type: 'error',
				removeAfter: 2000
			});
		}
	}
</script>

<div class="bg-[#1d3a85]">
	<div class="flex flex-col h-screen max-w-screen-xl m-auto">
		<div class="navbar flex-none text-white">
			<div class="flex-1">
				<a class="btn btn-ghost normal-case text-2xl" href="/">Bowled</a>
			</div>
			<div class="flex-none">
				<ul class="menu menu-horizontal p-0">
					<li>
						<a href="https://wiki.bunsamosa.org/" class="btn btn-ghost normal-case">Wiki</a>
					</li>
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
