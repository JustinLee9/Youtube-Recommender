chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: "popup.html" });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received:", sender, message);

    if (message?.type === "login") {
        const clientId = "704693548770-6putqt357sqsr7lo17befl42h816laci.apps.googleusercontent.com";
        const redirectUri = chrome.identity.getRedirectURL();
        const scopes = "https://www.googleapis.com/auth/youtube.readonly";

        const authUrl = `https://accounts.google.com/o/oauth2/auth` + `?client_id=${clientId}` + `&redirect_uri=${encodeURIComponent(redirectUri)}` + `&response_type=token` + `&scope=${encodeURIComponent(scopes)}` + `&prompt=consent` + `&access_type=online`;

        chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectUrl) => {
            if (chrome.runtime.lastError) {
                console.error("OAuth failed:", chrome.runtime.lastError.message);
                sendResponse({ error: chrome.runtime.lastError.message });
                return;
            }

            if (!redirectUrl) {
                console.error("Redirect URL is undefined or empty");
                sendResponse({ error: "No redirect URL returned" });
                return;
            }

            const params = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
            const token = params.get("access_token");

            if (token) {
                console.log("Token acquired:", token);
                sendResponse({ token });
            } else {
                console.error("Token not found in redirect URL");
                sendResponse({ error: "No token found" });
            }
        });

        return true; // Keep message channel open
    }
});
