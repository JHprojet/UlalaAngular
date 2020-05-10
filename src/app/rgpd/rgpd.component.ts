import { Component, OnInit } from '@angular/core';
import { AccessComponent } from '../helpeur/access-component';

@Component({
  selector: 'app-rgpd',
  templateUrl: './rgpd.component.html',
  styleUrls: ['./rgpd.component.css']
})
export class RgpdComponent implements OnInit {

  constructor(private accessService:AccessComponent) { }

  ngOnInit(): void {
    this.accessService.getAnonymeKey();
  }
}
