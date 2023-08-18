import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedListOfValuesDataAccessLovModule } from './shared-list-of-values-data-access-lov.module';

describe('SharedListOfValuesDataAccessLovModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedListOfValuesDataAccessLovModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedListOfValuesDataAccessLovModule).toBeDefined();
  });
});
