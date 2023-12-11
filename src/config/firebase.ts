import firebase, { ServiceAccount } from "firebase-admin";
import { environment } from "./environment";

const { clientEmail, privateKey, projectId } = environment;

const ACCOUNT: ServiceAccount = { clientEmail, privateKey, projectId };

if (!firebase.apps.length) {
  try {
    firebase.initializeApp({
      credential: firebase.credential.cert(ACCOUNT),
    });
  } catch (error: any) {
    console.log("Firebase admin initialization error", error.stack);
  }
}

export const fireStoreInstance = firebase.firestore();
