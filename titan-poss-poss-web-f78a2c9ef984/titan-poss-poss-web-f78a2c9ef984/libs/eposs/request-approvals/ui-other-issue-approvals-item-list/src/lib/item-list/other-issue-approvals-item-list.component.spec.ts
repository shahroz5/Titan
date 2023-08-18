import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtherIssueApprovalsItemListComponent } from './other-issue-approvals-item-list.component';
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
  selector: 'poss-web-other-issues-approvals-item',
  template: `
    Fake other-issues-approvals-item
  `
})
export class FakeOtherIssueApprovalsItemComponent {
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
    return this.queryAll('poss-web-bin-to-bin-transfer-item');
  }
  get historyItems() {
    return this.queryAll('poss-web-history-item');
  }

  get errorItems() {
    return this.queryAll('.pw-list-card__error-border');
  }

  private fixture: ComponentFixture< OtherIssueApprovalsItemListComponent>;

  constructor(fixture: ComponentFixture< OtherIssueApprovalsItemListComponent>) {
    this.fixture = fixture;
  }

  private queryAll(selector: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css(selector));
  }
}

describe(' OtherIssueApprovalsItemListComponent', () => {
  let component:  OtherIssueApprovalsItemListComponent;
  let fixture: ComponentFixture< OtherIssueApprovalsItemListComponent>;
  let page: Page;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        OtherIssueApprovalsItemListComponent,
        FakeOtherIssueApprovalsItemComponent,

      ],
      schemas: [],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: []
    });
    fixture = TestBed.createComponent( OtherIssueApprovalsItemListComponent);
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
