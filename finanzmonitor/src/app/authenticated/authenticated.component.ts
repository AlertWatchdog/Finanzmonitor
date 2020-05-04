import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
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
  user;
  data;

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

  loadUserData(){
    this.user = this.appComponent.getCurrentUser();
    this.data = this.database.getUserdata(this.user.uid);
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

  amountZero(control: FormControl){
    let value = control.value.replace(',', '.');
  
    if(parseFloat(value) !== 0){   
      return null;
    } else {
      return {description: "value zero"};
    }
  }

  saveNewExpense(){

  }
}