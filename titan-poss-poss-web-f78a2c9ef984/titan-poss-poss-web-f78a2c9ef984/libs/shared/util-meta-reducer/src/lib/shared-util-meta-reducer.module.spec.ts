import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilMetaReducerModule } from './shared-util-meta-reducer.module';

describe('SharedUtilMetaReducerModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUtilMetaReducerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUtilMetaReducerModule).toBeDefined();
  });
});
