import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavStrategieComponent } from './fav-strategie.component';

describe('FavStrategieComponent', () => {
  let component: FavStrategieComponent;
  let fixture: ComponentFixture<FavStrategieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavStrategieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavStrategieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
