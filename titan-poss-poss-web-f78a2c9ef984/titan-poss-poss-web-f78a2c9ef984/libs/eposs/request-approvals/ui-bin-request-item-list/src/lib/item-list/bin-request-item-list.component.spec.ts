import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BinRequestItemListComponent } from './bin-request-item-list.component';
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
import { BinToBinTransferItem, RequestApprovalsItems, BinApprovalspayload } from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'poss-web-bin-request-item',
  template: `
    Fake bin-request-item
  `
})
export class FakeBinRequestItemComponent {
  @Input() item: any;

  @Input() pageSizeOptions: number[] = [];
  @Input() count;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() approvalsValue: EventEmitter<
    BinApprovalspayload
  > = new EventEmitter();
}



class Page {

  get items() {
    return this.queryAll('poss-web-bin-request-item');
  }


  private fixture: ComponentFixture<BinRequestItemListComponent>;

  constructor(fixture: ComponentFixture<BinRequestItemListComponent>) {
    this.fixture = fixture;
  }

  private queryAll(selector: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css(selector));
  }
}

describe(' BinRequestItemListComponent', () => {
  let component: BinRequestItemListComponent;
  let fixture: ComponentFixture<BinRequestItemListComponent>;
  let page: Page;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BinRequestItemListComponent,
        FakeBinRequestItemComponent,

      ],
      schemas: [],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: []
    });
    fixture = TestBed.createComponent(BinRequestItemListComponent);
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

  it('should call send approvals on call of approvals', () => {
    const approvalsValue: BinApprovalspayload = {
      binRequestUpdateDto: {
        remarks:'Approved',
        status:'APVL_PENDING'
      },
      id: 1098,
    };

    const expected = approvalsValue;

    let actual: BinApprovalspayload;
    component.approvalsValue.subscribe(result => {
      actual = result;
    });

    component.approvals(approvalsValue);

    expect(actual).toEqual(expected);
  });






}
)
