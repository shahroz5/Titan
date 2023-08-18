import { TestBed, waitForAsync } from '@angular/core/testing';
import { SharedPermissionUtilElementPermissionsModule } from './shared-permission-util-element-permissions.module';

describe('SharedPermissionUtilElementPermissionsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedPermissionUtilElementPermissionsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedPermissionUtilElementPermissionsModule).toBeDefined();
  });
});
