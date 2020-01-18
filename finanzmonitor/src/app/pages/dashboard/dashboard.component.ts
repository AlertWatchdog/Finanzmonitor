import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data = [45, -37, 60, -70, 46, 33];
  constructor() { }

  ngOnInit(){
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

  barChartData: ChartDataSets[] = [
    { data: this.data, backgroundColor: this.setNegativeColor(this.data),  }
  ];
}
