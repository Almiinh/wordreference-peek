function exportHistory() {
    try {
        const history = JSON.parse(localStorage.getItem("sWRsaveHistory"));
        if (!history?.saved) {
            throw new Error("No history found");
        }

        return JSON.stringify(history, null, 2);
    } catch (e) {
        throw new Error("Failed to export history: " + e.message);
    }
}

browser.runtime.onMessage.addListener((request) => {
    if (request.action === "export") {
        try {
            const data = exportHistory();
            return Promise.resolve({ success: true, data });
        } catch (error) {
            return Promise.resolve({ success: false, error: error.message });
        }
    }
});
