import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossInventoryHomeFeatureInventoryHomeModule } from './eposs-inventory-home-feature-inventory-home.module';

describe('EpossInventoryHomeFeatureInventoryHomeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossInventoryHomeFeatureInventoryHomeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossInventoryHomeFeatureInventoryHomeModule).toBeDefined();
  });
});
