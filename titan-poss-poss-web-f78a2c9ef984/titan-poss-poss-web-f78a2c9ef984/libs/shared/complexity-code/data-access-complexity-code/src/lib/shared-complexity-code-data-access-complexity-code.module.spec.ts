import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComplexityCodeDataAccessComplexityCodeModule } from './shared-complexity-code-data-access-complexity-code.module';

describe('SharedComplexityCodeDataAccessComplexityCodeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComplexityCodeDataAccessComplexityCodeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComplexityCodeDataAccessComplexityCodeModule).toBeDefined();
  });
});
