import { Component, OnInit } from '@angular/core';
import { AccessComponent } from '../helpeur/access-component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private accessService:AccessComponent) { }

  ngOnInit(): void {
    this.accessService.getAnonymeKey();
  }
  //Component à faire
}
