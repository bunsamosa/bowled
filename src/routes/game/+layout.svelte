<script lang="ts">
	import { page } from '$app/stores';

	// active tabs
	$: homeTabActive = $page.url.pathname == '/game/home';
	$: financeTabActive = $page.url.pathname == '/game/finance';
</script>

<!-- Layout for onboarding pages -->
<div class="h-screen max-w-screen-xl m-auto flex flex-col">
	<div class="navbar flex-none ">
		<div class="navbar-start">
			<a class="btn btn-ghost normal-case text-2xl" href="/">Bowled</a>
		</div>
		<div class="navbar-center btn-group">
			<a class="btn btn-ghost normal-case tab" class:btn-active={homeTabActive} href="/game/home">
				Home
			</a>
			<a
				class="btn btn-ghost normal-case tab"
				class:btn-active={financeTabActive}
				href="/game/finance">Finance</a
			>
		</div>
		<div class="navbar-end">
			<button class="btn btn-ghost normal-case">Exit</button>
		</div>
	</div>
	<slot />
</div>
