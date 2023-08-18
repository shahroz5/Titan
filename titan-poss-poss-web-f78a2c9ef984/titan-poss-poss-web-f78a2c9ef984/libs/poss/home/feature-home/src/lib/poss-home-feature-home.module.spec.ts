import { waitForAsync, TestBed } from '@angular/core/testing';
import { PossHomeFeatureHomeModule } from './poss-home-feature-home.module';

describe('PossHomeFeatureHomeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PossHomeFeatureHomeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PossHomeFeatureHomeModule).toBeDefined();
  });
});
