import { MatDialog } from '@angular/material/dialog';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { BinRequestItemComponent } from './bin-request-item.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Pipe,
  PipeTransform,
  NO_ERRORS_SCHEMA,
  DebugElement
} from '@angular/core';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import * as moment from 'moment';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, EMPTY } from 'rxjs';
import {
  StockItemBinGroupCodeEnum,
  StockReceiveProductCategoryCodeEnum,
  StockItemBinCodeEnum,
  BinApprovalspayload
} from '@poss-web/shared/models';
import { By } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BinRequestApprovalsPopupComponent } from '@poss-web/eposs/request-approvals/ui-bin-request-approvals-popup';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Pipe({
  name: 'translate'
})
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'dateFormatter'
})
class DateFromatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'weightFormatter'
})
class WeightFromatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'currencyFormatter'
})
class CurrencyFormatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

class Page {


  get approveButton() {
    return this.query(`button[ mat-button]`);
  }



  private fixture: ComponentFixture<BinRequestItemComponent>;

  constructor(fixture: ComponentFixture<BinRequestItemComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('BinRequestItemComponent', () => {
  let component: BinRequestItemComponent;
  let fixture: ComponentFixture<BinRequestItemComponent>;
  let selectionDialogService;
  let page: Page;

  let mockData: any;
  mockData = {
    bin: 'studded',
    remarks: 'Required Urgently'
  }

  beforeEach(() => {
    selectionDialogService = jasmine.createSpyObj(['open']);

    TestBed.configureTestingModule({
      declarations: [
        BinRequestItemComponent,
        BinRequestApprovalsPopupComponent,
        TranslatePipeStub,
        DateFromatterPipeStub,
        WeightFromatterPipeStub,
        CurrencyFormatterPipeStub
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: [
        {
          provide: WeightFormatterService,
          useValue: {
            format: (data: any) => data
          }
        },
        {
          provide: SelectionDialogService,
          useValue: selectionDialogService
        },
        {
          provide: TranslateService,
          useValue: {
            get: (data: any) => of(data)
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        {
          provide: MatDialogRef, useValue: {
            open: (data: any) => { },
            afterClosed: () => { of() }
          }
        },
      ],

    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
         entryComponents: [ BinRequestApprovalsPopupComponent ]
       }
     });

    fixture = TestBed.createComponent(BinRequestItemComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);


    component.count = 1;




    component.item = {
      binName: 'studded',
      id: 7899,
      reqLocationCode: 'BTQ',
      reqDocDate: moment(),
      reqDocNo: 678,
      status: 'APVL_PENDING',
      requestedRemarks: 'required',
      binGroupCode: 'STN'

    };
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });


  it('should call binRequestSuccessPopup', () => {
    const status = 'reject'
    spyOn(component.dialog, 'open').and
      .returnValue({ afterClosed: () => EMPTY });


    component.binRequestApprovalsPopup(status);

    expect(component.dialog.open).toHaveBeenCalled();
  })

  // it('should call emit function', () => {
  //   const status = 'reject'
  //   let dialogRef = component.dialog.open(BinRequestApprovalsPopupComponent, {
  //     data: {
  //       binName: 'abcd',
  //       reqDocNo: 789,
  //       status: 'reject'
  //     }
  //   });
  //   spyOn(dialogRef, 'afterClosed').and.returnValue(
  //     of({
  //       binName: 'abcd',
  //       reqDocNo: 789,
  //       status: 'reject'
  //     })
  //   );
  //   spyOn(component.approvalsValue, 'emit');


  //   component.binRequestApprovalsPopup(status);


  //   expect(component.approvalsValue.emit).toHaveBeenCalled();






  // })

  it('should call send approvals on call of approvals', () => {
    const approvalsValue: BinApprovalspayload = {
      binRequestUpdateDto: {
        remarks:null ,
        status:'APPROVED',
      },
      id: 7899,
    };

    const expected = approvalsValue;

    let actual: BinApprovalspayload;
    component.approvalsValue.subscribe(result => {
      actual = result;
    });

    component.binRequestApprovalsPopup('accept');

    expect(actual).toEqual(expected);
  });





})
