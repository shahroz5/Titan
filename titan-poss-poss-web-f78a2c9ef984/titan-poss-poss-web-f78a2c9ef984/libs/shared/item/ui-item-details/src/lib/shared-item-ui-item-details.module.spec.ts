import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemUiItemDetailsModule } from './shared-item-ui-item-details.module';

describe('SharedItemUiItemDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemUiItemDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemUiItemDetailsModule).toBeDefined();
  });
});
