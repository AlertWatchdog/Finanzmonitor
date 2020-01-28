import { firestore } from 'firebase';

export class database {
    db = firestore();

    getUsers() {
        this.db.collection("User").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
            });
        });
    }

}