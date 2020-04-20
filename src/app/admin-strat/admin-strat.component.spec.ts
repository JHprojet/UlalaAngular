import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdminStratComponent } from './admin-strat.component';

describe('AdminStratComponent', () => {
  let component: AdminStratComponent;
  let fixture: ComponentFixture<AdminStratComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminStratComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
