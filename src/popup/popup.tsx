import { useState, useEffect, FC, ChangeEvent } from "react";
import { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, User as FirebaseUser, UserCredential } from "firebase/auth/web-extension";
import "./popup.css";

const firebaseConfig = {
    apiKey: "AIzaSyBXsuFqkw65oK9VPQuBIQOMHuzWah9tKgo",
    authDomain: "extension-a04e7.firebaseapp.com",
    projectId: "extension-a04e7",
    storageBucket: "extension-a04e7.firebasestorage.app",
    messagingSenderId: "192486774122",
    appId: "1:192486774122:web:860a3e47704e761c8ec113",
    measurementId: "G-V3866BPDSR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

type AuthState = {
    user: FirebaseUser | null;
    loading: boolean;
    error: string | null;
};

const Popup: FC = () => {
    const [{ user, loading, error }, setAuthState] = useState<AuthState>({
        user: null,
        loading: false,
        error: null,
    });
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>(""); // optional display name

    // Listen to auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setAuthState({ user: currentUser, loading: false, error: null });
        });
        return unsubscribe;
    }, []);

    const handleAuth = async (): Promise<void> => {
        setAuthState({ user: null, loading: true, error: null });
        try {
            let userCred: UserCredential;
            if (isRegister) {
                userCred = await createUserWithEmailAndPassword(auth, email, password);
                // If provided, set the username as displayName
                if (username.trim()) {
                    await updateProfile(userCred.user, { displayName: username.trim() });
                }
            } else {
                userCred = await signInWithEmailAndPassword(auth, email, password);
            }
            console.debug("Authenticated user:", userCred.user.uid);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setAuthState({ user: null, loading: false, error: message });
        }
    };

    const handleSignOut = async (): Promise<void> => {
        await signOut(auth);
    };

    if (loading) return <p>Loading…</p>;
    if (user) {
        return (
            <div className="container">
                <h2>Welcome, {user.displayName ?? user.email}</h2>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        );
    }

    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);

    return (
        <div className="container">
            <h2>{isRegister ? "Register" : "Sign In"}</h2>
            {isRegister && <input type="text" placeholder="Username (optional)" value={username} onChange={onUsernameChange} />}
            <input type="email" placeholder="Email" value={email} onChange={onEmailChange} />
            <input type="password" placeholder="Password" value={password} onChange={onPasswordChange} />
            <button onClick={handleAuth} disabled={!email || !password}>
                {isRegister ? "Register" : "Sign In"}
            </button>
            <p>
                {isRegister ? "Already have an account?" : "No account?"} <a onClick={() => setIsRegister((prev) => !prev)}>{isRegister ? "Sign In" : "Register"}</a>
            </p>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
createRoot(rootElement).render(<Popup />);

export default Popup;
