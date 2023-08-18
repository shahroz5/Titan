import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilAclEncoderModule } from './shared-util-acl-encoder.module';

describe('SharedUtilAclEncoderModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedUtilAclEncoderModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedUtilAclEncoderModule).toBeDefined();
  });
});
