import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class ListviewComponent implements OnInit {
  columnsToDisplay = ['description', 'type', 'amount'];
  showList;
  expandedElement: cashFlow | null;
  private expenses;
  private incomes;
  private savings;
  private cashSavings;

  constructor() { }

  ngOnInit() {
  }

}

export interface cashFlow{
  amount: number;
  category: string;
  description: string;
  entryDate: Date;
  type: string;
}
