import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemMasterDataAccessItemMasterModule } from './shared-item-master-data-access-item-master.module';

describe('SharedItemMasterDataAccessItemMasterModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemMasterDataAccessItemMasterModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemMasterDataAccessItemMasterModule).toBeDefined();
  });
});
