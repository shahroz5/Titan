import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemUiItemSearchModule } from './shared-item-ui-item-search.module';

describe('SharedItemUiItemSearchModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemUiItemSearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemUiItemSearchModule).toBeDefined();
  });
});
