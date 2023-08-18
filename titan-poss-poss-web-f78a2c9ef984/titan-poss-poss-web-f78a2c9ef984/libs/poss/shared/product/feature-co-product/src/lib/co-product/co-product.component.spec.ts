import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoProductComponent } from './co-product.component';

describe('CoProductComponent', () => {
  let component: CoProductComponent;
  let fixture: ComponentFixture<CoProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
