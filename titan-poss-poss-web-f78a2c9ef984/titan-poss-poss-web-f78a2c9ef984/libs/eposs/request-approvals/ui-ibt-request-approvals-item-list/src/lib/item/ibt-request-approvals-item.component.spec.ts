import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { IbtRequestApprovalsItemComponent } from './ibt-request-approvals-item.component';
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
import {
  StockItemBinGroupCodeEnum,
  StockReceiveProductCategoryCodeEnum,
  StockItemBinCodeEnum
} from '@poss-web/shared/models';
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

  get measuredWeightInputBox() {
    return this.query(`input[formControlName='measuredWeight']`);
  }

  get remarksSelection() {
    return this.query(`mat-select[formControlName='remarkGroupCode']`);
  }

  get binSelectionButton() {
    return this.query(`button[mat-flat-button]`);
  }

  get verifyButton() {
    return this.query(`button.pw-verify-button`);
  }

  private fixture: ComponentFixture<IbtRequestApprovalsItemComponent>;

  constructor(fixture: ComponentFixture<IbtRequestApprovalsItemComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('IbtRequestApprovalsItemComponent', () => {
  let component: IbtRequestApprovalsItemComponent;
  let fixture: ComponentFixture<IbtRequestApprovalsItemComponent>;
  let selectionDialogService;
  let page: Page;

  beforeEach(() => {
    selectionDialogService = jasmine.createSpyObj(['open']);

    TestBed.configureTestingModule({
      declarations: [
        IbtRequestApprovalsItemComponent,
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
    fixture = TestBed.createComponent(IbtRequestApprovalsItemComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);

    component.newIbtRequestForm = new FormGroup({});
    component.requestId = 567;
    component.count=1;
    component.isSelected=null;

    // component.item = {
    //   isSelected: true,
    //   id: '7899',
    //   itemCode: '1233NXB992',
    //   lotNumber:'121212',
    //   mfgDate: moment(),
    //   productCategory: 'TestProductCategory',
    //   productGroup: 'TestProductGroup',
    //   binCode: 'TestBinCode',
    //   binGroupCode:  'TestBinGroupCode',
    //   stdValue: 9,
    //   stdWeight: 9.89,
    //   currencyCode: 'INR',
    //   weightUnit: 'gms',
    //   status: 'APVL_PENDING',
    //   imageURL: null,
    //   requestedQuantity: 2,
    //   acceptedQuantity: 2,
    //   approvedQuantity: 2,
    //   availableQuantity: 2,
    //   inventoryId: 'A55',
    //   totalApprovedQuantity: 9,
    //   totalReceivedQuantity:9,
    //   totalReceivedValue:98.9,
    //   totalReceivedWeight:89,
    //   productGroupDesc:'TestProductCategoryDesc',
    //   productCategoryDesc: 'TestProductGroupDesc',
    //   isStudded: true,

    // };
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
      // it('should call newIbtRequestForm', () => {
      //   // spyOn(component.newIbtRequestForm, 'markAllAsTouched')
      //   spyOn(component, 'updateItem');
      //     expect(component.updateItem()).toHaveBeenCalled();

      //   })
        // it('should call newIbtRequestForm', () => {
        //   // spyOn(component.newIbtRequestForm, 'markAllAsTouched')
        //   spyOn(component, 'updateItem');
        //     expect(component.updateItem()).toHaveBeenCalled();

        //   })
  })
  // describe('Form Creation', () => {
  //   // const isSelectedData = {
  //   //   id: '678',
  //   //   isSelected: true
  //   // };
  //   it('should call newIbtRequestForm', () => {
  //   // spyOn(component.newIbtRequestForm, 'markAllAsTouched')


  //     expect(component.newIbtRequestForm.markAllAsTouched()).toBeFalsy();

  //   })
  // })

  //   it('should set error if binGroup code is DISPUTE', () => {
  //     component.item.binGroupCode = 'DISPUTE';
  //     component.item.orderType = null;
  //     spyOn<any>(component, 'createForm').and.returnValue(new FormGroup({}));

  //     component.ngOnInit();

  //     expect(component.isWeightMismatch).toBeTruthy();
  //   });

  //   it('should set matBadgeColor primary if orderType is Regular', () => {
  //     component.item.orderType = 'R';
  //     spyOn<any>(component, 'createForm').and.returnValue(new FormGroup({}));
  //     const expected = 'primary';

  //     component.ngOnInit();

  //     expect(component.matBadgeColor).toEqual(expected);
  //   });
  //   it('should set matBadgeColor accent if orderType is Spares', () => {
  //     spyOn<any>(component, 'createForm').and.returnValue(new FormGroup({}));
  //     component.item.orderType = 's';
  //     const expected = 'accent';

  //     component.ngOnInit();

  //     expect(component.matBadgeColor).toEqual(expected);
  //   });

  //   it('should set matBadgeColor warn if orderType is Priority ', () => {
  //     spyOn<any>(component, 'createForm').and.returnValue(new FormGroup({}));
  //     const expected = 'warn';
  //     component.item.orderType = 'P';
  //     component.ngOnInit();

  //     expect(component.matBadgeColor).toEqual(expected);
  //   });
  // });

  // describe('onChanges', () => {
  //   it('should assign binCode selected by the parent', () => {
  //     const binCode = 'binCode123';
  //     component.isVerified = true;

  //     component.ngOnChanges({
  //       item: {
  //         currentValue: {
  //           binCode: binCode
  //         },
  //         previousValue: null,
  //         firstChange: false,
  //         isFirstChange: () => false
  //       }
  //     });
  //     expect(component.selectedBinCode).toEqual(binCode);
  //   });

  //   it('should create new form if updating item fails', () => {
  //     spyOn<any>(component, 'createForm').and.returnValue(new FormGroup({}));
  //     component.isVerified = true;
  //     component.ngOnChanges({
  //       item: {
  //         currentValue: {
  //           isUpdatingSuccess: false
  //         },
  //         previousValue: null,
  //         firstChange: false,
  //         isFirstChange: () => false
  //       }
  //     });
  //     expect(component['createForm']).toHaveBeenCalledWith(component.item);
  //   });

  //   it('should show success or error message for 2 sec (fakeAsync,tick) ', fakeAsync(() => {
  //     spyOn<any>(component, 'createForm').and.returnValue(new FormGroup({}));
  //     component.isVerified = true;
  //     component.showUpdateStatus = true;
  //     component.ngOnChanges({
  //       item: {
  //         currentValue: {
  //           isUpdatingSuccess: true
  //         },
  //         previousValue: null,
  //         firstChange: false,
  //         isFirstChange: () => false
  //       }
  //     });
  //     expect(component.showUpdateStatus).toBeTruthy();
  //     tick(2000);
  //     expect(component.showUpdateStatus).toBeFalsy();
  //   }));

  //   it('should set previous measured weight in case of error while validating', () => {
  //     const prevMeasuredWeight = 1000;
  //     component['prevMeasuredWeight'] = prevMeasuredWeight;
  //     spyOn(component.itemForm, 'patchValue');
  //     component.ngOnChanges({
  //       item: {
  //         currentValue: {
  //           isValidatingError: true
  //         },
  //         previousValue: null,
  //         firstChange: false,
  //         isFirstChange: () => false
  //       }
  //     });
  //     expect(component.itemForm.patchValue).toHaveBeenCalledWith({
  //       measuredWeight: prevMeasuredWeight
  //     });
  //   });
  //   describe('Weight Validation check', () => {
  //     it('should set binGroupCode and BinCode as Default and remrks as null if weight is valid', () => {
  //       component.item.binGroupCode = 'DISPUTE';
  //       component.itemForm = component['createForm'](component.item);
  //       spyOn(component, 'updateItem');
  //       component.ngOnChanges({
  //         item: {
  //           currentValue: {
  //             isValidatingSuccess: true
  //           },
  //           previousValue: null,
  //           firstChange: false,
  //           isFirstChange: () => false
  //         }
  //       });
  //       expect(component.itemForm.get('binGroupCode').value).toEqual(
  //         component.binGroupCode
  //       );
  //       expect(component.selectedBinCode).toEqual(
  //         StockItemBinCodeEnum.ZERO_BIN
  //       );
  //       expect(component.itemForm.get('remarkGroupCode').value).toBeNull();
  //     });

  //     it('should set binGroupCode as DISPUTE and remrks as null if weight mismatch', () => {
  //       component.itemForm = component['createForm'](component.item);
  //       spyOn(component, 'updateItem');
  //       component.ngOnChanges({
  //         item: {
  //           currentValue: {
  //             isValidatingSuccess: false
  //           },
  //           previousValue: null,
  //           firstChange: false,
  //           isFirstChange: () => false
  //         }
  //       });
  //       expect(component.itemForm.get('binGroupCode').value).toEqual(
  //         StockItemBinGroupCodeEnum.DISPUTE
  //       );
  //       expect(component.itemForm.get('remarkGroupCode').value).toBeNull();
  //     });

  //     it('should call update item after validation', fakeAsync(() => {
  //       component.itemForm = component['createForm'](component.item);
  //       spyOn(component, 'updateItem');
  //       component.ngOnChanges({
  //         item: {
  //           currentValue: {
  //             isValidatingSuccess: true
  //           },
  //           previousValue: null,
  //           firstChange: false,
  //           isFirstChange: () => false
  //         }
  //       });
  //       tick();
  //       expect(component.updateItem).toHaveBeenCalled();
  //     }));
  //   });
  // });

  // it('should call removeForm ngOnDestroy for non verified items', () => {
  //   spyOn<any>(component, 'removeForm');
  //   component.isVerified = false;

  //   component.ngOnDestroy();

  //   expect(component['removeForm']).toHaveBeenCalled();
  // });

  // it('should remove item form parent form on call of removeForm', () => {
  //   const itemForm = component['createForm'](component.item);
  //   spyOn(itemForm, 'markAsPristine');
  //   const expected = 0;

  //   component['removeForm'](itemForm);

  //   const actual = component.parentForm.controls.filter(
  //     form => form.get('id').value === component.item.id
  //   ).length;

  //   expect(actual).toEqual(expected);
  //   expect(itemForm.markAsPristine).toHaveBeenCalled();
  // });

  // it('should makeFormDirty of form and all its controlls on call of makeFormDirty', () => {
  //   component.itemForm = component['createForm'](component.item);
  //   const controls = [
  //     'measuredQuantity',
  //     'measuredWeight',
  //     'binGroupCode',
  //     'remarkGroupCode'
  //   ];
  //   controls.forEach(control =>
  //     spyOn(component.itemForm.controls[control], 'markAsDirty')
  //   );
  //   spyOn(component.itemForm, 'markAsDirty');

  //   component['makeFormDirty']();

  //   expect(component.itemForm.markAsDirty).toHaveBeenCalled();
  //   controls.forEach(control =>
  //     expect(
  //       component.itemForm.controls[control].markAsDirty
  //     ).toHaveBeenCalled()
  //   );
  // });
  // describe('itemDetails', () => {
  //   it('should send itemDetails event on call of openItemDetails', () => {
  //     const expected = {
  //       itemCode: component.item.itemCode,
  //       lotNumber: component.item.lotNumber,
  //       currencyCode: component.item.currencyCode,
  //       weightUnit: component.item.weightUnit,
  //       productGroup: component.item.productGroupDesc,
  //       productCategory: component.item.productCategoryDesc,
  //       stdValue: component.item.stdValue,
  //       stdWeight: component.item.stdWeight,
  //       grossWeight: component.item.stdWeight,
  //       netWeight: 0,
  //       showTitle: true
  //     };
  //     let actual;
  //     component['itemDetails'].subscribe(result => (actual = result));

  //     component.openItemDetails();

  //     expect(actual).toEqual(expected);
  //   });
  // })
  //   it('should not render item details icon if product type is not studded', () => {
  //     component.item.isStudded = false;
  //     fixture.detectChanges();
  //     expect(page.itemDetailsButton).toBeNull();
  //   });

  //   it('should render item details icon if product type is studded', () => {
  //     component.item.isStudded = true;
  //     fixture.detectChanges();
  //     expect(page.itemDetailsButton).not.toBeNull();
  //   });

  //   it('should call openItemDetails when item details icon is clicked ', () => {
  //     component.item.isStudded = true;
  //     spyOn(component, 'openItemDetails');

  //     fixture.detectChanges();
  //     page.itemDetailsButton.triggerEventHandler('click', null);

  //     expect(component.openItemDetails).toHaveBeenCalled();
  //   });
  // });



  //   it('createForm should create and return form', () => {
  //     const expected = component.item;

  //     const form = (component as any).createForm(component.item);
  //     expect(form.get('id').value).toEqual(expected.id);
  //     expect(form.get('measuredQuantity').value).toEqual(
  //       expected.measuredQuantity
  //     );
  //     expect(form.get('measuredWeight').value).toEqual(expected.measuredWeight);
  //     expect(form.get('binGroupCode').value).toEqual(expected.binGroupCode);
  //     expect(form.get('remarkGroupCode').value).toEqual(expected.remarks);
  //   });

  //   it('set remarks null incase of empty ', () => {
  //     component.item.remarks = '';
  //     const itemForm = component['createForm'](component.item);

  //     expect(itemForm.get('remarkGroupCode').value).toBeNull();
  //   });

  //   it('measuredQuantity should be disabled ', () => {
  //     const itemForm = component['createForm'](component.item);

  //     expect(itemForm.get('measuredQuantity').disabled).toBeTruthy();
  //   });

  //   it('measuredWeight should be disabled for COINs', () => {
  //     component.item.productCategory = StockReceiveProductCategoryCodeEnum.COIN;
  //     const itemForm = component['createForm'](component.item);

  //     expect(itemForm.get('measuredWeight').disabled).toBeTruthy();
  //   });

  //   it('measuredWeight validtion check', () => {
  //     const itemForm = component['createForm'](component.item);

  //     itemForm.patchValue({
  //       measuredWeight: null
  //     });

  //     expect(itemForm.invalid).toBeTruthy();

  //     itemForm.patchValue({
  //       measuredWeight: 0
  //     });

  //     expect(itemForm.invalid).toBeTruthy();

  //     itemForm.patchValue({
  //       measuredWeight: -10
  //     });

  //     expect(itemForm.invalid).toBeTruthy();

  //     itemForm.patchValue({
  //       measuredWeight: 10
  //     });

  //     expect(itemForm.valid).toBeTruthy();
  //   });

  //   it('should call weightFormatter while assigning measuredWeight value', () => {
  //     const expected = 10000;
  //     spyOn(component['weightFormatter'], 'format').and.returnValue(expected);

  //     const itemForm = component['createForm'](component.item);

  //     expect(component['weightFormatter'].format).toHaveBeenCalledWith(
  //       component.item.measuredWeight
  //     );
  //     expect(itemForm.get('measuredWeight').value).toEqual(expected);
  //   });

  //   it('binGroupCode validtion check', () => {
  //     const itemForm = component['createForm'](component.item);

  //     itemForm.patchValue({
  //       binGroupCode: null
  //     });

  //     expect(itemForm.invalid).toBeTruthy();

  //     itemForm.patchValue({
  //       binGroupCode: 'TEST123'
  //     });

  //     expect(itemForm.valid).toBeTruthy();
  //   });

  //   it('remarkGroupCode should be to default set when binGroupCode is set to DEFFECTIVE', () => {
  //     const expected = component.remarks[0].code;
  //     const itemForm = component['createForm'](component.item);

  //     itemForm.patchValue({
  //       binGroupCode: StockItemBinGroupCodeEnum.DEFECTIVE
  //     });
  //     const actual = itemForm.get('remarkGroupCode').value;

  //     expect(actual).toEqual(expected);
  //   });

  //   it('binCode should be to default set when binGroupCode is set to other than DEFFECTIVE', () => {
  //     const expected = StockItemBinCodeEnum.ZERO_BIN;
  //     const itemForm = component['createForm'](component.item);

  //     itemForm.patchValue({
  //       binGroupCode: StockItemBinGroupCodeEnum.STN
  //     });
  //     const actual = component.selectedBinCode;

  //     expect(actual).toEqual(expected);
  //   });

  //   it('remarksValidator validtion check', () => {
  //     const itemForm = component['createForm'](component.item);

  //     itemForm.patchValue({
  //       binGroupCode: StockItemBinGroupCodeEnum.DEFECTIVE,
  //       remarkGroupCode: null
  //     });

  //     expect(itemForm.invalid).toBeTruthy();

  //     itemForm.patchValue({
  //       binGroupCode: StockItemBinGroupCodeEnum.DEFECTIVE,
  //       remarkGroupCode: 'Remarks'
  //     });

  //     expect(itemForm.valid).toBeTruthy();

  //     itemForm.patchValue({
  //       binGroupCode: 'Test',
  //       remarkGroupCode: null
  //     });

  //     expect(itemForm.valid).toBeTruthy();
  //   });

  //   it('should add item form to parent form for non veridfied product', () => {
  //     const expected = 1;

  //     component['createForm'](component.item);

  //     const actual = component.parentForm.controls.filter(
  //       form => form.get('id').value === component.item.id
  //     ).length;

  //     expect(actual).toEqual(expected);
  //   });
  // });

  // describe('openBinSelectionPopup', () => {
  //   it('should open bin selection popup', () => {
  //     selectionDialogService.open.and.returnValue(of(null));
  //     spyOn(component, 'updateItem');
  //     component.openBinSelectionPopup();
  //     expect(selectionDialogService.open).toHaveBeenCalled();
  //   });

  //   it('should call update item after setteing the bincode', () => {
  //     const expected = 'ABCD';
  //     spyOn(component, 'updateItem');
  //     selectionDialogService.open.and.returnValue(of({ id: expected }));
  //     component.openBinSelectionPopup();

  //     expect(component.selectedBinCode).toEqual(expected);
  //     expect(component.updateItem).toHaveBeenCalled();
  //   });

  //   it('should show bin selection button only for verified items and binGroupCode is default', () => {
  //     component.item.binGroupCode = 'STN';
  //     component.isVerified = true;

  //     fixture.detectChanges();

  //     expect(page.binSelectionButton).not.toBeNull();
  //   });

  //   it('should not show bin selection button for non verified items', () => {
  //     component.isVerified = false;

  //     fixture.detectChanges();

  //     expect(page.binSelectionButton).toBeNull();
  //   });

  //   it('should call openBinSelectionPopup on click of bin selection button', () => {
  //     component.isVerified = true;
  //     component.item.binGroupCode = 'STN';
  //     spyOn(component, 'openBinSelectionPopup');

  //     fixture.detectChanges();
  //     page.binSelectionButton.triggerEventHandler('click', null);

  //     expect(component.openBinSelectionPopup).toHaveBeenCalled();
  //   });

  //   it('should show selected binCode on the button', () => {
  //     const expected = component.item.binCode;
  //     component.item.binGroupCode = 'STN';
  //     component.isVerified = true;

  //     fixture.detectChanges();
  //     const actual = page.binSelectionButton.nativeElement.textContent;

  //     expect(actual).toContain(expected);
  //   });
  // });

  // describe('updateItem', () => {
  //   it('should not send update event for non verified products', () => {
  //     spyOn<any>(component, 'makeFormDirty');
  //     spyOn<any>(component['update'], 'emit');
  //     component.itemForm = new FormGroup({});
  //     component.isVerified = false;

  //     component.updateItem();

  //     expect(component['update'].emit).not.toHaveBeenCalled();
  //     expect(component['makeFormDirty']).not.toHaveBeenCalled();
  //   });

  //   it('should not send update event for verified products when form not valid and mark form-field as dirty', () => {
  //     spyOn<any>(component, 'makeFormDirty');
  //     spyOn<any>(component['update'], 'emit');
  //     component.itemForm = new FormGroup({
  //       test: new FormControl(null, Validators.required)
  //     });
  //     component.isVerified = true;

  //     component.updateItem();

  //     expect(component['update'].emit).not.toHaveBeenCalled();
  //     expect(component['makeFormDirty']).toHaveBeenCalled();
  //   });

  //   it('should send update event for verified products when form is valid', () => {
  //     spyOn<any>(component, 'makeFormDirty');
  //     spyOn<any>(component['update'], 'emit');
  //     component.itemForm = new FormGroup({});
  //     component.isVerified = true;

  //     component.updateItem();

  //     expect(component['update'].emit).toHaveBeenCalled();
  //     expect(component['makeFormDirty']).not.toHaveBeenCalled();
  //   });
  // });

  // describe('verifyItem', () => {
  //   it('should not send update event for verified products', () => {
  //     spyOn<any>(component, 'makeFormDirty');
  //     spyOn<any>(component['verify'], 'emit');
  //     component.itemForm = new FormGroup({});
  //     component.isVerified = true;

  //     component.verifyItem();

  //     expect(component['verify'].emit).not.toHaveBeenCalled();
  //     expect(component['makeFormDirty']).not.toHaveBeenCalled();
  //   });

  //   it('should not send update event for non verified products when form not valid and mark form-field as dirty', () => {
  //     spyOn<any>(component, 'makeFormDirty');
  //     spyOn<any>(component['verify'], 'emit');
  //     component.itemForm = new FormGroup({
  //       test: new FormControl(null, Validators.required)
  //     });
  //     component.isVerified = false;

  //     component.verifyItem();

  //     expect(component['verify'].emit).not.toHaveBeenCalled();
  //     expect(component['makeFormDirty']).toHaveBeenCalled();
  //   });

  //   it('should send update event for non verified products when form is valid', () => {
  //     spyOn<any>(component, 'makeFormDirty');
  //     spyOn<any>(component['verify'], 'emit');
  //     component.itemForm = new FormGroup({});
  //     component.isVerified = false;

  //     component.verifyItem();

  //     expect(component['verify'].emit).toHaveBeenCalled();
  //     expect(component['makeFormDirty']).not.toHaveBeenCalled();
  //   });

  //   it('should show verify button for non verified items', () => {
  //     component.isVerified = false;

  //     fixture.detectChanges();

  //     expect(page.verifyButton).not.toBeNull();
  //   });

  //   it('should not show verify button for verified items', () => {
  //     component.isVerified = true;

  //     fixture.detectChanges();

  //     expect(page.verifyButton).toBeNull();
  //   });

  //   it('should call verify item on click', () => {
  //     component.isVerified = false;
  //     spyOn(component, 'verifyItem');

  //     fixture.detectChanges();
  //     page.verifyButton.triggerEventHandler('click', null);

  //     expect(component.verifyItem).toHaveBeenCalled();
  //   });
  // });

  // describe('createItemPayload', () => {
  //   it('should return object of type StockReceiveItemToUpdate', () => {
  //     component.item.binGroupCode = 'DISPUTE';
  //     component.itemForm = component['createForm'](component.item);

  //     const result = component['createItemPayload']();

  //     expect(result.id).toEqual(component.item.id);
  //     expect(result.actualDetails).toBeDefined();
  //     expect(result.newUpdate).toBeDefined();
  //   });

  //   it('should set remarks only incase of defective product', () => {
  //     component.item.binGroupCode = 'DEFECTIVE';
  //     component.itemForm = component['createForm'](component.item);
  //     const expected = component.itemForm.get('remarkGroupCode').value;

  //     const actual = component['createItemPayload']().newUpdate.remarks;

  //     expect(actual).toEqual(expected);
  //   });
  // });

  // describe('measuredWeightChange', () => {
  //   it('should call weightFormatter twice ', () => {
  //     component.itemForm = component['createForm'](component.item);
  //     spyOn(component['weightFormatter'], 'format').and.returnValue(0);

  //     component.measuredWeightChange();

  //     expect(component['weightFormatter'].format).toHaveBeenCalledTimes(2);
  //   });

  //   it('should patch the formatted value', () => {
  //     component.itemForm = component['createForm'](component.item);
  //     const expected = 1000;
  //     spyOn(component['weightFormatter'], 'format').and.returnValue(expected);
  //     spyOn(component.itemForm, 'patchValue');

  //     component.measuredWeightChange();

  //     expect(component.itemForm.patchValue).toHaveBeenCalledWith({
  //       measuredWeight: expected
  //     });
  //   });

  //   it('should send validate event for new input value', () => {
  //     component.itemForm = component['createForm'](component.item);
  //     component['prevMeasuredWeight'] = 1001;
  //     spyOn(component['weightFormatter'], 'format').and.returnValue(1000);
  //     spyOn<any>(component['validate'], 'emit');

  //     component.measuredWeightChange();

  //     expect(component['validate'].emit).toHaveBeenCalled();
  //   });

  //   it('should not send validate event for same input value', () => {
  //     component.itemForm = component['createForm'](component.item);
  //     component['prevMeasuredWeight'] = 1000;
  //     spyOn(component['weightFormatter'], 'format').and.returnValue(1000);

  //     spyOn<any>(component['validate'], 'emit');

  //     component.measuredWeightChange();

  //     expect(component['validate'].emit).not.toHaveBeenCalled();
  //   });

  //   it('should call measuredWeightChange on blur of measuredWeight input box', () => {
  //     spyOn(component, 'measuredWeightChange');

  //     fixture.detectChanges();
  //     page.measuredWeightInputBox.triggerEventHandler('blur', null);

  //     expect(component.measuredWeightChange).toHaveBeenCalled();
  //   });
  // });

  // describe('remarks selection', () => {
  //   it('should not show remarks selection if binGroupupCode is not DEFECTIVE', () => {
  //     component.item.binGroupCode = 'STN';

  //     fixture.detectChanges();

  //     expect(page.remarksSelection).toBeNull();
  //   });

  //   it('should show remarks selection if binGroupupCode is  DEFECTIVE', () => {
  //     component.item.binGroupCode = 'DEFECTIVE';

  //     fixture.detectChanges();

  //     expect(page.remarksSelection).not.toBeNull();
  //   });

  //   it('should call update item on selection change', () => {
  //     component.item.binGroupCode = 'DEFECTIVE';
  //     spyOn(component, 'updateItem');

  //     fixture.detectChanges();
  //     page.remarksSelection.triggerEventHandler('selectionChange', null);

  //     expect(component.updateItem).toHaveBeenCalled();
  //   });
  // });
})
