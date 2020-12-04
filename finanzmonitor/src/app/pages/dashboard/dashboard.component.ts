import { Component } from '@angular/core';
import { Database } from 'src/database/database';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  data;
  saleData;

  yearlyOverviewData;
  yearlyOverviewLabels;
  monthlyBalance: number;
  allTimeBalance: number;

  ngOnInit() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    this.data = this.getDataByMonth(year, month);
    this.createMonthlyCatOverview(this.data, year, month);
    this.setDashboardCardColors(this.data, year, month);
  }

  monthlyOverviewDataset = [];
  monthlyOverviewData;
  monthlyOverviewLabels;
  barChartType = "bar";

  constructor(private db: Database) { }

  getDataByMonth(year, month) {
    return this.db.getUserData(year, month);
  }

  valueFormatter(value){    
    return value.toLocaleString() + '€';
  }

  setDashboardCardColors(data, year, month){
    this.monthlyBalance = data.years[year].months[month].incomeTotal - data.years[year].months[month].expenseTotal - data.years[year].months[month].savingsTotal;
    this.allTimeBalance = data.incomeTotal - data.expenseTotal - data.savingsTotal;
    if(this.monthlyBalance < 0){
      document.getElementById("monthly-balance").style.backgroundColor = "lightred";
    } else {
      document.getElementById("monthly-balance").style.backgroundColor = "lightgreen";
    }
    if(this.allTimeBalance < 0){
      document.getElementById("all-time-balance").style.backgroundColor = "lightred";
    } else {
      document.getElementById("all-time-balance").style.backgroundColor = "lightgreen";
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
    this.saleData = Object.assign([], tmp);
  }


  setNegativeColor(data) {
    let colors = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] < 0) {
        colors.push('red');
      } else {
        colors.push('green');
      }
    }
    return colors;
  }

}
