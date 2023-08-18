import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GiftCardsHistoryDetailsShellComponent } from './gift-cards-history-details-shell.component';

describe('GiftCardsHistoryDetailsShellComponent', () => {
  let component: GiftCardsHistoryDetailsShellComponent;
  let fixture: ComponentFixture<GiftCardsHistoryDetailsShellComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GiftCardsHistoryDetailsShellComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardsHistoryDetailsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
