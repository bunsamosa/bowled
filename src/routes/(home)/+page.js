import { serverURL } from '$lib/utils/bowledClient';

// load metrics data
export const load = async ({ fetch }) => {

    const metricsURL = serverURL + '/live/metrics';
    const fetchMetrics = async () => {
        const response = await fetch(metricsURL);
        const metrics = await response.json();
        console.log('metrics', metrics);
        return metrics;
    }

    return {
        metrics: fetchMetrics()
    }
};
