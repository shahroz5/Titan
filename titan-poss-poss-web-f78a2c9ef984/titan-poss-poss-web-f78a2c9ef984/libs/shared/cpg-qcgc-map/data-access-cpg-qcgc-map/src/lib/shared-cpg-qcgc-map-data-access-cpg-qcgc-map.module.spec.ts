import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCpgQcgcMapDataAccessCpgQcgcMapModule } from './shared-cpg-qcgc-map-data-access-cpg-qcgc-map.module';

describe('SharedCpgQcgcMapDataAccessCpgQcgcMapModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedCpgQcgcMapDataAccessCpgQcgcMapModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedCpgQcgcMapDataAccessCpgQcgcMapModule).toBeDefined();
  });
});
