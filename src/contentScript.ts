type NewVideoMessage = {
    type: "NEW_VIDEO_URL";
    url: string;
};

function sendNewVideoMessage(message: NewVideoMessage): void {
    try {
        chrome.runtime.sendMessage(message);
    } catch {
        console.debug("[contentScript] Could not send message; extension context invalidated.");
    }
}

// Return the current URL if it’s a YouTube watch page
function getCurrentVideoUrl(): string | null {
    const href = window.location.href;
    return href.includes("watch?v=") ? href : null;
}

// Only after 15 seconds on the same /watch?v=… URL
let currentVideoUrl: string | null = null;
let watchTimerId: number | null = null;

function handleUrlChange(newUrl: string): void {
    const isWatchPage = newUrl.includes("watch?v=");
    if (isWatchPage && newUrl !== currentVideoUrl) {
        // Switched to a new video
        currentVideoUrl = newUrl;
        if (watchTimerId !== null) {
            clearTimeout(watchTimerId);
            watchTimerId = null;
        }
        watchTimerId = window.setTimeout(() => {
            if (currentVideoUrl === newUrl) {
                sendNewVideoMessage({ type: "NEW_VIDEO_URL", url: newUrl });
            }
            watchTimerId = null;
        }, 15_000);
    } else if (!isWatchPage) {
        // Navigated away from a watch page
        if (watchTimerId !== null) {
            clearTimeout(watchTimerId);
            watchTimerId = null;
        }
        currentVideoUrl = null;
    }
}

function observeUrlChanges(): void {
    let lastHref = window.location.href;
    const observer = new MutationObserver(() => {
        const newHref = window.location.href;
        if (newHref !== lastHref) {
            lastHref = newHref;
            handleUrlChange(newHref);
        }
    });
    observer.observe(document, { subtree: true, childList: true });
}

function tryInitialUrl(): void {
    const initialUrl = getCurrentVideoUrl();
    if (initialUrl !== null) {
        handleUrlChange(initialUrl);
    }
}

function watchForYouTubeVideoLoads(): void {
    tryInitialUrl();
    observeUrlChanges();
}

watchForYouTubeVideoLoads();
