import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsSearchListItemComponent } from './documents-search-list-item.component';

describe('DocumentsSearchListItemComponent', () => {
  let component: DocumentsSearchListItemComponent;
  let fixture: ComponentFixture<DocumentsSearchListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsSearchListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsSearchListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
