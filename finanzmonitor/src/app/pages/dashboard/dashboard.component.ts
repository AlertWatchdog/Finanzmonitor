import { Component } from '@angular/core';
import { Database } from 'src/database/database';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  saleData;

  yearlyOverviewData;
  yearlyOverviewLabels;

  ngOnInit() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    this.createMonthlyCatOverview(this.getDataByMonth(year, month), year, month);
  }

  monthlyOverviewDataset = [];
  monthlyOverviewData;
  monthlyOverviewLabels;
  barChartType = "bar";

  constructor(private db: Database) { }

  getDataByMonth(year, month) {
    return this.db.getUserData(year, month);
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
