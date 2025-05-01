chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: "popup.html" });
});

const OFFSCREEN_DOCUMENT_PATH = "offscreen.html";
let creatingOffscreen: Promise<void> | null = null;

async function hasOffscreenDocument(): Promise<boolean> {
    const clientsList = await (self as unknown as ServiceWorkerGlobalScope).clients.matchAll();
    return clientsList.some((client: Client) => client.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH));
}

async function setupOffscreenDocument(): Promise<void> {
    if (await hasOffscreenDocument()) return;

    if (!creatingOffscreen) {
        creatingOffscreen = chrome.offscreen
            .createDocument({
                url: OFFSCREEN_DOCUMENT_PATH,
                reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
                justification: "Sign in with Firebase popup",
            })
            .then(() => {
                creatingOffscreen = null;
            });
    }
    console.log("Offscreen created");

    return creatingOffscreen;
}

async function closeOffscreenDocument(): Promise<void> {
    if (await hasOffscreenDocument()) {
        await chrome.offscreen.closeDocument();
    }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log("Message recieved", message.target, message.type);
    if (message.target === "offscreen" && message.type === "firebase-auth") {
        setupOffscreenDocument().then(() => {
            console.log("Creating offscreen");
            chrome.runtime.sendMessage(
                {
                    target: "offscreen",
                    type: "firebase-auth",
                },
                (response) => {
                    sendResponse(response);
                    closeOffscreenDocument();
                }
            );
        });
        
        return true;
    }
});
