import { firestore, database, analytics } from 'firebase';
import { AppComponent } from 'src/app/app.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { log } from 'util';

export class Database {
    db = firestore();
    user;
    data;

    async loadUserData(user) {
        this.user = user;
        this.data = await this.getUserdata(user.uid);
    }

    private async getUserdata(uid) {
        let userdata;
        let diese = this; //DON`T YOU DARE TO ASK QUESTIONS!     
        await this.db.collection("User").where("author", "==", uid).limit(1).get().then(function (querySnapshot) {
            if (querySnapshot.size === 0) {
                userdata = diese.createExampleData(uid);
            } else {
                querySnapshot.forEach(function (doc) {
                    userdata = { id: doc.id, data: doc.data() };
                });
            }
        }).catch(function (error) {
            console.log("Error getting documents: ", error);
        });
        return userdata;
    }

    getUserData(year, month) {
        let data = {
            id: this.data.id,
            incomeTotal: this.data.data.incomeTotal,
            expenseTotal: this.data.data.expenseTotal,
            savingsTotal: this.data.data.savingsTotal,
            cashSavingsTotal: this.data.data.cashSavingsTotal,
            cashSavingsGoal: this.data.data.cashSavingsGoal,
            runningMonthlyExpenses: this.data.data.runningMonthlyExpenses,
            categories: this.data.data.categories,
            years: {}
        };
        data.years[year] = {
            months: {
            },
            expenseTotal: this.data.data.years[year].expenseTotal,
            incomeTotal: this.data.data.years[year].incomeTotal,
            savingsTotal: this.data.data.years[year].savingsTotal,
            cashSavingsTotal: this.data.data.years[year].cashSavingsTotal
        };
        data.years[year].months[month] = {
            expenses: this.data.data.years[year].months[month].expenses,
            incomes: this.data.data.years[year].months[month].incomes,
            savings: this.data.data.years[year].months[month].savings,
            cashSavings: this.data.data.years[year].months[month].cashSavings,
            expenseTotal: this.data.data.years[year].months[month].expenseTotal,
            incomeTotal: this.data.data.years[year].months[month].incomeTotal,
            savingsTotal: this.data.data.years[year].months[month].savingsTotal,
            cashSavingsTotal: this.data.data.years[year].months[month].cashSavingsTotal,
        };
        return data;
    }

