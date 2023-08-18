import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilApiServiceModule } from './shared-util-api-service.module';

describe('SharedUtilApiServiceModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUtilApiServiceModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUtilApiServiceModule).toBeDefined();
  });
});
