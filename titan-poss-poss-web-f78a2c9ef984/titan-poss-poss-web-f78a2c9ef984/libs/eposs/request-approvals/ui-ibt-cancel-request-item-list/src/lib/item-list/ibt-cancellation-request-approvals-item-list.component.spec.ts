import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbtCancellationRequestApprovalsItemListComponent } from './ibt-cancellation-request-approvals-item-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  DebugElement
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { By } from '@angular/platform-browser';
import { BinToBinTransferItem, RequestApprovalsItems } from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'poss-web-ibt-cancellation-request-approvals-item',
  template: `
    Fake ibt-cancellation-request-approvals-item
  `
})
export class FakeIbtCancellationRequestApprovalsItemComponent {
  @Input() item: any;
  @Input() requestId=345;
  @Input() isSelectAll=false;
  @Input() selectionEvents: Observable<boolean>;

  @Input() count: number;

  @Output() isSelected = new EventEmitter<any>();
  @Output() private itemDetails = new EventEmitter<any>();
}



class Page {
  // getter properties wait to query the DOM until called.
  get items() {
    return this.queryAll('poss-web-ibt-cancellation-request-approvals-item');
  }


  private fixture: ComponentFixture< IbtCancellationRequestApprovalsItemListComponent>;

  constructor(fixture: ComponentFixture< IbtCancellationRequestApprovalsItemListComponent>) {
    this.fixture = fixture;
  }

  private queryAll(selector: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css(selector));
  }
}

describe(' IbtCancellationRequestApprovalsItemListComponent', () => {
  let component:  IbtCancellationRequestApprovalsItemListComponent;
  let fixture: ComponentFixture< IbtCancellationRequestApprovalsItemListComponent>;
  let page: Page;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        IbtCancellationRequestApprovalsItemListComponent,
        FakeIbtCancellationRequestApprovalsItemComponent,

      ],
      schemas: [],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: []
    });
    fixture = TestBed.createComponent( IbtCancellationRequestApprovalsItemListComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should call send page event on call of paginate', () => {
    const nextPageEvent: PageEvent = {
      pageIndex: 10,
      pageSize: 2,
      length: 20
    };

    const expected = nextPageEvent;

    let actual: PageEvent;
    component.paginator.subscribe(result => {
      actual = result;
    });

    component.paginate(nextPageEvent);

    expect(actual).toEqual(expected);
  });



  it('should retrun min page size ', () => {
    component.pageSizeOptions = [40, 5, 10, 20];
    const expected = 5;

    const actual = component.getMinPageSize();

    expect(actual).toEqual(expected);
  });

  it('should call select event on call of isSelect', () => {


    const select:any =true
    const expected = select;

    let actual: any;
    component.isSelected.subscribe(result => {
      actual = result;
    });

    component.isSelect(select);

    expect(actual).toEqual(expected);
  });


}
)
