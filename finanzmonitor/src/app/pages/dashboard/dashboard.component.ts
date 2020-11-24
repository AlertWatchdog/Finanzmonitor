import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { Database } from 'src/database/database';
import { database } from 'firebase';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  
  yearlyOverviewData;
  yearlyOverviewLabels;

  monthlyOverviewDataset = [-10, 20];
  monthlyOverviewData = [ {data: this.monthlyOverviewDataset, backgroundColor: ['blue'] } ];
  monthlyOverviewLabels: Label[] = ['0', '1'];

  constructor(private db: Database) { }

  ngOnInit(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    //this.createMonthlyCatOverview( this.getDataByMonth(year, month), year, month);
  }

  getDataByMonth(year, month){
    return this.db.getUserData(year, month);
  }

  createMonthlyCatOverview(data, year, month){
    console.log(data);
    this.monthlyOverviewLabels = data.categories;
    for(let i = 0; i < this.monthlyOverviewLabels.length; i++){
      this.monthlyOverviewDataset[i] = 0;
    }
    let expenses = data.years[year].months[month].expenses;
    for(let x of expenses){
      this.monthlyOverviewDataset[this.monthlyOverviewLabels.indexOf(x.category)] += Number(x.amount);
    } 
    this.monthlyOverviewData = null;
    this.monthlyOverviewData = [ {data: this.monthlyOverviewDataset, backgroundColor: ['blue'] } ];
  }

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];
  

  setNegativeColor(data){
    let colors = [];
    for(let i = 0; i < data.length; i++){
      if(data[i] < 0){
        colors.push('red');
      } else {
        colors.push('green');
      }
    }
    return colors;
  }

}
