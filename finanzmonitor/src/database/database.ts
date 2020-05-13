import { firestore, database, analytics } from 'firebase';
import { AppComponent } from 'src/app/app.component';

export class Database {
    db = firestore();

    async getUserdata(uid) {  
        let userdata;
        let diese = this; //DON`T YOU DARE TO ASK QUESTIONS!     
        await this.db.collection("User").where("author", "==", uid).limit(1).get().then(function(querySnapshot){
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
        docRef.update(this.writeAddCashFlowDocument(data));       
    }

    private writeAddCashFlowDocument(data){
        let update = {};
        if(data.hasOwnProperty('incomeTotal')){
            update["incomeTotal"] = data.incomeTotal;
        }
        if(data.hasOwnProperty('expenseTotal')){
            update["expenseTotal"] = data.expenseTotal;
        }
        if(data.hasOwnProperty('runningMonthlyExpenses')){
            update["runningMonthlyExpenses"] = firestore.FieldValue.arrayUnion(data.runningMonthlyExpenses);
        }
        if(data.hasOwnProperty('categories')){
            update["categories"] = firestore.FieldValue.arrayUnion(...data.categories);
        }
        for (let key of Object.keys(data.years)){
            let year = key;
            let item = data.years[key];
            if(item.hasOwnProperty('incomeTotal')){
                update["years."+year+".incomeTotal"] = item.incomeTotal;
            }
            if(item.hasOwnProperty('expenseTotal')){
                update["years."+year+".expenseTotal"] = item.expenseTotal;
            }
            for (let [k, v] of Object.entries(item.months)){
                let month = k;
                let x: any = v as any;
                if(x.hasOwnProperty('incomeTotal')){
                    update["years."+year+"."+month+".incomeTotal"] = x.incomeTotal;
                }
                if(x.hasOwnProperty('expenseTotal')){
                    update["years."+year+"."+month+".expenseTotal"] = x.expenseTotal;
                }
                if(x.hasOwnProperty('expenses')){
                    update["years."+year+"."+month+".expenses"] = firestore.FieldValue.arrayUnion(...x.expenses); // Array wird in einzelne elemente aufgespaltet und übertragen. Array union akzeptiert keine arrays
                }
                if(x.hasOwnProperty('incomes')){
                    update["years."+year+"."+month+".incomes"] = firestore.FieldValue.arrayUnion(...x.incomes);
                }
            };
        };
        return update;
    }

}