import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilCacheableApiServiceModule } from './shared-util-cacheable-api-service.module';

describe('SharedUtilCacheableApiServiceModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedUtilCacheableApiServiceModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedUtilCacheableApiServiceModule).toBeDefined();
  });
});
