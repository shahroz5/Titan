import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCountryMasterDataAccessCountryMasterModule } from './shared-country-master-data-access-country-master.module';

describe('SharedCountryMasterDataAccessCountryMasterModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCountryMasterDataAccessCountryMasterModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCountryMasterDataAccessCountryMasterModule).toBeDefined();
  });
});
