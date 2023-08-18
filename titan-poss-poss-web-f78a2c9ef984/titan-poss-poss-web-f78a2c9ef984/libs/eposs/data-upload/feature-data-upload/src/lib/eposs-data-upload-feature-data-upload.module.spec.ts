import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossDataUploadFeatureDataUploadModule } from './eposs-data-upload-feature-data-upload.module';

describe('EpossDataUploadFeatureDataUploadModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossDataUploadFeatureDataUploadModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossDataUploadFeatureDataUploadModule).toBeDefined();
  });
});
