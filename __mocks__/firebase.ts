import { firestore as f } from 'firebase';
import { mockFirebase } from 'ts-mock-firebase';

const firebase = mockFirebase();

const firestore = { Timestamp: f.Timestamp };
export { firestore };

export default firebase;
