import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBossComponent } from './list-boss.component';

describe('ListBossComponent', () => {
  let component: ListBossComponent;
  let fixture: ComponentFixture<ListBossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
