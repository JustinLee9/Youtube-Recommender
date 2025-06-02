import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export function SignInButton() {
    async function handleSignIn() {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            console.log("User signed in:", auth.currentUser?.uid);
        } catch (err) {
            console.error("Sign-in failed:", err);
        }
    }

    return <button onClick={handleSignIn}>Sign in with Google</button>;
}
