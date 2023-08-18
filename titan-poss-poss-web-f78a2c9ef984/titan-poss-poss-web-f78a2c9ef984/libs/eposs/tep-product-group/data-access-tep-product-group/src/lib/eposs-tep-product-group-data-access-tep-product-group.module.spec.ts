import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossTepProductGroupDataAccessTepProductGroupModule } from './eposs-tep-product-group-data-access-tep-product-group.module';

describe('EpossTepProductGroupDataAccessTepProductGroupModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossTepProductGroupDataAccessTepProductGroupModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossTepProductGroupDataAccessTepProductGroupModule).toBeDefined();
  });
});
