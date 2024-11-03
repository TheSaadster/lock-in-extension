// Background script to check the time and block websites

// Default block times and sites (can be modified through options page)
let blockedSites = [];
let startHour = 9;  // Default value
let endHour = 17;   // Default value
let isInitialized = false;

// Initialize settings from storage
function initializeSettings() {
    chrome.storage.sync.get({
        blockedSites: [],
        startHour: 9,
        endHour: 17
    }, (result) => {
        blockedSites = result.blockedSites;
        startHour = parseInt(result.startHour);  // Ensure these are numbers
        endHour = parseInt(result.endHour);      // Ensure these are numbers
        isInitialized = true;
        console.log('Settings initialized:', { blockedSites, startHour, endHour }); // Debug log
    });
}

// Initialize when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    initializeSettings();
});

// Also initialize when the service worker starts
initializeSettings();

// Function to check if current time is within blocked hours
function isWithinBlockedHours() {
    const currentHour = new Date().getHours();
    console.log('Time check:', { currentHour, startHour, endHour }); // Debug log

    if (startHour <= endHour) {
        // Normal time range (e.g., 9 to 17)
        return currentHour >= startHour && currentHour < endHour;
    } else {
        // Overnight time range (e.g., 22 to 6)
        return currentHour >= startHour || currentHour < endHour;
    }
}

// Function to check if a site should be blocked
function shouldBlockSite(url) {
    if (!isInitialized) {
        console.log('Not initialized yet'); // Debug log
        return false;
    }

    const shouldBlock = blockedSites.some((site) => url.includes(site)) && isWithinBlockedHours();
    console.log('Block check:', { url, shouldBlock }); // Debug log
    return shouldBlock;
}

// Monitor for web navigation events
chrome.webNavigation.onCompleted.addListener(
    function(details) {
        if (shouldBlockSite(details.url)) {
            // Redirect to our custom block page
            const blockPageUrl = chrome.runtime.getURL('block.html');
            chrome.tabs.update(details.tabId, { 
                url: blockPageUrl
            });
            
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icon.png",
                title: "Site Blocked",
                message: "LOCK IN! Stay focused! 💪"
            });
        }
    },
    {
        url: [{
            schemes: ['http', 'https']
        }]
    }
);

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.blockedSites) {
        blockedSites = changes.blockedSites.newValue;
    }
    if (changes.startHour) {
        startHour = parseInt(changes.startHour.newValue);
    }
    if (changes.endHour) {
        endHour = parseInt(changes.endHour.newValue);
    }
    console.log('Settings updated:', { blockedSites, startHour, endHour }); // Debug log
});