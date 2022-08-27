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
    ]
});
const onboard = useOnboard();

export { web3Onboard, onboard };
