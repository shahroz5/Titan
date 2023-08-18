import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossDataUploadDataAccessDataUploadModule } from './eposs-data-upload-data-access-data-upload.module';

describe('EpossDataUploadDataAccessDataUploadModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossDataUploadDataAccessDataUploadModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossDataUploadDataAccessDataUploadModule).toBeDefined();
  });
});
