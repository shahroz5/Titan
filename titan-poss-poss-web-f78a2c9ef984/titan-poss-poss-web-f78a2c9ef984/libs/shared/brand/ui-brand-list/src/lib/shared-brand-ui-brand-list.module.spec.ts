import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBrandUiBrandListModule } from './shared-brand-ui-brand-list.module';

describe('SharedBrandUiBrandListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedBrandUiBrandListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedBrandUiBrandListModule).toBeDefined();
  });
});
