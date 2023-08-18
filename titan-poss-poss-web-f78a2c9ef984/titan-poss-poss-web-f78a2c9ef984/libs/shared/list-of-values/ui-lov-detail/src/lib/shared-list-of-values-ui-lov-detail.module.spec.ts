import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedListOfValuesUiLovDetailModule } from './shared-list-of-values-ui-lov-detail.module';

describe('SharedListOfValuesUiLovDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedListOfValuesUiLovDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedListOfValuesUiLovDetailModule).toBeDefined();
  });
});
