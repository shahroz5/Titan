import { TestBed, waitForAsync } from '@angular/core/testing';
import { SharedPermissionUiPermissionModule } from './shared-permission-ui-permission.module';

describe('SharedPermissionUiPermissionModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedPermissionUiPermissionModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedPermissionUiPermissionModule).toBeDefined();
  });
});
