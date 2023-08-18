import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeVersionComponent } from './upgrade-version.component';

describe('UpgradeVersionComponent', () => {
  let component: UpgradeVersionComponent;
  let fixture: ComponentFixture<UpgradeVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
