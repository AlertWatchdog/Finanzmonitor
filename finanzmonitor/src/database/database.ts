import { firestore, database } from 'firebase';
import { AppComponent } from 'src/app/app.component';

export class Database {
    db = firestore();

    getUserdata(uid) {  
        let userdata;
        let diese = this; //DON`T YOU DARE TO ASK QUESTIONS!     
        this.db.collection("User").where("author", "==", uid).limit(1).get().then(function(querySnapshot){
            if(querySnapshot.size === 0){                
                userdata = diese.createExampleData(uid);
            }else{            
            querySnapshot.forEach(function(doc){
                userdata = {id: doc.id, data: doc.data()};
            });
        }
        }).catch(function(error) {
            console.log("Error getting documents: ", error);
        });        
        return userdata;
    }

    public createExampleData(uid) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth(); //Starts at 0 -> (January === 0)
        let doc = {
            author: uid,
            years: {},
            expenseTotal: 0,
            incomeTotal: 0,
            runningMonthlyExpenses: [],
            categories: [],
        }
        doc.years[year] = {
            months: {
            },
            expenseTotal: 0,
            incomeTotal: 0
        };
        doc.years[year].months[month] = {expenses: [],
        incomes: [],
        expenseTotal: 0,
        incomeTotal: 0, };
    
        
        this.db.collection("User").add(doc).catch(function(error) {
        console.error("Error adding document: ", error);
        });

        return this.getUserdata(uid);
    }

    public addCashFlow(docId, data){
        let docRef = this.db.collection("User").doc(docId);

    }

    private writeAddCashFlowDocument(data){

    }

}