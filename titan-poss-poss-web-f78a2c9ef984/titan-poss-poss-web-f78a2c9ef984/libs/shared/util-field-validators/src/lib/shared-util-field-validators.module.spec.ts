import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilFieldValidatorsModule } from './shared-util-field-validators.module';

describe('SharedUtilFieldValidatorsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUtilFieldValidatorsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUtilFieldValidatorsModule).toBeDefined();
  });
});
