import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedNgrxRouterFeatureRouterModule } from './shared-ngrx-router-feature-router.module';

describe('SharedNgrxRouterFeatureRouterModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedNgrxRouterFeatureRouterModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedNgrxRouterFeatureRouterModule).toBeDefined();
  });
});
