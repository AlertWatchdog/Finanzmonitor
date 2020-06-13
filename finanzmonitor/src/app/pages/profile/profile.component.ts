import { Component, OnInit } from '@angular/core';
import { AuthenticatedComponent } from 'src/app/authenticated/authenticated.component';
import { Database } from 'src/database/database';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private db: Database) { }

  ngOnInit() {
  }

  user = this.db.user;
}
