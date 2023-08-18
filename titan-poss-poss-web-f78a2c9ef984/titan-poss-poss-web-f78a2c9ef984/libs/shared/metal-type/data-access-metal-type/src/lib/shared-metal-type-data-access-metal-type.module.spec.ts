import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedMetalTypeDataAccessMetalTypeModule } from './shared-metal-type-data-access-metal-type.module';

describe('SharedMetalTypeDataAccessMetalTypeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedMetalTypeDataAccessMetalTypeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedMetalTypeDataAccessMetalTypeModule).toBeDefined();
  });
});
