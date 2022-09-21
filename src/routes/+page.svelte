<script lang="ts">
	import { authClient } from '$lib/authClient';
	import { appSession } from '$lib/sessionStore';

	// set app session from auth
	appSession.set(authClient.auth.session());

	// update app session on auth state change
	authClient.auth.onAuthStateChange((event, session) => {
		appSession.set(session);
	});

	// signn in with oauth provider
	async function signIn() {
		try {
			const { error } = await authClient.auth.signIn({ provider: 'google' });
			if (error) throw error;
		} catch (error: any) {
			alert(error.error_description || error.message);
		}
	}

	// signout
	async function signout() {
		const { error } = await authClient.auth.signOut();
	}
</script>

<div class="bg-black">
	<div class="flex flex-col min-h-screen max-w-screen-xl m-auto">
		<div class="navbar flex-none">
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
					<!-- <p class="text-white text-xl">Coming Soon</p> -->
					{#if $appSession}
						<button class="btn btn-primary" on:click={signout}> Get Started </button>
					{:else}
						<button class="btn btn-primary" on:click={signIn}> Get Started </button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
