import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossTepStoneConfigDataAccessTepStoneConfigModule } from './eposs-tep-stone-config-data-access-tep-stone-config.module';

describe('EpossTepStoneConfigDataAccessTepStoneConfigModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossTepStoneConfigDataAccessTepStoneConfigModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossTepStoneConfigDataAccessTepStoneConfigModule).toBeDefined();
  });
});
