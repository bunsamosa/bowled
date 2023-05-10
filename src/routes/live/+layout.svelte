<script setup lang="ts">
	import Fa from 'svelte-fa/src/fa.svelte';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
</script>

<AppShell
	class="max-w-screen-xl m-auto"
	regionPage="relative"
	slotPageContent="overflow-hidden hide-scrollbar"
>
	<svelte:fragment slot="header">
		<AppBar background="">
			<svelte:fragment slot="lead">
				<a href="/" class="text-2xl font-semibold">Bowled</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a href="https://twitter.com/bowledGG" target="_blank" class="px-1">
					<Fa size="lg" icon={faTwitter} />
				</a>
				<a href="https://twitter.com/bowledGG" target="_blank" class="px-1">
					<Fa size="lg" icon={faGithub} />
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
