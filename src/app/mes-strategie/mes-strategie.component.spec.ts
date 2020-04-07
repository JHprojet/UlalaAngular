import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesStrategieComponent } from './mes-strategie.component';

describe('MesStrategieComponent', () => {
  let component: MesStrategieComponent;
  let fixture: ComponentFixture<MesStrategieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesStrategieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesStrategieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
