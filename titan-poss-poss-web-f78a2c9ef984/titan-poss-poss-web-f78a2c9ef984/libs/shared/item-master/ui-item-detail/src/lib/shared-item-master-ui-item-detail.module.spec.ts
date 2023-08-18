import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemMasterUiItemDetailModule } from './shared-item-master-ui-item-detail.module';

describe('SharedItemMasterUiItemDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemMasterUiItemDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemMasterUiItemDetailModule).toBeDefined();
  });
});
