import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {AppComponent} from 'src/app/app.component';
import { ErrorStateMatcher } from '@angular/material';
import { Database } from '../../database/database';

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

  constructor(private breakpointObserver: BreakpointObserver, private appComponent: AppComponent, private database: Database) {    
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData(){  
    this.user = this.appComponent.getCurrentUser();
    await this.database.loadUserData(this.user.id);
    let tmp = await this.database.getAuthenticatedData();
    this.monthlyBalance = tmp.monthlyBalance;
    this.categories = tmp.categories;
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
      entryDate: date.toUTCString()
    }

    if(this.monthlyFormControl.value){
      if(!update.hasOwnProperty("runningMonthlyExpenses")){
        update["runningMonthlyExpenses"] = [];
      }
      update["runningMonthlyExpenses"].push(cashFlow);      
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
    } else {
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
    }
    this.database.addCashFlow(data.id, update);
    this.closeModal();
    this.loadUserData();
  }
}