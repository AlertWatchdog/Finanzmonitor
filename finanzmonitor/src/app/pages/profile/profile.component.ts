import { Component, OnInit } from '@angular/core';
import { AuthenticatedComponent } from 'src/app/authenticated/authenticated.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private authComponent: AuthenticatedComponent) { }

  ngOnInit() {
  }

  user = this.authComponent.user;
}
