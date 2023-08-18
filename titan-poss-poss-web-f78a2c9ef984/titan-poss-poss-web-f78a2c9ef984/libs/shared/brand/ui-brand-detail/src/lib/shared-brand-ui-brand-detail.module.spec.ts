import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBrandUiBrandDetailModule } from './shared-brand-ui-brand-detail.module';

describe('SharedBrandUiBrandDetailModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedBrandUiBrandDetailModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedBrandUiBrandDetailModule).toBeDefined();
  });
});
