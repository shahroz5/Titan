import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcpMarketCodeFactorViewComponent } from './ucp-market-code-factor-view.component';

describe('UcpMarketCodeFactorViewComponent', () => {
  let component: UcpMarketCodeFactorViewComponent;
  let fixture: ComponentFixture<UcpMarketCodeFactorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcpMarketCodeFactorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcpMarketCodeFactorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
