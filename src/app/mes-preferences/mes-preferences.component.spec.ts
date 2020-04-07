import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesPreferencesComponent } from './mes-preferences.component';

describe('MesPreferencesComponent', () => {
  let component: MesPreferencesComponent;
  let fixture: ComponentFixture<MesPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
