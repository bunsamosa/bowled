<script lang="ts">
	import HomeNavbar from '$lib/components/core/HomeNavbar.svelte';
	let bgImage = '/images/ball_grass_bg.png';
</script>

<!-- Background image -->
<!-- <div style="background-image: url({bgImage}); " class="bg-fixed	bg-center bg-no-repeat bg-cover "> -->
<!-- Gradient effect -->
<!-- <div class="bg-gradient-to-b from-black"> -->
<div class="max-w-screen-xl m-auto">
	<HomeNavbar />
	<slot />
</div>
<!-- </div> -->
<!-- </div> -->
