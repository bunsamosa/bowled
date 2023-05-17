<script setup lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	export let skillName: string = '';
	export let skillColor: string = '';
	export let skillLevel: string = '';
	export let skillIndex: number = 0;
	export let skillMin: number = 0;
	export let skillMax: number = 20;
</script>

<div class="flex flex-col w-full m-1">
	<div class="flex flex-row justify-between w-full">
		<span class="font-semibold">{skillName}</span>
		<span class="font-semibold" style="color:{skillColor}">
			{skillLevel}
		</span>
	</div>
	<span class="my-1" style="">
		<ProgressBar
			min={skillMin}
			max={skillMax}
			label={skillName}
			value={skillIndex}
			meter="bg-yellow-500"
			track="bg-gray-300"
		/>
	</span>
</div>
