import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReceiveShellComponent } from './stock-receive-shell.component';

describe('StockReceiveShellComponent', () => {
  let component: StockReceiveShellComponent;
  let fixture: ComponentFixture<StockReceiveShellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReceiveShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceiveShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
