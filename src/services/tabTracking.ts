export function tabTracing() {
    chrome.tabs.onCreated.addListener((tab) => {
        console.log(`[TabTracking] Tab created - ID: ${tab.id}, Title: ${tab.title}, URL: ${tab.url}`);
        getAllTabs();
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            console.log(`[TabTracking] Tab updated - ID: ${tab.id}, Title: ${tab.title}, URL: ${tab.url}`);
            getAllTabs();
        }
    });

    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
        console.log(`[TabTracking] Tab removed - ID: ${tabId}`);
        getAllTabs();
    });

    chrome.tabs.onActivated.addListener(async (activeInfo) => {
        const activatedTab = await chrome.tabs.get(activeInfo.tabId);
        console.log(`[TabTracking] Tab activated ID: ${activatedTab.id}, Title: ${activatedTab.title}, URL: ${activatedTab.url}`);
    });
}

export async function getAllTabs() {
    const tabs = await chrome.tabs.query({});
    console.log('[TabTracking] Current list of all open tabs:');
    tabs.forEach(tab => {
        console.log(`- ID: ${tab.id}, Title: ${tab.title}, URL: ${tab.url}`);
    });
}
