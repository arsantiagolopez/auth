// Waits for the amount of ms passed

const useDelay = (ms) => new Promise((res) => setTimeout(res, ms));

export { useDelay };
