import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedAppsettingDataAccessAppsettingModule } from './shared-appsetting-data-access-appsetting.module';

describe('SharedAppsettingDataAccessAppsettingModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedAppsettingDataAccessAppsettingModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedAppsettingDataAccessAppsettingModule).toBeDefined();
  });
});
