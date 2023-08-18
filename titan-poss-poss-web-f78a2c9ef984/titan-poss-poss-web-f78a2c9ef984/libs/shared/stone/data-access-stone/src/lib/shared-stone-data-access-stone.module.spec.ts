import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedStoneDataAccessStoneModule } from './shared-stone-data-access-stone.module';

describe('SharedStoneDataAccessStoneModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedStoneDataAccessStoneModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedStoneDataAccessStoneModule).toBeDefined();
  });
});
