import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInfosComponent } from './mes-infos.component';

describe('MesInfosComponent', () => {
  let component: MesInfosComponent;
  let fixture: ComponentFixture<MesInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
