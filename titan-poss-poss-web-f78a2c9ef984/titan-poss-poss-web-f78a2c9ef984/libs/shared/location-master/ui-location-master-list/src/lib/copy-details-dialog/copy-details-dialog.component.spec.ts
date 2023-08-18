import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyDetailsDialogComponent } from './copy-details-dialog.component';

describe('CopyDetailsDialogComponent', () => {
  let component: CopyDetailsDialogComponent;
  let fixture: ComponentFixture<CopyDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
