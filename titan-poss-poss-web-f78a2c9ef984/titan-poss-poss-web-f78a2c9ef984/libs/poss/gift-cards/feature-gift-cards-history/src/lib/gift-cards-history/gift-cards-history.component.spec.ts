import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardsHistoryComponent } from './gift-cards-history.component';

describe('GiftCardsHistoryComponent', () => {
  let component: GiftCardsHistoryComponent;
  let fixture: ComponentFixture<GiftCardsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCardsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
