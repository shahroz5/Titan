import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBinGroupUiBinGroupListModule } from './shared-bin-group-ui-bin-group-list.module';

describe('SharedBinGroupUiBinGroupListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedBinGroupUiBinGroupListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedBinGroupUiBinGroupListModule).toBeDefined();
  });
});
