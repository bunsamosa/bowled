<script lang="ts">
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faTwitter } from '@fortawesome/free-brands-svg-icons';
</script>

<div class="max-w-screen-xl m-auto">
	<!-- Nav bar -->
	<div class="sticky z-50 top-0 navbar max-w-screen-xl">
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
	<slot />
</div>
