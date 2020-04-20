import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-jouets',
  templateUrl: './jouets.component.html',
  styleUrls: ['./jouets.component.css']
})
export class JouetsComponent implements OnInit {

  constructor(@Inject(SESSION_STORAGE) private session: WebStorageService, private routerService:Router) { }

  ngOnInit(): void {
    if(!this.session.get("TKA"))
    {
      this.routerService.navigateByUrl("/")
    }
  }

}
