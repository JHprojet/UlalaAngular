import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStrategieComponent } from './add-strategie.component';

describe('AddStrategieComponent', () => {
  let component: AddStrategieComponent;
  let fixture: ComponentFixture<AddStrategieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStrategieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStrategieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
