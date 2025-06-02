import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Keep track of the currently signed‐in user’s UID
let currentUid: string | null = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUid = user.uid;
        console.log("[background] Signed in as", currentUid);
    } else {
        currentUid = null;
        console.log("[background] No user signed in");
    }
});

// Listen for messages from contentScript
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "NEW_VIDEO_URL" && typeof message.url === "string") {
        if (!currentUid) {
            console.error("[background] Cannot write: no user is signed in.");
            sendResponse({ status: "error", error: "Not authenticated" });
            return false;
        }

        // Attempt to record this video URL under /users/{uid}/watchHistory/{videoId}
        recordVideoUrlForUser(currentUid, message.url)
            .then((didWrite) => {
                if (didWrite) {
                    sendResponse({ status: "ok", added: true });
                } else {
                    sendResponse({ status: "ok", added: false });
                }
            })
            .catch((err) => {
                console.error("[background] Firestore write failed:", err);
                sendResponse({ status: "error", error: err.message });
            });

        return true;
    }
    return false;
});

async function recordVideoUrlForUser(userId: string, videoUrl: string): Promise<boolean> {
    // Parse the URL and extract ?v=VIDEO_ID
    let videoId: string | null = null;
    try {
        const parsed = new URL(videoUrl);
        videoId = parsed.searchParams.get("v");
    } catch {
        // If URL parsing fails return false
        return false;
    }
    if (!videoId) {
        // Not a valid /watch?v=… URL
        return false;
    }

    // Build a document reference under /users/{userId}/watchHistory/{videoId}
    const docRef = doc(db, "users", userId, "watchHistory", videoId);

    // See if a document with this videoId already exists
    const existing = await getDoc(docRef);
    if (existing.exists()) {
        // If already recorded no need to add again
        console.log(`[background] Already recorded videoId=${videoId} for user=${userId}, skipping.`);
        return false;
    }

    // If it does not exist, create it
    await setDoc(docRef, {
        url: videoUrl,
        timestamp: serverTimestamp(),
    });
    console.log(`[background] Wrote new video record under users/${userId}/watchHistory/${videoId}`);
    return true;
}

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: "popup.html" });
});
