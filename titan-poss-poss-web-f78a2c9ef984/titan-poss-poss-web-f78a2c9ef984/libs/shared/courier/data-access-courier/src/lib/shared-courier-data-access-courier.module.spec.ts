import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCourierDataAccessCourierModule } from './shared-courier-data-access-courier.module';

describe('SharedCourierDataAccessCourierModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCourierDataAccessCourierModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCourierDataAccessCourierModule).toBeDefined();
  });
});
