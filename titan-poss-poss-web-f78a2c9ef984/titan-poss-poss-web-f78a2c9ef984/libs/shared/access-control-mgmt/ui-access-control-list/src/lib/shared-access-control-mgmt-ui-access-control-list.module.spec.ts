import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedAccessControlMgmtUiAccessControlListModule } from './shared-access-control-mgmt-ui-access-control-list.module';

describe('SharedAccessControlMgmtUiAccessControlListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedAccessControlMgmtUiAccessControlListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedAccessControlMgmtUiAccessControlListModule).toBeDefined();
  });
});
