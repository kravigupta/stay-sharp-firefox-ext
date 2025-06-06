/* 
 This file is part of the Stay Focus Browser Plugin. Unauthorized copying of this file, via any medium is strictly prohibited.
 @author Ravi Kumar Gupta <https://kravigupta.in>
 */

 let blockList = [];

// Load the block list when extension starts
browser.storage.sync.get("blockList").then((result) => {
    blockList = result.blockList || [];
});

// Listen for changes to the block list
browser.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.blockList) {
        blockList = changes.blockList.newValue;
    }
});

// Intercept every request and check against block list
browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        for (let domain of blockList) {
            if (details.url.includes(domain)) {
                return { redirectUrl: browser.runtime.getURL("blocker.html") };
            }
        }
        return {};
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);
