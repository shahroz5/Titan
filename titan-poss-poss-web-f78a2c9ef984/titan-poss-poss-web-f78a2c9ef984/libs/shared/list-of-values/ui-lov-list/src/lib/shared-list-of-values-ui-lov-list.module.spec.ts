import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedListOfValuesUiLovListModule } from './shared-list-of-values-ui-lov-list.module';

describe('SharedListOfValuesUiLovListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedListOfValuesUiLovListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedListOfValuesUiLovListModule).toBeDefined();
  });
});
