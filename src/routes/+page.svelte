<script lang="ts">
	// import { authClient } from '$lib/utils/authClient';
	// import { appSession, updateUserData } from '$lib/stores/sessionStore';
	// import { goto } from '$app/navigation';
	import { serverURL } from '$lib/utils/bowledClient';
	// import { getNotificationsContext } from 'svelte-notifications';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faTwitter } from '@fortawesome/free-brands-svg-icons';
	import { goto } from '$app/navigation';

	let metricsData = {
		games_played: 0,
		games_live: 0
	};

	async function loadMetrics() {
		// load metrics data
		let url = serverURL + '/live/metrics';
		console.log(url);
		const response = await fetch(url);
		if (response.status == 200) {
			metricsData = await response.json();
		}
	}

	// // notification handler
	// const { addNotification } = getNotificationsContext();

	// // update app session on auth state change
	// authClient.auth.onAuthStateChange((event, session) => {
	// 	appSession.set(session);

	// 	// if user is logged in - redirect based on user status
	// 	if ($appSession) {
	// 		checkUserStatus();
	// 	}
	// });

	// // set app session from auth
	// appSession.set(authClient.auth.session());

	// // check user status
	// async function checkUserStatus() {
	// 	let access_token = $appSession?.access_token;
	// 	let url = serverURL + '/user';
	// 	const response = await fetch(url, {
	// 		headers: {
	// 			Authorization: 'Bearer ' + access_token
	// 		}
	// 	});

	// 	// if user has completed sign-up send the user to game home
	// 	// else onboard the user
	// 	let data = await response.json();
	// 	if (data['signup_complete']) {
	// 		await updateUserData(data);
	// 		goto('/game/home');
	// 	} else {
	// 		goto('/onboard/welcome');
	// 	}
	// }

	// // sign in with oauth provider
	// async function signIn() {
	// 	try {
	// 		const { error } = await authClient.auth.signIn(
	// 			{ provider: 'google' },
	// 			{ redirectTo: window.location.origin }
	// 		);
	// 		if (error) throw error;
	// 		else {
	// 			addNotification({
	// 				text: 'Sign-in successful!',
	// 				position: 'bottom-center',
	// 				type: 'success',
	// 				removeAfter: 2000
	// 			});
	// 		}
	// 	} catch (error: any) {
	// 		console.log(error.message);
	// 		addNotification({
	// 			text: 'Unable to sign-in, please try again!',
	// 			position: 'bottom-center',
	// 			type: 'error',
	// 			removeAfter: 2000
	// 		});
	// 	}
	// }
	async function signIn() {
		goto('/live/teams');
	}
</script>

<div class="max-w-screen-xl m-auto">
	<!-- Nav bar -->
	<div class="fixed z-50 top-0 navbar max-w-screen-xl">
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
					<a href="https://wiki.bunsamosa.org/" target="_blank" class="btn btn-ghost normal-case"
						>Wiki</a
					>
				</li>
			</ul>
		</div>
	</div>

	<!-- Copy and hero image -->
	<div class="hero min-h-screen">
		<div class="flex-col">
			<div class="hero-content flex-row">
				<div class="max-w-md rounded-lg hidden lg:block">
					<img src="images/bat_and_ball.gif" alt="Bat and ball" />
				</div>
				<div class="max-w-2xl">
					<h1 class="mb-2 text-5xl font-bold">Beat your friends in Cricket</h1>
					<h1 class="mb-10 text-2xl font bold">
						Train players, set strategies and lead your team to glory!
					</h1>
					<button class="btn btn-primary" on:click={signIn}>Play now</button>
				</div>
			</div>
			{#await loadMetrics() then}
				<div class="flex justify-around">
					<div class="stats shadow-2xl">
						<div class="stat place-items-center">
							<div class="stat-title">Total games played</div>
							<div class="stat-value text-secondary">{metricsData.games_played}</div>
							<div class="stat-desc">Since Jan 27</div>
						</div>

						<div class="stat place-items-center">
							<div class="stat-title">Users playing now</div>
							<div class="stat-value text-secondary">{metricsData.games_live}</div>
							<div class="stat-desc">Live</div>
						</div>
					</div>
				</div>
			{/await}
		</div>
	</div>

	<!-- How to play -->
	<!-- <div class="flex flex-col min-h-screen" id="stages">
		<div class="hero flex-1">
			<div class="hero-content flex-col">
				<h1 class="text-5xl font-bold">How to play?</h1>
				<div class="carousel carousel-center rounded-box">
					<div class="steps">
						<div class="carousel-item step">
							<div class="card w-96 bg-base-100 ">
								<figure class="px-10 pt-7">
									<img src="/images/choose_team.png" alt="choose-team" class="rounded-xl" />
								</figure>
								<div class="card-body items-center text-center">
									<h2 class="card-title">Choose your favorite team</h2>
								</div>
							</div>
						</div>
						<div class="carousel-item step">
							<div class="card w-96 bg-base-100 ">
								<figure class="px-2 pt-12">
									<img src="/images/strategies.png" alt="set-lineup" class="rounded-xl" />
								</figure>
								<div class="card-body items-center text-center">
									<h2 class="card-title">Set your strategies</h2>
								</div>
							</div>
						</div>
						<div class="carousel-item step">
							<div class="card w-96 bg-base-100">
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
	</div> -->
</div>
