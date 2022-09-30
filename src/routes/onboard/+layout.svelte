<!-- Layout for onboarding pages -->
<div class="h-screen max-w-screen-xl m-auto flex flex-col">
	<div class="navbar flex-none">
		<div class="flex-1">
			<a class="btn btn-ghost normal-case text-2xl" href="/">Bowled</a>
		</div>
		<div class="flex-none">
			<button class="btn btn-ghost normal-case">Exit</button>
		</div>
	</div>
	<slot />
</div>
