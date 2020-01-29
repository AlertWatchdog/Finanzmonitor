import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
    categoryControl = new FormControl();

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
  }

  openModal(){
    document.getElementById("navcont").style.zIndex = "-2";
    document.getElementById("modal").style.display = "inline-block";
  }

  closeModal(){
    document.getElementById("navcont").style.zIndex = "1";
    document.getElementById("modal").style.display = "none";
  }
}
