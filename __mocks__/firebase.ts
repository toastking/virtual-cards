import { mockFirebase } from 'ts-mock-firebase';
import { firestore as f } from 'firebase';

const firebase = mockFirebase();

const firestore = { Timestamp: f.Timestamp };
export { firestore };

export default firebase;
