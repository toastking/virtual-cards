import firebase from 'firebase';

// Start up the firebase instance
const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};
export const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();
if (location.hostname === 'localhost') {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });

  if (((window as unknown) as { Cypress: any }).Cypress) {
    // NOTE: do NOT put this in production.
    firebase.firestore().settings({ experimentalForceLongPolling: true });
  }
}
