import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionRequestsListComponent } from './conversion-requests-list.component';

describe('ConversionRequestsListComponent', () => {
  let component: ConversionRequestsListComponent;
  let fixture: ComponentFixture<ConversionRequestsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversionRequestsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
