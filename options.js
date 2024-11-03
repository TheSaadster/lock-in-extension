document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    chrome.storage.sync.get({
        blockedSites: [],
        startHour: 9,
        endHour: 17
    }, (items) => {
        document.getElementById('blockedSites').value = items.blockedSites.join('\n');
        document.getElementById('startHour').value = items.startHour;
        document.getElementById('endHour').value = items.endHour;
    });

    // Save settings
    document.getElementById('save').addEventListener('click', () => {
        const blockedSites = document.getElementById('blockedSites')
            .value.split('\n')
            .map(site => site.trim())
            .filter(site => site.length > 0);
        
        const startHour = parseInt(document.getElementById('startHour').value);
        const endHour = parseInt(document.getElementById('endHour').value);

        if (isNaN(startHour) || startHour < 0 || startHour > 23 ||
            isNaN(endHour) || endHour < 0 || endHour > 23) {
            document.getElementById('status').textContent = 'Please enter valid hours (0-23)';
            return;
        }

        chrome.storage.sync.set({
            blockedSites: blockedSites,
            startHour: startHour,
            endHour: endHour
        }, () => {
            // Show saved message
            const status = document.getElementById('status');
            status.textContent = 'Options saved!';
            setTimeout(() => {
                status.textContent = '';
            }, 2000);
        });
    });
});