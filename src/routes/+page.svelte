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

<div>
	<div class="flex flex-col h-screen max-w-screen-xl m-auto">
		<div class="navbar flex-none">
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
		<div class="hero min-h-screen">
			<div class="hero-content flex-col lg:flex-row">
				<img
					src="/images/bowled.png"
					class="max-w-sm rounded-lg shadow-2xl"
				/>
				<div>
					<h1 class="text-5xl font-bold">Box Office News!</h1>
					<p class="py-6">
						Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
						quasi. In deleniti eaque aut repudiandae et a id nisi.
					</p>
					<button class="btn btn-primary">Get Started</button>
				</div>
			</div>
		</div>

		<!-- <div class="hero flex-1">
			<div class="hero-content text-center">
				<div class="flex mb-4">
					<div class="w-1/2 h-12 hero-img">
						<img
						src="/images/bowled.png"
						class="my-5"
						alt="You are the owner of a T20 Cricket franchise"
					/>
					</div>
					<div class="w-1/2 h-12">
						<h1 class="hero-h1">Build your Dream T20 team Now!</h1>
						<p class="hero-p">Choose - Train - Play</p>
						<button class="hero-btn btn-outline text-white" on:click={signIn}> Get Started </button>
					</div>
				</div>
			</div>
		</div> -->
	</div>
</div>
<div class="team-sec">
	<div>
		<img 
		src="/images/team.png"
		class="my-5 team-img"
		alt="Build your team"
		/>
	</div>
	<div class="team-text">
		<h1 class="team-h1">Choose Your Team</h1>
		<p class="team-p">Train the team and play against your friends or a bot and see live commentary!</p>
	</div>
</div>