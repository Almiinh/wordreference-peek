let selectedWord = "";
// Prefetch WordReference to speed up the first lookup
const link = document.createElement('link');
link.rel = 'prefetch';
link.href = 'https://wordreference.com';
document.head.appendChild(link);

function computePosition(iframeWidth, iframeHeight) {
    const selectionRectangle = window.getSelection().getRangeAt(0).getBoundingClientRect();
    let top = selectionRectangle.top - 0.2 * iframeHeight;
    let left = selectionRectangle.right + 10;
    // If iframe would go off the top
    if (top < 0) {
        top = 5;
    }
    // If iframe would go off the bottom
    if (top + iframeHeight > window.innerHeight) {
        top = window.innerHeight - iframeHeight - 5;
    }
    // If iframe would go off the left
    if (left < 0) {
        left = 0;
    }
    // If iframe would go off the right
    if (left + iframeWidth > window.innerWidth) {
        left = window.innerWidth - iframeWidth - 5;
    }
    return { top, left };
}

function removePeek() {
    const iframe = document.getElementById("wordreference-peek");
    if (iframe) {
        iframe.remove();
    }
}

function peekWord(selectedWord) {
    const url = `https://www.wordreference.com/enfr/${encodeURIComponent(selectedWord)}`;

    const iframeHeight = 500;
    const iframeWidth = 310;
    const wRpurple = "#5e58c7";
    const { top, left } = computePosition(iframeWidth, iframeHeight);

    const div = document.createElement("div");
    div.id = "wordreference-peek";
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.position = "fixed";
    iframe.style.top = top + `px`;
    iframe.style.left = left + `px`;
    iframe.style.width = `${iframeWidth}px`;
    iframe.style.height = `${iframeHeight}px`;
    iframe.style.border = "1px solid" + wRpurple;
    iframe.style.borderRadius = "5px";
    iframe.style.zIndex = "9999";
    iframe.style.backgroundColor = wRpurple;
    iframe.style.overflow = "hidden";
    iframe.style.boxShadow = "0 0 2px rgba(0, 0, 0, 0.1)";
    div.appendChild(iframe);
    document.body.appendChild(div);
}

document.addEventListener("scroll", removePeek);
document.addEventListener("click", removePeek);
document.addEventListener("dblclick", removePeek);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") removePeek();
});

document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key === "w") {
        const selectedWord = window.getSelection().toString();
        if (selectedWord) {
            peekWord(selectedWord);
        }
    }
});

browser.runtime.onMessage.addListener((request) => {
    if (request.action === "peek") {
        try {
            const selectedWord = window.getSelection().toString();
            if (selectedWord) {
                peekWord(selectedWord);
            }
            return Promise.resolve({ success: true, data });
        } catch (error) {
            return Promise.resolve({ success: false, error: error.message });
        }
    }
});
