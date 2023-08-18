import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedStateDataAccessStateModule } from './shared-state-data-access-state.module';

describe('SharedStateDataAccessStateModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedStateDataAccessStateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedStateDataAccessStateModule).toBeDefined();
  });
});
