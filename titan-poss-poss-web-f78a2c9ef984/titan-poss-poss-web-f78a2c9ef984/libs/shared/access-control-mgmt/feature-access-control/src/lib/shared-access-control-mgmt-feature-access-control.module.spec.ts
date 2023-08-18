import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedAccessControlMgmtFeatureAccessControlModule } from './shared-access-control-mgmt-feature-access-control.module';

describe('SharedAccessControlMgmtFeatureAccessControlModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedAccessControlMgmtFeatureAccessControlModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedAccessControlMgmtFeatureAccessControlModule).toBeDefined();
  });
});
