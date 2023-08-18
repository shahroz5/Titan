import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUpdateMasterComponent } from './product-update-master.component';

describe('ProductUpdateMasterComponent', () => {
  let component: ProductUpdateMasterComponent;
  let fixture: ComponentFixture<ProductUpdateMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductUpdateMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductUpdateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
