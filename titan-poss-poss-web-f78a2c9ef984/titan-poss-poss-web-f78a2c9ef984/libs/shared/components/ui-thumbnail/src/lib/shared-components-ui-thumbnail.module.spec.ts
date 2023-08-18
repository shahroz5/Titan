import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiThumbnailModule } from './shared-components-ui-thumbnail.module';

describe('SharedComponentsUiThumbnailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiThumbnailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiThumbnailModule).toBeDefined();
  });
});