    async getAuthenticatedData() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        this.checkDatesAvailable(year, month);;
        let monthlyBalance = Number(this.data.data.years[year].months[month].incomeTotal) - (Number(this.data.data.years[year].months[month].expenseTotal) + Number(this.data.data.years[year].months[month].savingsTotal));
        return {
            user: this.user,
            monthlyBalance: monthlyBalance,
            categories: this.data.data.categories
        };
    }

    checkDatesAvailable(year, month) {
        if (!this.data.data.years.hasOwnProperty(year)) {
            this.data.data.years[year] = {
                months: {
                },
                expenseTotal: 0,
                incomeTotal: 0,
                savingsTotal: 0,
                cashSavingsTotal: 0,
            };
        }
        if (!this.data.data.years[year].months.hasOwnProperty(month)) {
            this.data.data.years[year].months[month] = {
                expenses: [],
                incomes: [],
                savings: [],
                cashSavings: [],
                expenseTotal: 0,
                incomeTotal: 0,
                savingsTotal: 0,
                cashSavingsTotal: 0,
            };
            for (let item of this.data.data.runningMonthlyExpenses) {
                if (item.type === "income") {
                    this.data.data.years[year].months[month].incomes.push(item);
                    this.data.data.years[year].incomeTotal += item.amount;
                    this.data.data.years[year].months[month].incomeTotal += item.amount;
                    this.data.data.incomeTotal += item.amount;
                } else if (item.type === "expense") {
                    this.data.data.years[year].months[month].expenses.push(item);
                    this.data.data.years[year].expenseTotal += item.amount;
                    this.data.data.years[year].months[month].expenseTotal += item.amount;
                    this.data.data.expenseTotal += item.amount;
                } else if (item.type === "saving") {
                    this.data.data.years[year].months[month].savings.push(item);
                    this.data.data.years[year].savingsTotal += item.amount;
                    this.data.data.years[year].months[month].savingsTotal += item.amount;
                    this.data.data.savingsTotal += item.amount;
                } else if (item.type === "cashSaving") {
                    this.data.data.years[year].months[month].cashSavings.push(item);
                    this.data.data.years[year].cashSavingsTotal += item.amount;
                    this.data.data.years[year].months[month].cashSavingsTotal += item.amount;
                    this.data.data.cashSavingsTotal += item.amount;
                }
            }
        }
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
            savingsTotal: 0,
            cashSavingsTotal: 0,
            cashSavingsGoal: 0,
            runningMonthlyExpenses: [], //Actually Monthly Cashflows
            categories: ["none"],
        }
        doc.years[year] = {
            months: {
            },
            expenseTotal: 0,
            incomeTotal: 0,
            savingsTotal: 0,
            cashSavingsTotal: 0,
        };
        doc.years[year].months[month] = {
            expenses: [],
            incomes: [],
            savings: [],
            cashSavings: [],
            expenseTotal: 0,
            incomeTotal: 0,
            savingsTotal: 0,
            cashSavingsTotal: 0,
        };


        this.db.collection("User").add(doc).catch(function (error) {
            console.error("Error adding document: ", error);
        });

        return this.getUserdata(uid);
    }

    public changeCashSavingGoal(goal) {
        let docRef = this.db.collection("User").doc(this.data.id);
        docRef.update({ cashSavingsGoal: goal });
    }

    public addCashFlow(docId, data) {
        let docRef = this.db.collection("User").doc(docId);
        let update = this.writeAddCashFlowDocument(data);
        if (update !== null)
            docRef.update(update);
        else
            alert("Could not write to Database (Error: NaN)");
    }

    public deleteCashFlow(docId, data) {
        let docRef = this.db.collection("User").doc(docId);
        let update = this.deleteCashFlowDocument(data);
        docRef.update(update); 
    }

    private writeAddCashFlowDocument(data) {
        let destroy = false;
        let update = {};
        if (data.hasOwnProperty('incomeTotal')) {
            update["incomeTotal"] = data.incomeTotal;
            if (data.incomeTotal === NaN)
                destroy = true;
        }
        if (data.hasOwnProperty('expenseTotal')) {
            update["expenseTotal"] = data.expenseTotal;
            if (data.expenseTotal === NaN)
                destroy = true;
        }
        if (data.hasOwnProperty('savingsTotal')) {
            update["savingsTotal"] = data.savingsTotal;
            if (data.incomeTotal === NaN)
                destroy = true;
        }
        if (data.hasOwnProperty('cashSavingsTotal')) {
            update["cashSavingsTotal"] = data.cashSavingsTotal;
            if (data.cashSavingsTotal === NaN)
                destroy = true;
        }
        if (data.hasOwnProperty('runningMonthlyExpenses')) {
            update["runningMonthlyExpenses"] = firestore.FieldValue.arrayUnion(...data.runningMonthlyExpenses);
        }
        if (data.hasOwnProperty('categories')) {
            update["categories"] = firestore.FieldValue.arrayUnion(...data.categories);
        }
        for (let key of Object.keys(data.years)) {
            let year = key;
            let item = data.years[key];
            if (item.hasOwnProperty('incomeTotal')) {
                update["years." + year + ".incomeTotal"] = item.incomeTotal;
            }
            if (item.hasOwnProperty('expenseTotal')) {
                update["years." + year + ".expenseTotal"] = item.expenseTotal;
            }
            if (item.hasOwnProperty('savingsTotal')) {
                update["years." + year + ".savingsTotal"] = item.savingsTotal;
            }
            if (item.hasOwnProperty('cashSavingsTotal')) {
                update["years." + year + ".savingsTotal"] = item.cashSavingsTotal;
            }
            for (let [k, v] of Object.entries(item.months)) {
                let month = k;
                let x: any = v as any;
                if (x.hasOwnProperty('incomeTotal')) {
                    update["years." + year + ".months." + month + ".incomeTotal"] = x.incomeTotal;
                }
                if (x.hasOwnProperty('expenseTotal')) {
                    update["years." + year + ".months." + month + ".expenseTotal"] = x.expenseTotal;
                }
                if (x.hasOwnProperty('savingsTotal')) {
                    update["years." + year + ".months." + month + ".savingsTotal"] = x.savingsTotal;
                }
                if (x.hasOwnProperty('cashSavingsTotal')) {
                    update["years." + year + ".months." + month + ".cashSavingsTotal"] = x.cashSavingsTotal;
                }
                if (x.hasOwnProperty('expenses')) {
                    update["years." + year + ".months." + month + ".expenses"] = firestore.FieldValue.arrayUnion(...x.expenses); // Array wird in einzelne elemente aufgespalten und übertragen. Array union akzeptiert keine arrays
                }
                if (x.hasOwnProperty('incomes')) {
                    update["years." + year + ".months." + month + ".incomes"] = firestore.FieldValue.arrayUnion(...x.incomes);
                }
                if (x.hasOwnProperty('savings')) {
                    update["years." + year + ".months." + month + ".savings"] = firestore.FieldValue.arrayUnion(...x.savings);
                }
                if (x.hasOwnProperty('cashSavings')) {
                    update["years." + year + ".months." + month + ".cashSavings"] = firestore.FieldValue.arrayUnion(...x.cashSavings);
                }
            };
        };
        if (destroy)
            return null;
        else
            return update;
    }

    private deleteCashFlowDocument(data) {
        let update = {};
        if (data.hasOwnProperty('incomeTotal')) {
            update["incomeTotal"] = data.incomeTotal;
        }
        if (data.hasOwnProperty('expenseTotal')) {
            update["expenseTotal"] = data.expenseTotal;
        }
        if (data.hasOwnProperty('savingsTotal')) {
            update["savingsTotal"] = data.savingsTotal;
        }
        if (data.hasOwnProperty('cashSavingsTotal')) {
            update["cashSavingsTotal"] = data.cashSavingsTotal;
        }
        if (data.hasOwnProperty('runningMonthlyExpenses')) {
            update["runningMonthlyExpenses"] = firestore.FieldValue.arrayUnion(...data.runningMonthlyExpenses);
        }
        if (data.hasOwnProperty('categories')) {
            update["categories"] = firestore.FieldValue.arrayUnion(...data.categories);
        }
        for (let key of Object.keys(data.years)) {
            let year = key;
            let item = data.years[key];
            if (item.hasOwnProperty('incomeTotal')) {
                update["years." + year + ".incomeTotal"] = item.incomeTotal;
            }
            if (item.hasOwnProperty('expenseTotal')) {
                update["years." + year + ".expenseTotal"] = item.expenseTotal;
            }
            if (item.hasOwnProperty('savingsTotal')) {
                update["years." + year + ".savingsTotal"] = item.savingsTotal;
            }
            for (let [k, v] of Object.entries(item.months)) {
                let month = k;
                let x: any = v as any;
                if (x.hasOwnProperty('incomeTotal')) {
                    update["years." + year + ".months." + month + ".incomeTotal"] = x.incomeTotal;
                }
                if (x.hasOwnProperty('expenseTotal')) {
                    update["years." + year + ".months." + month + ".expenseTotal"] = x.expenseTotal;
                }
                if (x.hasOwnProperty('savingsTotal')) {
                    update["years." + year + ".months." + month + ".savingsTotal"] = x.savingsTotal;
                }
                if (x.hasOwnProperty('cashSavingsTotal')) {
                    update["years." + year + ".months." + month + ".cashSavingsTotal"] = x.cashSavingsTotal;
                }
                if (x.hasOwnProperty('expenses')) {
                    update["years." + year + ".months." + month + ".expenses"] = firestore.FieldValue.arrayRemove(...x.expenses); // Array wird in einzelne elemente aufgespalten und übertragen. ArrayRemove akzeptiert keine arrays
                }
                if (x.hasOwnProperty('incomes')) {
                    update["years." + year + ".months." + month + ".incomes"] = firestore.FieldValue.arrayRemove(...x.incomes);
                }
                if (x.hasOwnProperty('savings')) {
                    update["years." + year + ".months." + month + ".savings"] = firestore.FieldValue.arrayRemove(...x.savings);
                }
                if (x.hasOwnProperty('cashSavings')) {
                    update["years." + year + ".months." + month + ".cashSavings"] = firestore.FieldValue.arrayRemove(...x.cashSavings);
                }
            };
        };
        return update;
    }

}