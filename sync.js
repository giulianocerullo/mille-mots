// Mille Mots — Google sign-in and progress sync with Firebase.
// Loaded on demand by index.html and app.html. If Firebase is not configured
// (or cannot be reached), the app keeps working with progress saved on the device.
import { firebaseConfig } from './firebase-config.js';

const VERSION = '10.12.2';
const BASE = `https://www.gstatic.com/firebasejs/${VERSION}/`;
let F = null; // { auth, db, fa, ff }

export function configured() {
  return !!(firebaseConfig && firebaseConfig.apiKey && !/PASTE|YOUR/i.test(firebaseConfig.apiKey));
}

export async function init(onUser) {
  if (!configured()) return { ok: false, reason: 'not-configured' };
  try {
    const [fapp, fa, ff] = await Promise.all([
      import(BASE + 'firebase-app.js'),
      import(BASE + 'firebase-auth.js'),
      import(BASE + 'firebase-firestore.js'),
    ]);
    const app = fapp.initializeApp(firebaseConfig);
    const auth = fa.getAuth(app);
    const db = ff.getFirestore(app);
    F = { auth, db, fa, ff };
    try { await fa.getRedirectResult(auth); } catch (e) { /* no pending redirect */ }
    fa.onAuthStateChanged(auth, (u) => onUser(u ? {
      uid: u.uid, name: u.displayName || '', email: u.email || '', photo: u.photoURL || '',
    } : null));
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: 'unavailable', error: String(e) };
  }
}

export async function signIn() {
  if (!F) throw new Error('unavailable');
  const provider = new F.fa.GoogleAuthProvider();
  try {
    await F.fa.signInWithPopup(F.auth, provider);
  } catch (e) {
    const code = (e && e.code) || '';
    if (/popup-blocked|operation-not-supported/.test(code)) {
      await F.fa.signInWithRedirect(F.auth, provider);
    } else {
      throw e;
    }
  }
}

export async function signOut() {
  if (F) await F.fa.signOut(F.auth);
}

export async function pull(uid) {
  const snap = await F.ff.getDoc(F.ff.doc(F.db, 'users', uid));
  if (!snap.exists()) return null;
  try { return JSON.parse(snap.data().state); } catch (e) { return null; }
}

export async function push(uid, state) {
  await F.ff.setDoc(F.ff.doc(F.db, 'users', uid), {
    state: JSON.stringify(state),
    updatedAt: F.ff.serverTimestamp(),
  });
}
