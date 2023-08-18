import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TepExceptionListItemsComponent } from './tep-exception-list-items.component';

describe('TepExceptionListItemsComponent', () => {
  let component: TepExceptionListItemsComponent;
  let fixture: ComponentFixture<TepExceptionListItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TepExceptionListItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TepExceptionListItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
