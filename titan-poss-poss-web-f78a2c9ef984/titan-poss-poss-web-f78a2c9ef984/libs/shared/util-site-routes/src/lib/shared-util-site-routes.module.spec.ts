import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilSiteRoutesModule } from './shared-util-site-routes.module';

describe('SharedUtilSiteRoutesModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedUtilSiteRoutesModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedUtilSiteRoutesModule).toBeDefined();
  });
});
