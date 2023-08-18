import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnTransferMenuComponent } from './cn-transfer-menu.component';

describe('CnTransferMenuComponent', () => {
  let component: CnTransferMenuComponent;
  let fixture: ComponentFixture<CnTransferMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnTransferMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnTransferMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
