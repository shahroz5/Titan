import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemMasterUiItemListModule } from './shared-item-master-ui-item-list.module';

describe('SharedItemMasterUiItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemMasterUiItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemMasterUiItemListModule).toBeDefined();
  });
});
