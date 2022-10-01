<script lang="ts">
	import * as LottiePlayer from '@lottiefiles/lottie-player';
	import { useForm, required, minLength, Hint } from 'svelte-use-form';
	import { goto } from '$app/navigation';

	// form validator
	const form = useForm({
		managerName: { validators: [required, minLength(3)] }
	});

	// move to team creation page
	function createTeam() {
		goto('/onboard/team');
	}
</script>

<div class="hero flex-1">
	<div class="hero-content flex-col lg:flex-row">
		<lottie-player
			autoplay
			loop
			mode="normal"
			src="https://assets7.lottiefiles.com/packages/lf20_M9p23l.json"
			class="max-w-md rounded-lg shadow-2xl"
		/>
		<div>
			<h1 class="text-5xl font-bold py-3">Welcome to Bowled!</h1>
			<p class="py-5">
				Hello, my name is XYZ, and I'm your assistant.
				<br />
				I will assist you in managing our franchise.
			</p>
			<div class="form-control w-full max-w-xs py-3">
				<form use:form>
					<label class="label" for="managerName">
						<span class="label-text">How should I address you?</span>
					</label>
					<!-- svelte-ignore a11y-autofocus -->
					<input
						type="text"
						placeholder="Type your name here"
						class="input input-bordered w-full max-w-xs"
						id="managerName"
						name="managerName"
					/>
					<Hint class="label-text text-red-500 py-1" for="managerName" on="minLength" let:value>
						Name should be atleast {value} characters long
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
