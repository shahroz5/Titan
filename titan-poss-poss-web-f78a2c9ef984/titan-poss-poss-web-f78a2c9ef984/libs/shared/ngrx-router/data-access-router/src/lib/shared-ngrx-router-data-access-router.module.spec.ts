import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedNgrxRouterDataAccessRouterModule } from './shared-ngrx-router-data-access-router.module';

describe('SharedNgrxRouterDataAccessRouterModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedNgrxRouterDataAccessRouterModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedNgrxRouterDataAccessRouterModule).toBeDefined();
  });
});
