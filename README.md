# YouTube Recommendation Chrome Extension

A **Manifest V3** Chrome extension that will bring personalized video recommendations directly into your browser, powered by YouTube watch history and Firebase Authentication.

## Project Overview

This extension is designed to:

* **Securely authenticate** users via Firebase (email/password) to ensure each person’s recommendations are private and persistent.
* **Capture YouTube watch events** in real time, building a personal history of videos watched across sessions.
* **Surface tailored recommendations** based on viewing patterns, leveraging simple heuristics or machine‑learning models in future iterations.

## Key Features

1. **User Authentication**

   * Email/password sign‑up, sign‑in, and sign‑out flows.
   * User session persistence across browser restarts.

2. **Watch History Tracking**

   * Intercepts YouTube watch events via a background/content script.
   * Stores events under each user’s profile in Firestore for later analysis.

3. **Recommendation Engine**

   * Initial rule‑based suggestions (e.g. “more like this” playlists).
   * Future roadmap: lightweight ML models trained on watch patterns.

## Roadmap & Vision

* **Phase 1**: Core authentication and watch history logging.
* **Phase 2**: Simple rule‑based recommendation UI integrated in the popup.
* **Phase 3**: Analytics dashboard and advanced algorithms (collaborative filtering, content‑based filtering).
* **Phase 4**: Publishing to the Chrome Web Store and gathering user feedback for iterative improvements.

## Technology Stack

* **Chrome Extension MV3**: Modern extension architecture with service workers.
* **React & Vite**: Fast, modular UI for the popup interface.
* **Firebase**: Auth + Firestore for secure user data and storage.
* **TypeScript**: Strict typing across all extension code for maintainability.

---

*This project lays the foundation for a seamless, personalized YouTube experience directly from your browser toolbar.*
