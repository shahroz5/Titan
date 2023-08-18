import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedLocationMasterDataAccessLocationMasterModule } from './shared-location-master-data-access-location-master.module';

describe('SharedLocationMasterDataAccessLocationMasterModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedLocationMasterDataAccessLocationMasterModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedLocationMasterDataAccessLocationMasterModule).toBeDefined();
  });
});
