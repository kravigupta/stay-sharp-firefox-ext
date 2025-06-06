// Polyfill for browser API
const extApi = (typeof browser !== 'undefined') ? browser : chrome;

document.addEventListener("DOMContentLoaded", () => {
    // Blocked Sites
    const blockListEl = document.getElementById("blockList");
    const blockInput = document.getElementById("blockInput");
    const addBlockBtn = document.getElementById("addBlock");

    // Goals
    const goalsListEl = document.getElementById("goalsList");
    const goalInput = document.getElementById("goalInput");
    const addGoalBtn = document.getElementById("addGoal");

    // Suggested Sites
    const suggestListEl = document.getElementById("suggestList");
    const suggestNameInput = document.getElementById("suggestNameInput");
    const suggestUrlInput = document.getElementById("suggestUrlInput");
    const addSuggestBtn = document.getElementById("addSuggest");

    // Helper to render favicon
    function getFaviconUrl(url) {
        try {
            let u = new URL(url.startsWith('http') ? url : 'https://' + url);
            return `${u.origin}/favicon.ico`;
        } catch {
            return 'images/stay-sharp.png';
        }
    }

    // Render Blocked Sites
    function renderBlocked(list) {
        if (!blockListEl) return;
        blockListEl.innerHTML = "";
        list.forEach((item, idx) => {
            const li = document.createElement("li");
            li.className = "site-item";
            const span = document.createElement("span");
            span.textContent = item;
            li.appendChild(span);
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.className = "delete-btn";
            delBtn.onclick = () => {
                list.splice(idx, 1);
                extApi.storage.sync.set({ blockList: list });
                renderBlocked(list);
            };
            li.appendChild(delBtn);
            blockListEl.appendChild(li);
        });
    }

    // Render Goals
    function renderGoals(goals) {
        if (!goalsListEl) return;
        goalsListEl.innerHTML = "";
        goals.forEach((goal, idx) => {
            const li = document.createElement("li");
            li.className = "site-item";
            const span = document.createElement("span");
            span.textContent = goal;
            li.appendChild(span);
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.className = "delete-btn";
            delBtn.onclick = () => {
                goals.splice(idx, 1);
                extApi.storage.sync.set({ goals });
                renderGoals(goals);
            };
            li.appendChild(delBtn);
            goalsListEl.appendChild(li);
        });
    }

    // Render Suggested Sites
    function renderSuggested(sites) {
        if (!suggestListEl) return;
        // Migrate any string entries to {name: '', url: string}
        let changed = false;
        const normalized = sites.map(site => {
            if (typeof site === 'string') {
                changed = true;
                return { name: '', url: site };
            }
            return site;
        });
        if (changed) {
            extApi.storage.sync.set({ suggestList: normalized });
        }
        suggestListEl.innerHTML = "";
        normalized.forEach((site, idx) => {
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
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.className = "delete-btn";
            delBtn.onclick = () => {
                normalized.splice(idx, 1);
                extApi.storage.sync.set({ suggestList: normalized });
                renderSuggested(normalized);
            };
            li.appendChild(delBtn);
            suggestListEl.appendChild(li);
        });
    }

    // Load all lists from storage
    extApi.storage.sync.get(["blockList", "goals", "suggestList"]).then((result) => {
        const blockList = result.blockList || [];
        // Fix: ensure goals is always an array
        let goals = result.goals;
        if (!Array.isArray(goals)) {
            if (typeof goals === 'string' && goals.trim() !== '') {
                goals = [goals];
            } else {
                goals = [];
            }
        }
        const suggestList = result.suggestList || [];
        renderBlocked(blockList);
        renderGoals(goals);
        renderSuggested(suggestList);

        // Add Blocked Site
        if (addBlockBtn && blockInput && blockInput instanceof HTMLInputElement) {
            addBlockBtn.onclick = () => {
                const val = blockInput.value.trim();
                if (val && !blockList.includes(val)) {
                    blockList.push(val);
                    extApi.storage.sync.set({ blockList });
                    renderBlocked(blockList);
                    blockInput.value = "";
                }
            };
        }

        // Add Goal
        if (addGoalBtn && goalInput && goalInput instanceof HTMLInputElement) {
            addGoalBtn.onclick = () => {
                const val = goalInput.value.trim();
                if (val && !goals.includes(val)) {
                    goals.push(val);
                    extApi.storage.sync.set({ goals });
                    renderGoals(goals);
                    goalInput.value = "";
                }
            };
        }

        // Add Suggested Site
        if (addSuggestBtn && suggestUrlInput && suggestUrlInput instanceof HTMLInputElement) {
            addSuggestBtn.onclick = () => {
                const url = suggestUrlInput.value.trim();
                const name = suggestNameInput && suggestNameInput instanceof HTMLInputElement ? suggestNameInput.value.trim() : "";
                if (url && !suggestList.some(site => site.url === url)) {
                    suggestList.push({ name, url });
                    extApi.storage.sync.set({ suggestList });
                    renderSuggested(suggestList);
                    suggestUrlInput.value = "";
                    if (suggestNameInput && suggestNameInput instanceof HTMLInputElement) suggestNameInput.value = "";
                }
            };
        }
    });
});
