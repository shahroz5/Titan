import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  HelperFunctions,
  TEMPLATE19
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  LocationApiKeyEnum,
  LocationMasterDetails,
  LocationTypeLists,
  OverlayNotificationServiceAbstraction,
  StateTypes
} from '@poss-web/shared/models';
import {
  PrintDetailsModel,
  PrintMainFormModel,
  PrintWastageModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-print-form',
  template: `
    <poss-web-dynamic-form
      *ngIf="formFields"
      [style]="currentStyle"
      [formFields]="formFields"
      [disabled]="false"
      [enableSubmitOnInvalid]="true"
      [buttonNames]="['pw.locationMaster.cancel', 'pw.locationMaster.save']"
      (onFormSubmit)="addButton($event)"
      (onFormCancel)="deleteButton($event)"
      (invalidForm)="invalidForm($event)"
      (formGroupCreated)="formGroupCreated($event)"
    >
    </poss-web-dynamic-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private cdr: ChangeDetectorRef,
    private helperFunctions: HelperFunctions,
    public dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  @Input() locationDetails: LocationMasterDetails;
  @Input() invoiceType: StateTypes[];
  @Output() formOutput = new EventEmitter<LocationMasterDetails>();

  destroy$: Subject<null> = new Subject<null>();

  public formFields: any;
  public currentStyle: string[];

  ngOnInit(): void {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  prepareSet() {
    const printCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.printWastage',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printWastageComponent
            ? this.locationDetails.printDetails.data.printWastageComponent
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.printWastagePercent',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printWastagePercent
            ? this.locationDetails.printDetails.data.printWastagePercent
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.pritnWastageCharge',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printWastageCharge
            ? this.locationDetails.printDetails.data.printWastageCharge
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.printStoneValue',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printStoneValue
            ? this.locationDetails.printDetails.data.printStoneValue
            : false
          : false
      },
      {
        id: '5',
        name: 'pw.locationMaster.printGoldValue',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printGoldValue
            ? this.locationDetails.printDetails.data.printGoldValue
            : false
          : false
      },
      {
        id: '6',
        name: 'pw.locationMaster.printPrice',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printPrice
            ? this.locationDetails.printDetails.data.printPrice
            : false
          : false
      },
      {
        id: '7',
        name: 'pw.locationMaster.printmakingWastageCharges',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.isMCAndWastage
            ? this.locationDetails.printDetails.data.isMCAndWastage
            : false
          : false
      }
    ];

    const printWastageModel = new PrintWastageModel(
      1,
      printCheckbox,
      this.locationDetails.printDetails
        ? this.locationDetails.printDetails.data.mcOrWastageExpense
          ? this.locationDetails.printDetails.data.mcOrWastageExpense
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const printDetailsCheckbox1: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.displayWastagePercentage',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.isDisplayWastagePercent
            ? this.locationDetails.printDetails.data.isDisplayWastagePercent
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.variablePricingEnabled',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.isVariablePrice
            ? this.locationDetails.printDetails.data.isVariablePrice
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.printmakingCharges',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printMakingCharges
            ? this.locationDetails.printDetails.data.printMakingCharges
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.printCustomerNoinreport',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printCustomerNumberinReport
            ? this.locationDetails.printDetails.data.printCustomerNumberinReport
            : false
          : false
      },
      {
        id: '5',
        name: 'pw.locationMaster.printCashMemo',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printCashMemo
            ? this.locationDetails.printDetails.data.printCashMemo
            : false
          : false
      },
      {
        id: '6',
        name: 'pw.locationMaster.printGuaranteeCard',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printGuaranteeCard
            ? this.locationDetails.printDetails.data.printGuaranteeCard
            : false
          : false
      },
      {
        id: '6',
        name: 'pw.locationMaster.printStoneGuaranteeCard',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data
              .printOtherStoneWtinGuaranteeCard
            ? this.locationDetails.printDetails.data
                .printOtherStoneWtinGuaranteeCard
            : false
          : false
      },
      {
        id: '7',
        name: 'pw.locationMaster.printStoneAnnexure',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data
              .printOtherStoneWeightinAnnexure
            ? this.locationDetails.printDetails.data
                .printOtherStoneWeightinAnnexure
            : false
          : false
      }
    ];

    if (this.locationDetails?.printDetails?.data?.invoiceType) {
      this.invoiceType = this.helperFunctions.patchValue(
        this.invoiceType,
        'id',
        'selected',
        this.locationDetails.printDetails.data.invoiceType,
        true
      );
    }

    const printDetailsCheckbox2: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.printImage',
        checked: this.locationDetails.printDetails
          ? this.locationDetails.printDetails.data.printImage
            ? this.locationDetails.printDetails.data.printImage
            : false
          : false
      }
    ];

    const printDetailsModel = new PrintDetailsModel(
      1,
      this.locationDetails.printDetails
        ? this.locationDetails.printDetails.data.freeTextForGrams
          ? this.locationDetails.printDetails.data.freeTextForGrams
          : ''
        : '',
      this.locationDetails.printDetails
        ? this.locationDetails.printDetails.data
            .noOfInvoicecopiesforRegularOrQuickCM
          ? this.locationDetails.printDetails.data
              .noOfInvoicecopiesforRegularOrQuickCM
          : ''
        : '',
      this.invoiceType,
      printDetailsCheckbox1,
      printDetailsCheckbox2,
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new PrintMainFormModel(
      1,
      printWastageModel,
      printDetailsModel
    );

    return detailsmain;
  }

  getCssProp() {
    return [];
  }

  public getInputs(form: any) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }

  public setFormConfig() {
    return {
      formName: 'pw.locationMaster.print',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,
      printDetails: {
        type: LocationApiKeyEnum.PRINT_DETAILS,
        data: {
          freeTextForGrams: formData['1-printDetails']['1-freeTextForGrams'],
          noOfInvoicecopiesforRegularOrQuickCM:
            formData['1-printDetails']['1-invoiceCopies'],
          invoiceType: formData['1-printDetails']['1-printDetailsSelect'],
          mcOrWastageExpense: formData['1-printWastage']['1-makingCharges'],
          printWastageComponent:
            formData['1-printWastage']['1-printCheckbox'][0],
          printWastagePercent: formData['1-printWastage']['1-printCheckbox'][1],
          printWastageCharge: formData['1-printWastage']['1-printCheckbox'][2],
          printStoneValue: formData['1-printWastage']['1-printCheckbox'][3],
          printGoldValue: formData['1-printWastage']['1-printCheckbox'][4],
          printPrice: formData['1-printWastage']['1-printCheckbox'][5], // check
          isMCAndWastage: formData['1-printWastage']['1-printCheckbox'][6],

          isDisplayWastagePercent:
            formData['1-printDetails']['1-printDetailsCheckbox1'][0],
          isVariablePrice:
            formData['1-printDetails']['1-printDetailsCheckbox1'][1],
          printMakingCharges:
            formData['1-printDetails']['1-printDetailsCheckbox1'][2],
          printCustomerNumberinReport:
            formData['1-printDetails']['1-printDetailsCheckbox1'][3],
          printCashMemo:
            formData['1-printDetails']['1-printDetailsCheckbox1'][4],
          printGuaranteeCard:
            formData['1-printDetails']['1-printDetailsCheckbox1'][5],
          printOtherStoneWtinGuaranteeCard:
            formData['1-printDetails']['1-printDetailsCheckbox1'][6],
          printOtherStoneWeightinAnnexure:
            formData['1-printDetails']['1-printDetailsCheckbox1'][7],
          printImage: formData['1-printDetails']['1-printDetailsCheckbox2'][0]
        }
      }
    };

    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.formOutput.emit(locationDetails);
        }
      });
  }

  public deleteButton() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.cancelConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.ngOnDestroy();
          this.destroy$ = new Subject<null>();
          this.ngOnInit();
          this.cdr.detectChanges();
        }
      });
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.locationDetails.locationTypeCode === LocationTypeLists.BTQ) {
      this.helperFunctions.setConditionalValidators(
        formGroup,
        '1-printDetails',
        '1-printDetailsSelect',
        [
          this.fieldValidatorsService.requiredField(
            'pw.locationMaster.invoiceType'
          ),
          Validators.required
        ]
      );
    } else {
      this.helperFunctions.setConditionalValidators(
        formGroup,
        '1-printDetails',
        '1-printDetailsSelect',
        []
      );
    }
    formGroup.get('1-printWastage').get('1-printCheckbox').get('0').disable();
    formGroup.get('1-printWastage').get('1-printCheckbox').get('2').disable();
  }

  invalidForm($event: boolean) {
    if ($event) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.inventoryMasters.invalidAlert'
      });

    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
