import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { map, shareReplay } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import {AppComponent} from 'src/app/app.component';
import { ErrorStateMatcher } from '@angular/material';
import { Database } from '../../database/database';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {
  selectedCategory = 'none';
  
  monthlyBalance;
  categories;
  user;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
    categoryControl = new FormControl();

  constructor(private breakpointObserver: BreakpointObserver, private appComponent: AppComponent, private database: Database, private dashboard: DashboardComponent) {    
  }
  dataReady: boolean = false;
  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user;
        this.loadUserData();
      }
    });
  }

  async loadUserData(){
    await this.database.loadUserData(this.user);
    let tmp = await this.database.getAuthenticatedData();
    this.monthlyBalance = tmp.monthlyBalance;
    this.categories = tmp.categories;
    this.dataReady = true; //ensures Data is ready, before loading dashboard
  }

  openModal(){
    document.getElementById("navcont").style.zIndex = "-2";
    document.getElementById("modal").style.display = "inline-block";
  }

  closeModal(){
    document.getElementById("navcont").style.zIndex = "1";
    document.getElementById("modal").style.display = "none";
  }

  matcher = new ErrorStateMatcher();
  
  typeFormControl = new FormControl('', [
    Validators.required,
  ]);
  categoryFormControl = new FormControl('', [
    Validators.required,
  ]);
  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  newCatFormControl = new FormControl('', [
    Validators.required, //Vervollständigen
  ]);
  amountFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern("[0-9]*([\.\,][0-9]{1,2})?"),
    this.amountZero
  ]);
  monthlyFormControl = new FormControl('', [
    Validators.required,
  ]);
  cashSavingControl = new FormControl('', [
    Validators.required,
  ]);

  amountZero(control: FormControl){
    let value = control.value.replace(',', '.');
  
    if(parseFloat(value) !== 0){   
      return null;
    } else {
      return {description: "value zero"};
    }
  }

  async saveNewCashflows(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let category;
    let update = {years:{}};
    let data = await this.database.getUserData(year, month);
    
    if(this.categoryControl.value == "new"){
      category = this.newCatFormControl.value;
      update["categories"] = [category];
    } else {
      category = this.categoryControl.value;
    }

    let cashFlow = {
      amount: <number> this.amountFormControl.value,
      category: category,
      description: this.nameFormControl.value,
      entryDate: date.toUTCString(),
      type: this.typeFormControl.value
    }

    let amount = Number(cashFlow.amount);

    if(this.typeFormControl.value === "income"){
      update["incomeTotal"] = Number(data.incomeTotal) + amount
      update.years[year] = {
        months: {
        },
        incomeTotal: Number(data.years[year].incomeTotal) + amount
      };
      update.years[year].months[month] = {
        incomes: [cashFlow],
        incomeTotal: Number(data.years[year].months[month].incomeTotal) + amount
      };
    } else if(this.typeFormControl.value === "expense"){
      update["expenseTotal"] = Number(data.expenseTotal) + amount
      update.years[year] = {
        months: {
        },
        expenseTotal: Number(data.years[year].expenseTotal) + amount
      };
      update.years[year].months[month] = {
        expenses: [cashFlow],
        expenseTotal: Number(data.years[year].months[month].expenseTotal) + amount
      };
    } else if (!this.cashSavingControl.value){
      update["savingsTotal"] = Number(data.savingsTotal) + amount
      update.years[year] = {
        months: {
        },
        savingsTotal: Number(data.years[year].savingsTotal) + amount
      };
      update.years[year].months[month] = {
        savings: [cashFlow],
        savingsTotal: Number(data.years[year].months[month].savingsTotal) + amount
      };
    } else {
      cashFlow.type = "cashSaving";
      update["cashSavingsTotal"] = Number(data.cashSavingsTotal) + amount
      update.years[year] = {
        months: {
        },
        cashSavingsTotal: Number(data.years[year].cashSavingsTotal) + amount
      };
      update.years[year].months[month] = {
        cashSavings: [cashFlow],
        cashSavingsTotal: Number(data.years[year].months[month].cashSavingsTotal) + amount
      };
    }

    if(this.monthlyFormControl.value){
      if(!update.hasOwnProperty("runningMonthlyExpenses")){
        update["runningMonthlyExpenses"] = [];
      }
      update["runningMonthlyExpenses"].push(cashFlow);      
    }

    this.database.addCashFlow(data.id, update);
    this.closeModal();
    this.dataReady = false;
    this.loadUserData();
  }
}