/* 
 This file is part of the Stay Focus Browser Plugin. Unauthorized copying of this file, via any medium is strictly prohibited.
 @author Ravi Kumar Gupta <https://kravigupta.in>
 */

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
                // Safe DOM construction for the empty goals message
                goalsList.innerHTML = '';
                const msg = document.createElement('div');
                msg.className = 'empty-message';
                msg.textContent = 'Set your goals in the ';
                const link = document.createElement('a');
                link.href = 'options.html';
                link.target = '_blank';
                link.style.color = '#3498db';
                link.textContent = 'extension options';
                msg.appendChild(link);
                msg.appendChild(document.createTextNode('!'));
                goalsList.appendChild(msg);
            }
        }
        // Suggested Sites
        const suggestList = result.suggestList || [];
        if (suggestListEl) {
            suggestListEl.innerHTML = "";

            // Add view toggle controls (icons only, right-aligned)
            const viewToggle = document.createElement('div');
            viewToggle.className = 'suggested-view-toggle right-align';
            const cardBtn = document.createElement('button');
            cardBtn.innerHTML = '<img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/grid-3x3-gap-fill.svg" alt="Card View" style="width:1.2em;height:1.2em;vertical-align:middle;">';
            cardBtn.className = 'toggle-btn active';
            const listBtn = document.createElement('button');
            listBtn.innerHTML = '<img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/list-ul.svg" alt="List View" style="width:1.2em;height:1.2em;vertical-align:middle;">';
            listBtn.className = 'toggle-btn';
            viewToggle.appendChild(cardBtn);
            viewToggle.appendChild(listBtn);
            // Insert the toggle into the header row (same line as "Suggested Sites")
            const header = document.getElementById('suggestedSitesHeader');
            if (header) {
                header.appendChild(viewToggle);
            } else {
                suggestListEl.appendChild(viewToggle);
            }

            // Show message if no suggested sites
            if (!suggestList.length) {
                const msg = document.createElement('div');
                msg.className = 'empty-message';
                msg.textContent = 'No suggested sites yet. Set them in the ';
                const link = document.createElement('a');
                link.href = 'options.html';
                link.target = '_blank';
                link.style.color = '#3498db';
                link.textContent = 'extension options';
                msg.appendChild(link);
                msg.appendChild(document.createTextNode('!'));
                suggestListEl.appendChild(msg);
                return;
            }

            // Card view rendering function
            function renderCardView() {
                // Clear previous
                let old;
                if (suggestListEl) {
                    old = suggestListEl.querySelector('.suggested-box-list');
                    if (old) old.remove();
                    old = suggestListEl.querySelector('.suggested-list-view');
                    if (old) old.remove();
                }
                const namedSites = suggestList.filter(site => site.name && site.name.trim() !== "");
                const unnamedSites = suggestList.filter(site => !site.name || site.name.trim() === "");
                if (suggestListEl) {
                    const boxList = document.createElement('div');
                    boxList.className = 'suggested-box-list';
                    // Show named sites as cards
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
                    // Show unnamed sites as cards (with just the url)
                    unnamedSites.forEach(site => {
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
                        link.textContent = site.url;
                        box.appendChild(link);
                        boxList.appendChild(box);
                    });
                    suggestListEl.appendChild(boxList);
                }
            }

            // List view rendering function
            function renderListView() {
                // Clear previous
                let old;
                if (suggestListEl) {
                    old = suggestListEl.querySelector('.suggested-box-list');
                    if (old) old.remove();
                    old = suggestListEl.querySelector('.suggested-list-view');
                    if (old) old.remove();
                }
                const namedSites = suggestList.filter(site => site.name && site.name.trim() !== "");
                const unnamedSites = suggestList.filter(site => !site.name || site.name.trim() === "");
                if (suggestListEl) {
                    const listView = document.createElement('ul');
                    listView.className = 'suggested-list-view';
                    // Show all as list (named + unnamed)
                    namedSites.concat(unnamedSites).forEach(site => {
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
                        a.textContent = site.name ? site.name : site.url;
                        a.target = "_blank";
                        li.appendChild(a);
                        listView.appendChild(li);
                    });
                    suggestListEl.appendChild(listView);
                }
            }

            // Initial render (card view)
            renderCardView();

            // Toggle logic
            cardBtn.onclick = function() {
                cardBtn.classList.add('active');
                listBtn.classList.remove('active');
                renderCardView();
            };
            listBtn.onclick = function() {
                listBtn.classList.add('active');
                cardBtn.classList.remove('active');
                renderListView();
            };
        }
    });
});
