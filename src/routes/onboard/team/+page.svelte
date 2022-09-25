<script lang="ts">
	import * as LottiePlayer from '@lottiefiles/lottie-player';
	import { useForm, required, minLength, Hint } from 'svelte-use-form';
	import { goto } from '$app/navigation';

	// form validator
	const form = useForm({
		teamName: { validators: [required, minLength(3)] }
	});

	// move to team creation page
	function loadHome() {
		goto('/game/home');
	}
</script>

<div class="hero bg-base-200 flex-1">
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
			<p class="py-5 text-white">
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
						class="input input-bordered w-full max-w-xs text-white"
						id="teamName"
						name="teamName"
					/>
					<Hint class="label-text text-red-500" for="teamName" on="minLength" let:value>
						Team name should be atleast {value} characters long
					</Hint>
				</form>
			</div>
			<div class="py-5">
				<button class="btn btn-outline" disabled={!$form.valid} on:click={loadHome}>Continue</button
				>
			</div>
		</div>
	</div>
</div>
