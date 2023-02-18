<script lang="ts">
	// import { authClient } from '$lib/utils/authClient';
	// import { appSession, updateUserData } from '$lib/stores/sessionStore';
	// import { goto } from '$app/navigation';
	import { serverURL } from '$lib/utils/bowledClient';
	// import { getNotificationsContext } from 'svelte-notifications';
	import { goto } from '$app/navigation';
	import HomeNavbar from '$lib/components/core/HomeNavbar.svelte';

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

<!-- Background image -->
<div
	style="background-image: url(/images/stadium_bg.png); "
	class="bg-fixed	bg-center bg-no-repeat bg-cover "
>
	<!-- Gradient effect -->
	<div class="bg-gradient-to-b from-black">
		<div class="max-w-screen-xl m-auto">
			<HomeNavbar />

			<!-- Copy and hero image -->
			<div class="hero min-h-screen">
				<div class="hero-content flex-col">
					<div class="max-w-full text-center mb-8">
						<h1 class="p-5 text-6xl font-bold copy-gradient">Beat your friends in Cricket</h1>
						<h1 class="mb-8 text-2xl font-semibold">
							Train players, set strategies and lead your team to glory!
						</h1>
						<input
							type="image"
							src="/images/start_button.gif"
							class="max-w-xs m-auto"
							alt="Start Button"
							on:click={signIn}
						/>
					</div>
					{#await loadMetrics() then}
						<div class="flex justify-around">
							<div class="stats shadow-2xl bg-transparent backdrop-blur-sm">
								<div class="stat place-items-center">
									<div class="stat-title text-primary">Total games played</div>
									<div class="stat-value">{metricsData.games_played}</div>
									<div class="stat-desc text-primary">Since Jan 27</div>
								</div>

								<div class="stat place-items-center">
									<div class="stat-title text-primary">Users playing now</div>
									<div class="stat-value ">{metricsData.games_live}</div>
									<div class="stat-desc text-primary">Live</div>
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
	</div>
</div>

<style>
	.copy-gradient {
		@apply bg-gradient-to-b from-yellow-50 via-yellow-300 to-red-400 text-transparent bg-clip-text;
	}
</style>
