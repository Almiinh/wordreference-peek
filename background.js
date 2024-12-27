const browser = window.browser || window.chrome;

browser.menus.create({
    id: "export-wr-history",
    title: "Export WordReference History",
    contexts: ["page"],
    documentUrlPatterns: ["*://*.wordreference.com/*"],
});

browser.menus.create({
    id: "peek",
    title: "Peek at this word on WordReference (Alt+W)",
    contexts: ["selection"],
});

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "export-wr-history") {
        browser.tabs
            .sendMessage(tab.id, { action: "export" })
            .then((response) => {
                if (response.success) {
                    const blob = new Blob([response.data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    return browser.downloads
                        .download({
                            url: url,
                            filename: "sWRsaveHistory.json",
                            saveAs: true,
                        })
                        .finally(() => URL.revokeObjectURL(url));
                } else {
                    alert(response.error);
                }
            })
            .catch((error) => alert("Error: " + error.message));
    } else if (info.menuItemId === "peek") {
        browser.tabs.sendMessage(tab.id, { action: "peek" }).catch((error) => alert("Error: " + error.message));
    }
});

