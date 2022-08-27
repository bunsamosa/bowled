import { init } from '@web3-onboard/vue'
import { useOnboard } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'

const injected = injectedModule();
const rpcUrl = import.meta.env.VITE_RPC_URl;

// initialize web3onboard
const web3Onboard = init({
    wallets: [injected],
    chains: [
        {
            id: import.meta.env.VITE_CHAIN_ID,
            token: import.meta.env.VITE_CHAIN_TOKEN,
            label: import.meta.env.VITE_CHAIN_LABEL,
            rpcUrl
        }
    ],
    appMetadata: {
        name: "Stumped",
        icon: "images/stumped_logo_yellow.jpeg",
        description: "T20 team management game"
    },
    accountCenter: {
        desktop: {
            enabled: false
        },
        mobile: {
            enabled: false
        }
    },
    apiKey: import.meta.env.VITE_BN_API_KEY,
    connect: {
        showSidebar: false
    }
});
const onboard = useOnboard();

export { web3Onboard, onboard };
