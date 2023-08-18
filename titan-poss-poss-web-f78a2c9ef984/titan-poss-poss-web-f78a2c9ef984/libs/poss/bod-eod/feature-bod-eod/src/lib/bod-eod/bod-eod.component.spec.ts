import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BodEodComponent } from './bod-eod.component';

describe('BodEodComponent', () => {
  let component: BodEodComponent;
  let fixture: ComponentFixture<BodEodComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BodEodComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BodEodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
