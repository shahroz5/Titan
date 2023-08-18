import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUserAgentDataAccessUserAgentModule } from './shared-user-agent-data-access-user-agent.module';

describe('SharedUserAgentDataAccessUserAgentModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUserAgentDataAccessUserAgentModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUserAgentDataAccessUserAgentModule).toBeDefined();
  });
});
