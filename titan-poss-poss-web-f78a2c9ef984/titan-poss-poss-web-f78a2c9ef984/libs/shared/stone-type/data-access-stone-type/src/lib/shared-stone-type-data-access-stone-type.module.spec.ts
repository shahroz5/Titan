import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedStoneTypeDataAccessStoneTypeModule } from './shared-stone-type-data-access-stone-type.module';

describe('SharedStoneTypeDataAccessStoneTypeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedStoneTypeDataAccessStoneTypeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedStoneTypeDataAccessStoneTypeModule).toBeDefined();
  });
});
