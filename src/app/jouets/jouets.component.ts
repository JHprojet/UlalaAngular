import { Component, OnInit, Inject } from '@angular/core';
import { AccessComponent } from '../helpeur/access-component';

@Component({
  selector: 'app-jouets',
  templateUrl: './jouets.component.html',
  styleUrls: ['./jouets.component.css']
})
export class JouetsComponent implements OnInit {

  constructor(private accessService:AccessComponent) { }

  ngOnInit(): void {
    this.accessService.getAnonymeKey();
  }

}
