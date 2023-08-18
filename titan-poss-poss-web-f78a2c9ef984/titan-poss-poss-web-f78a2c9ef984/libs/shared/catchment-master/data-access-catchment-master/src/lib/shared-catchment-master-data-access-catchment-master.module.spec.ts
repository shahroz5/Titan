import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCatchmentMasterDataAccessCatchmentMasterModule } from './shared-catchment-master-data-access-catchment-master.module';

describe('SharedCatchmentMasterDataAccessCatchmentMasterModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedCatchmentMasterDataAccessCatchmentMasterModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedCatchmentMasterDataAccessCatchmentMasterModule).toBeDefined();
  });
});
