import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCommonDataAccessCommonModule } from './shared-common-data-access-common.module';

describe('SharedCommonDataAccessCommonModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCommonDataAccessCommonModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCommonDataAccessCommonModule).toBeDefined();
  });
});
