<script setup lang="ts">
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

	export let featureText = 'New Feature';
	export let onClickAction = () => {};
</script>

<button
	class="h-10 m-auto max-w-[240px] py-1 px-1 rounded-full bg-gray-800 hover:bg-gray-700"
	on:click={onClickAction}
>
	<span class="flex flex-row items-center">
		<div class="text-xs bg-secondary-600 rounded-full px-4 py-1.5">New</div>
		<div class="text-sm font-medium px-2 py-1.5">{featureText}</div>
		<Fa size="lg" icon={faAngleRight} />
	</span>
</button>
