import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateItemHallmarkDetailsComponent } from './update-item-hallmark-details.component';

describe('UpdateItemHallmarkDetailsComponent', () => {
  let component: UpdateItemHallmarkDetailsComponent;
  let fixture: ComponentFixture<UpdateItemHallmarkDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateItemHallmarkDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateItemHallmarkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
