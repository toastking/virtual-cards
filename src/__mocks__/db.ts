import * as firebase from '@firebase/testing';

/** Test app instance */
export const app = firebase.initializeTestApp({
  projectId: 'remote-cards',
});

/** Test firestore instance */
export const db = app.firestore();
export const functions = app.functions();

// Mock out the shared values to the firebase sdk doesn't compain if we import from the non-test firebase module
export const fieldValues = firebase.firestore.FieldValue;
export const timestamp = firebase.firestore.Timestamp;
