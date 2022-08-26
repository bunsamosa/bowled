<script setup lang="ts">
import { AuthProvider } from '@arcana/auth'

// initialize auth provider
const arcanaAppID = import.meta.env.VITE_ARCANA_APP_ID;
const auth = new AuthProvider(arcanaAppID);
await auth.init({
    //appMode can be 0, 1, or 2 depending upon wallet UI mode that needs to be configured
    // no ui, widget, full ui modes.
    appMode: 0,
    position: "right",
});

// google login
// await auth.loginWithSocial("google");
// await auth.requestSocialLogin('google')
// const connected = await auth.isLoggedIn();

const provider = auth.provider;

</script>
<template>
</template>
