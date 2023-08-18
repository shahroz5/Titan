import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemUiStoneDetailsModule } from './shared-item-ui-stone-details.module';

describe('SharedItemUiStoneDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemUiStoneDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemUiStoneDetailsModule).toBeDefined();
  });
});
