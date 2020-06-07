import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStrategieComponent } from './search-strategie.component';

describe('SearchStrategieComponent', () => {
  let component: SearchStrategieComponent;
  let fixture: ComponentFixture<SearchStrategieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchStrategieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchStrategieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
