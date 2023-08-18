import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCountryMasterUiCountryMasterListModule } from './shared-country-master-ui-country-master-list.module';

describe('SharedCountryMasterUiCountryMasterListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCountryMasterUiCountryMasterListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCountryMasterUiCountryMasterListModule).toBeDefined();
  });
});
