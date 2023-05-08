<script lang="ts">
	import * as LottiePlayer from '@lottiefiles/lottie-player';
	import { useForm, required, minLength, Hint } from 'svelte-use-form';
	import { goto } from '$app/navigation';
	import { managerName, teamName, appSession, updateUserData } from '$lib/stores/sessionStore';
	import { serverURL } from '$lib/utils/bowledClient';
	import { getNotificationsContext } from 'svelte-notifications';

	// notification handler
	const { addNotification } = getNotificationsContext();

	// form validator
	const form = useForm({
		teamName: { validators: [required, minLength(3)] }
	});

	// call API to create team
	async function createTeam() {
		teamName.set($form.teamName.value);

		let access_token = $appSession?.access_token;
		let url = serverURL + '/user';
		let payload = {
			manager_name: $managerName,
			team_name: $teamName
		};

		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				Authorization: 'Bearer ' + access_token,
				'Content-Type': 'application/json'
			}
		});

		if (response.status == 200) {
			// save user data
			let data = await response.json();
			updateUserData(data);

			addNotification({
				text: 'Success! Let me give you a tour of our facilities',
				position: 'bottom-center',
				type: 'success',
				removeAfter: 2000
			});
			goto('/game/home');
		} else {
			addNotification({
				text: 'Oops! Something went wrong, please try again.',
				position: 'bottom-center',
				type: 'error',
				removeAfter: 2000
			});
		}
	}
</script>

<div class="hero flex-1">
	<div class="hero-content flex-col lg:flex-row">
		<lottie-player
			autoplay
			loop
			mode="normal"
			src="https://assets9.lottiefiles.com/packages/lf20_n0m2eaa8.json"
			class="max-w-md rounded-lg shadow-2xl"
		/>
		<div>
			<h1 class="text-3xl font-bold py-3">Let's give our team a catchy name</h1>
			<p class="py-5">
				Hello XYZ,
				<br />
				Our players are excited to meet you ...
			</p>
			<div class="form-control w-full max-w-xs py-3">
				<form use:form>
					<label class="label" for="teamName">
						<span class="label-text">What should we call our franchise?</span>
					</label>
					<!-- svelte-ignore a11y-autofocus -->
					<input
						type="text"
						placeholder="Type team name here"
						class="input input-bordered w-full max-w-xs"
						id="teamName"
						name="teamName"
					/>
					<Hint class="label-text text-red-500 py-1" for="teamName" on="minLength" let:value>
						Team name should be atleast {value} characters long
					</Hint>
				</form>
			</div>
			<div class="py-3">
				<button class="btn btn-primary btn-outline" disabled={!$form.valid} on:click={createTeam}
					>Continue</button
				>
			</div>
		</div>
	</div>
</div>
