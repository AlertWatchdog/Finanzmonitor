import { Component } from '@angular/core';
import { Database } from 'src/database/database';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  data;
  view;
  expenseData;
  savingsData;

  yearlyOverviewData;
  yearlyOverviewLabels;
  monthlyBalance: number;
  allTimeBalance: number;
  savings: number;
  cashSavings: number;
  cashSavingGoal: number;

  ngOnInit() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    this.data = this.getDataByMonth(year, month);
    this.cashSavingGoal = this.data.cashSavingsGoal;
    this.createMonthlyCatOverview(this.data, year, month);
    this.setDashboardCardColors(this.data, year, month);
    this.view = [document.getElementById("card-expenses").offsetWidth, 300];
  }

  monthlyOverviewDataset = [];
  monthlyOverviewData;
  monthlyOverviewLabels;

  constructor(private db: Database) { }

  editSavingsGoal(){
    document.getElementById("cashSavingGoal").style.display = "none";
    document.getElementById("cashSavingGoalInput").style.display = "inline-block";
  }

  saveSavingsGoal(event){
    this.db.changeCashSavingGoal(Number (event.target.value));
    this.cashSavingGoal = Number (event.target.value);
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    this.setDashboardCardColors(this.data, year, month);
    document.getElementById("cashSavingGoal").style.display = "inline-block";
    document.getElementById("cashSavingGoalInput").style.display = "none";
  }

  getDataByMonth(year, month) {
    return this.db.getUserData(year, month);
  }

  valueFormatter(value){    
    return value.toLocaleString() + '€';
  }

  onResize(event) { this.view = [event.target.innerWidth, 300 ]; }

  setDashboardCardColors(data, year, month){
    this.monthlyBalance = data.years[year].months[month].incomeTotal - data.years[year].months[month].expenseTotal - data.years[year].months[month].savingsTotal - data.years[year].months[month].cashSavingsTotal;
    this.allTimeBalance = data.incomeTotal - data.expenseTotal - data.savingsTotal - data.cashSavingsTotal;
    this.savings = data.savingsTotal;
    this.cashSavings = data.cashSavingsTotal - this.cashSavingGoal;
    if(this.monthlyBalance < 0){
      document.getElementById("monthly-balance").style.backgroundColor = "red";
    } else {
      document.getElementById("monthly-balance").style.backgroundColor = "lightgreen";
    }
    if(this.allTimeBalance < 0){
      document.getElementById("all-time-balance").style.backgroundColor = "red";
    } else {
      document.getElementById("all-time-balance").style.backgroundColor = "lightgreen";
    }
    if(this.cashSavings < 0){
      document.getElementById("cash-savings").style.backgroundColor = "red";
    } else {
      document.getElementById("cash-savings").style.backgroundColor = "lightgreen";
    }
  }

  createMonthlyCatOverview(data, year, month) {
    this.monthlyOverviewLabels = data.categories;
    for (let i = 0; i < this.monthlyOverviewLabels.length; i++) {
      this.monthlyOverviewDataset.push(0);
    }
    let expenses = data.years[year].months[month].expenses;
    for (let x of expenses) {
      this.monthlyOverviewDataset[this.monthlyOverviewLabels.indexOf(x.category)] += Number(x.amount);
    }
    let tmp = [];
    for (let i = 0; i < this.monthlyOverviewDataset.length; i++) {
      if (this.monthlyOverviewDataset[i] > 0) {
        tmp.push({ name: this.monthlyOverviewLabels[i], value: this.monthlyOverviewDataset[i] })
      }
    }
    this.expenseData = Object.assign([], tmp);    

    this.monthlyOverviewDataset = [];
    for (let i = 0; i < this.monthlyOverviewLabels.length; i++) {
      this.monthlyOverviewDataset.push(0);
    }
    let savings = data.years[year].months[month].savings;
    let cashSavings = data.years[year].months[month].cashSavingsTotal;
    for (let x of savings) {
      this.monthlyOverviewDataset[this.monthlyOverviewLabels.indexOf(x.category)] += Number(x.amount);
    }
    tmp = [];
    for (let i = 0; i < this.monthlyOverviewDataset.length; i++) {
      if (this.monthlyOverviewDataset[i] > 0) {
        tmp.push({ name: this.monthlyOverviewLabels[i], value: this.monthlyOverviewDataset[i] })
      }
    }
    tmp.push({name: "Bar-Rücklagen", value: cashSavings});
    this.savingsData = Object.assign([], tmp);    
  }
}
