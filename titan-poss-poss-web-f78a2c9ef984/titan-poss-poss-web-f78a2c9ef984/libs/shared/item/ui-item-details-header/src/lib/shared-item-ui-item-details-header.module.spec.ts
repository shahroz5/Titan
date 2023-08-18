import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemUiItemDetailsHeaderModule } from './shared-item-ui-item-details-header.module';

describe('SharedItemUiItemDetailsHeaderModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemUiItemDetailsHeaderModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemUiItemDetailsHeaderModule).toBeDefined();
  });
});
