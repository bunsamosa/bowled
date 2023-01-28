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

<div class="max-w-screen-xl m-auto">
	<div class="sticky top-0 navbar flex-none">
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
	<div class="flex flex-col h-screen">
		<div class="hero flex-1">
			<div class="hero-content flex-col lg:flex-row">
				<img
					src="/images/bald_guy_meme.png"
					class="max-w-lg rounded-lg"
					alt="Pakistani bald guy meme"
				/>
				<div>
					<h1 class="text-5xl font-bold">Ever felt this while watching cricket?</h1>
					<p class="py-6">
						Now you can own a T20 Cricket franchise.
						<br />
						Choose your team, Train your players and Compete with your friends to become the Best Manager
						in the world!
					</p>
					<button class="btn btn-primary" on:click={signIn}>Get Started</button>
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
	<div class="flex flex-col h-screen">
		<div class="hero flex-1">
			<div class="hero-content flex-col lg:flex-row">
				<div class="carousel carousel-center rounded-box">
					<ul class="steps">
						<li class="step">
							<div class="carousel-item">
								<div class="card w-96 bg-base-100 shadow-xl">
									<figure class="px-10 pt-10">
										<img src="/images/csk_logo.png" alt="Shoes" class="rounded-xl" />
									</figure>
									<div class="card-body items-center text-center">
										<h2 class="card-title">Shoes!</h2>
										<p>If a dog chews shoes whose shoes does he choose?</p>
									</div>
								</div>
							</div>
						</li>
						<li class="step">
							<div class="carousel-item">
								<div class="card w-96 bg-base-100 shadow-xl">
									<figure class="px-10 pt-10">
										<img src="/images/csk_logo.png" alt="Shoes" class="rounded-xl" />
									</figure>
									<div class="card-body items-center text-center">
										<h2 class="card-title">Shoes!</h2>
										<p>If a dog chews shoes whose shoes does he choose?</p>
									</div>
								</div>
							</div>
						</li>
						<li class="step">
							<div class="carousel-item">
								<div class="card w-96 bg-base-100 shadow-xl">
									<figure class="px-10 pt-10">
										<img src="/images/csk_logo.png" alt="Shoes" class="rounded-xl" />
									</figure>
									<div class="card-body items-center text-center">
										<h2 class="card-title">Shoes!</h2>
										<p>If a dog chews shoes whose shoes does he choose?</p>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-col h-screen">
		<div class="hero flex-1">
			<div class="hero-content flex-col lg:flex-row">
				<img src="/images/rcb_csk.png" class="max-w-2xl rounded-lg" alt="RCB vs CSK logo" />
				<div>
					<h1 class="text-5xl font-bold">Choose Your Team</h1>
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
	</div>
</div>
