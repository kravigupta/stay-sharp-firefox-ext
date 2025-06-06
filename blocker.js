document.addEventListener("DOMContentLoaded", () => {
    // Polyfill for browser API
    const extApi = (typeof browser !== 'undefined') ? browser : chrome;

    // Blocked Sites
    const blockListEl = document.getElementById("blockList");
    // Goals
    const goalsText = document.getElementById("goalsText");
    // Suggested Sites
    const suggestListEl = document.getElementById("suggestList");

    // Helper to render favicon
    function getFaviconUrl(url) {
        try {
            let u = new URL(url.startsWith('http') ? url : 'https://' + url);
            return `${u.origin}/favicon.ico`;
        } catch {
            return 'images/stay-sharp.png';
        }
    }

    extApi.storage.sync.get(["blockList", "goals", "suggestList"]).then((result) => {
        // Blocked Sites
        const blockList = result.blockList || [];
        if (blockListEl) {
            blockListEl.innerHTML = "";
            blockList.forEach(site => {
                const li = document.createElement("li");
                li.className = "site-item";
                const span = document.createElement("span");
                span.textContent = site;
                li.appendChild(span);
                blockListEl.appendChild(li);
            });
        }
        // Goals
        let goals = result.goals;
        if (!Array.isArray(goals)) {
            if (typeof goals === 'string' && goals.trim() !== '') {
                goals = [goals];
            } else {
                goals = [];
            }
        }
        const goalsList = document.getElementById("goalsList");
        if (goalsList) {
            goalsList.innerHTML = '';
            if (goals.length > 0) {
                goals.forEach(goal => {
                    const box = document.createElement('div');
                    box.className = 'goal-box';
                    box.innerHTML = '<img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/flag-fill.svg" class="goal-flag" alt="flag">' +
                        '<span class="goal-text">' + goal + '</span>';
                    goalsList.appendChild(box);
                });
            } else {
                goalsList.innerHTML = 'Set your goals in the <a href="options.html" target="_blank" style="color:#3498db;">extension options</a>!';
            }
        }
        // Suggested Sites
        const suggestList = result.suggestList || [];
        if (suggestListEl) {
            suggestListEl.innerHTML = "";
            suggestList.forEach(site => {
                const li = document.createElement("li");
                li.className = "site-item";
                const favicon = document.createElement("img");
                favicon.src = getFaviconUrl(site.url);
                favicon.className = "favicon";
                favicon.alt = "favicon";
                favicon.onerror = function() {
                    this.onerror = null;
                    this.src = "images/stay-sharp.png";
                };
                li.appendChild(favicon);
                const a = document.createElement("a");
                a.href = site.url.startsWith('http') ? site.url : `https://${site.url}`;
                a.textContent = site.name ? site.name : site.url;
                a.target = "_blank";
                li.appendChild(a);
                suggestListEl.appendChild(li);
            });
        }
    });
});
