import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsSearchListComponent } from './documents-search-list.component';

describe('DocumentsSearchListComponent', () => {
  let component: DocumentsSearchListComponent;
  let fixture: ComponentFixture<DocumentsSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
