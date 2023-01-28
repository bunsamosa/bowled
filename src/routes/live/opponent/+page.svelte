<script lang="ts">
	import { goto } from '$app/navigation';
	import { serverURL } from '$lib/utils/bowledClient';
	import { page } from '$app/stores';

	let myTeam: String;
	myTeam = $page.url.searchParams.get('self');

	async function startMatch() {
		goto('/live/match?self=' + myTeam);
	}
</script>

<div class="hero flex-1">
	<div class="hero-content flex-col">
		<img src="/images/watch_match.jpg" class="max-w-lg rounded-lg" alt="RCB vs CSK logo" />

		<div class="hero flex-1">
			<div class="hero-content flex-col">
				<div>
					<h1 class="text-4xl font-bold">Choose your opponent</h1>
				</div>
				<div>
					<div class="flex w-full">
						<div class="grid h-20 flex-grow card place-items-center">
							<button class="btn btn-primary normal-case" disabled>Invite a friend</button>
						</div>
						<div class="divider divider-horizontal">OR</div>
						<div class="grid h-20 flex-grow card  place-items-center">
							<button class="btn btn-primary normal-case" on:click={startMatch}
								>Play with Bots</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
