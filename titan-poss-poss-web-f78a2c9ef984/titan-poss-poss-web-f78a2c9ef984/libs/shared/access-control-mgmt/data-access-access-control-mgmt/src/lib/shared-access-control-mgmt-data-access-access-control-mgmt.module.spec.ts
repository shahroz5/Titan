import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedAccessControlMgmtDataAccessAccessControlMgmtModule } from './shared-access-control-mgmt-data-access-access-control-mgmt.module';

describe('SharedAccessControlMgmtDataAccessAccessControlMgmtModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedAccessControlMgmtDataAccessAccessControlMgmtModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      SharedAccessControlMgmtDataAccessAccessControlMgmtModule
    ).toBeDefined();
  });
});
