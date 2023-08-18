import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {OtherIssuesApprovalsItemComponent } from './other-issues-approvals-item.component';
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
import { of } from 'rxjs';

import { By } from '@angular/platform-browser';

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
  get itemDetailsButton() {
    return this.query('.pw-stone-icon-16');
  }




  private fixture: ComponentFixture<OtherIssuesApprovalsItemComponent>;

  constructor(fixture: ComponentFixture<OtherIssuesApprovalsItemComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('OtherIssuesApprovalsItemComponent', () => {
  let component: OtherIssuesApprovalsItemComponent;
  let fixture: ComponentFixture<OtherIssuesApprovalsItemComponent>;
  let selectionDialogService;
  let page: Page;

  beforeEach(() => {
    selectionDialogService = jasmine.createSpyObj(['open']);

    TestBed.configureTestingModule({
      declarations: [
        OtherIssuesApprovalsItemComponent,
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
        }
      ]
    });
    fixture = TestBed.createComponent(OtherIssuesApprovalsItemComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);

    component.newIbtRequestForm = new FormGroup({});
    component.requestId = 567;
    component.count=1;
    component.isSelected=null;

    component.item = {
      isSelected: true,
      id: '7899',
      itemCode: '1233NXB992',
      lotNumber:'121212',
      mfgDate: moment(),
      productCategory: 'TestProductCategory',
      productGroup: 'TestProductGroup',
      binCode: 'TestBinCode',
      binGroupCode:  'TestBinGroupCode',
      stdValue: 9,
      stdWeight: 9.89,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'APVL_PENDING',
      imageURL: null,
      requestedQuantity: 2,
      acceptedQuantity: 2,
      approvedQuantity: 2,
      availableQuantity: 2,
      inventoryId: 'A55',
      totalApprovedQuantity: 9,
      totalReceivedQuantity:9,
      totalReceivedValue:98.9,
      totalReceivedWeight:89,
      productGroupDesc:'TestProductCategoryDesc',
      productCategoryDesc: 'TestProductGroupDesc',
      isStudded: true,

    };
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('onInit', () => {
    it('should call newIbtRequestForm', () => {
      const expectedForm = new FormGroup({});
     spyOn<any>(component, 'newIbtRequestForm').and.returnValue(expectedForm);



       expect(component.newIbtRequestForm.valid).toBeFalsy();
    });
    it('should call newIbtRequestForm', () => {
      // spyOn(component.newIbtRequestForm, 'markAllAsTouched')


        expect(component.newIbtRequestForm.markAllAsTouched()).toBeFalsy();

      })

  })



})
