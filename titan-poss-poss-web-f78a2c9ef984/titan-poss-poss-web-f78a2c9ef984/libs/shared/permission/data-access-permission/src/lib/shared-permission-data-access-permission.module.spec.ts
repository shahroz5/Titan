import { TestBed, waitForAsync } from '@angular/core/testing';
import { SharedPermissionDataAccessPermissionModule } from './shared-permission-data-access-permission.module';

describe('SharedPermissionDataAccessPermissionModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedPermissionDataAccessPermissionModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedPermissionDataAccessPermissionModule).toBeDefined();
  });
});
