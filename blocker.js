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
            // Sites with name: show as box with icon
            const namedSites = suggestList.filter(site => site.name && site.name.trim() !== "");
            const unnamedSites = suggestList.filter(site => !site.name || site.name.trim() === "");
            if (namedSites.length > 0) {
                const boxList = document.createElement('div');
                boxList.className = 'suggested-box-list';
                namedSites.forEach(site => {
                    const box = document.createElement('div');
                    box.className = 'suggested-site-box';
                    const img = document.createElement('img');
                    img.src = getFaviconUrl(site.url);
                    img.className = 'suggested-site-icon';
                    img.alt = 'icon';
                    img.onerror = function() {
                        this.onerror = null;
                        this.src = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/globe.svg';
                    };
                    box.appendChild(img);
                    const link = document.createElement('a');
                    link.href = site.url.startsWith('http') ? site.url : 'https://' + site.url;
                    link.target = '_blank';
                    link.className = 'suggested-site-link';
                    link.textContent = site.name;
                    box.appendChild(link);
                    boxList.appendChild(box);
                });
                suggestListEl.appendChild(boxList);
            }
            // Sites without name: show as list (current style)
            unnamedSites.forEach(site => {
                const li = document.createElement("li");
                li.className = "site-item";
                const favicon = document.createElement("img");
                favicon.src = getFaviconUrl(site.url);
                favicon.className = "favicon";
                favicon.alt = "favicon";
                favicon.onerror = function() {
                    this.onerror = null;
                    this.src = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/globe.svg";
                };
                li.appendChild(favicon);
                const a = document.createElement("a");
                a.href = site.url.startsWith('http') ? site.url : `https://${site.url}`;
                a.textContent = site.url;
                a.target = "_blank";
                li.appendChild(a);
                suggestListEl.appendChild(li);
            });
        }
    });
});
