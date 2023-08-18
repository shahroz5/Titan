import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossInventoryHomeDataAccessInventoryHomeModule } from './eposs-inventory-home-data-access-inventory-home.module';

describe('EpossInventoryHomeDataAccessInventoryHomeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossInventoryHomeDataAccessInventoryHomeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossInventoryHomeDataAccessInventoryHomeModule).toBeDefined();
  });
});
