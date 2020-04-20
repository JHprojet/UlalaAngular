import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(@Inject(SESSION_STORAGE) private session: WebStorageService,private routerService:Router) { }

  ngOnInit(): void {
    if(!this.session.get("TKA"))
    {
      this.routerService.navigateByUrl("/")
    }
  }

}
