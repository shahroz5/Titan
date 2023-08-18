import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCorporateTownDataAccessCorporateTownModule } from './shared-corporate-town-data-access-corporate-town.module';

describe('SharedCorporateTownDataAccessCorporateTownModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCorporateTownDataAccessCorporateTownModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCorporateTownDataAccessCorporateTownModule).toBeDefined();
  });
});
