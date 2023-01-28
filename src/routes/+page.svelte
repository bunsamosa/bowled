<script lang="ts">
	import { authClient } from '$lib/utils/authClient';
	import { appSession, updateUserData } from '$lib/stores/sessionStore';
	import { goto } from '$app/navigation';
	import { serverURL } from '$lib/utils/bowledClient';
	import { getNotificationsContext } from 'svelte-notifications';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faTwitter } from '@fortawesome/free-brands-svg-icons';

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

<!-- Nav bar -->
<div class="sticky z-50 top-0 navbar max-w-screen-xl m-auto flex-none">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-2xl" href="/">Bowled</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal p-0">
			<li>
				<!-- Twitter icon -->
				<a href="https://twitter.com/bowledGG" target="_blank"><Fa icon={faTwitter} /></a>
			</li>
			<li>
				<a href="https://wiki.bunsamosa.org/" class="btn btn-ghost normal-case">Wiki</a>
			</li>
		</ul>
	</div>
</div>

<!-- Landing page -->
<div class="max-w-screen-xl m-auto">
	<!-- Copy and meme -->
	<div class="flex flex-col h-screen">
		<div class="hero flex-1">
			<div class="hero-content flex-col lg:flex-row">
				<img
					src="/images/cricket_meme.gif"
					class="max-w-lg rounded-lg shadow-lg"
					alt="Disappointed bald guy cricket meme"
				/>
				<div>
					<h1 class="text-5xl font-bold">Ever felt this watching cricket? Say no more!</h1>
					<p class="py-6 text-2xl font-semibold">
						Your team, Your strategies vs the world.
						<br />Build your dream T20 team now.
					</p>
					<button class="btn btn-primary" on:click={signIn}>Play Now</button>
					<a class="btn btn-outline btn-primary" href="#stages">Learn More</a>
				</div>
			</div>
		</div>
	</div>

	<!-- How to play -->
	<div class="flex flex-col h-screen" id="stages">
		<div class="hero flex-1">
			<div class="hero-content flex-col">
				<h1 class="text-5xl font-bold">How to play?</h1>
				<div class="carousel carousel-center rounded-box">
					<div class="steps">
						<div class="carousel-item step">
							<div class="card w-96 bg-base-100 shadow-xl">
								<figure class="px-10 pt-7">
									<img src="/images/choose_team.png" alt="choose-team" class="rounded-xl" />
								</figure>
								<div class="card-body items-center text-center">
									<h2 class="card-title">Choose your favorite team</h2>
								</div>
							</div>
						</div>
						<div class="carousel-item step">
							<div class="card w-96 bg-base-100 shadow-xl">
								<figure class="px-2 pt-12">
									<img src="/images/strategies.png" alt="set-lineup" class="rounded-xl" />
								</figure>
								<div class="card-body items-center text-center">
									<h2 class="card-title">Set your strategies</h2>
								</div>
							</div>
						</div>
						<div class="carousel-item step">
							<div class="card w-96 bg-base-100 shadow-xl">
								<figure class="px-5 pt-10">
									<img src="/images/watch_match.jpg" alt="play" class="rounded-xl" />
								</figure>
								<div class="card-body items-center text-center">
									<h2 class="card-title">Follow the live match!</h2>
								</div>
							</div>
						</div>
					</div>
				</div>
				<button class="btn btn-primary" on:click={signIn}>Play Now</button>
			</div>
		</div>
	</div>

	<!-- Team vs Team -->
	<!-- <div class="flex flex-col h-screen">
		<div class="hero flex-1">
			<div class="hero-content flex-col lg:flex-row">
				<img src="/images/rcb_csk.png" class="max-w-2xl rounded-lg" alt="RCB vs CSK logo" />
				<div>
					<h1 class="text-4xl font-bold">Play with your favorite teams</h1>
					<p class="py-6">
						Train the team and play against your friends or a bot and see live commentary!
						<br />
						Choose your team, Train your players and Compete with your friends to become the Best Manager
						in the world!
					</p>
					<button class="btn btn-primary" on:click={signIn}>Get Started</button>
				</div>
			</div>
		</div>
	</div> -->
</div>
