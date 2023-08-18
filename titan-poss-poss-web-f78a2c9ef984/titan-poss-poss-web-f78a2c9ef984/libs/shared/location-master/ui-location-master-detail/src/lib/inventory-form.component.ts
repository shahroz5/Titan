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
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  InventoryASSMModel,
  InventoryDetailsModel,
  InventoryMainFormModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-inventory-form',
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
export class InventoryFormComponent implements OnInit, OnDestroy {
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
    // ---------------------
    const inventoryDetailsCheckbox1 = [
      {
        id: '1',
        name: 'pw.locationMaster.issueToFactory',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isIssueToFactory
            ? this.locationDetails.inventoryDetails.data.isIssueToFactory
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.issueToMerchandise',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isIssueToMerchandise
            ? this.locationDetails.inventoryDetails.data.isIssueToMerchandise
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.issueToOtherBtq',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isIssueToOtherBoutique
            ? this.locationDetails.inventoryDetails.data.isIssueToOtherBoutique
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.issueTEP',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isIssueToTEP
            ? this.locationDetails.inventoryDetails.data.isIssueToTEP
            : false
          : false
      },
      {
        id: '5',
        name: 'pw.locationMaster.issueGEP',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isIssueToGEP
            ? this.locationDetails.inventoryDetails.data.isIssueToGEP
            : false
          : false
      },
      {
        id: '6',
        name: 'pw.locationMaster.issueDefectDispute',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isIssueDefective
            ? this.locationDetails.inventoryDetails.data.isIssueDefective
            : false
          : false
      },
      {
        id: '7',
        name: 'pw.locationMaster.issueothers',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isIssueOthers
            ? this.locationDetails.inventoryDetails.data.isIssueOthers
            : false
          : false
      }
    ];
    const inventoryDetailsCheckbox2 = [
      {
        id: '1',
        name: 'pw.locationMaster.isConversionRestricted',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isConversionRestricted
            ? this.locationDetails.inventoryDetails.data.isConversionRestricted
            : false
          : false
      }
    ];
    const inventoryDetailsCheckbox3 = [
      {
        id: '1',
        name: 'pw.locationMaster.isSTNCancellationAllowed',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isSTNcancellationAllowed
            ? this.locationDetails.inventoryDetails.data
                .isSTNcancellationAllowed
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.isStuddedsplitallowed',
        checked: this.locationDetails.inventoryDetails
          ? this.locationDetails.inventoryDetails.data.isStuddedSplitAllowed
            ? this.locationDetails.inventoryDetails.data.isStuddedSplitAllowed
            : false
          : false
      }
    ];

    let inventoryDetailsCheckbox4 = null;

    if (this.locationDetails.locationCode === 'UEC') {
      inventoryDetailsCheckbox4 = [
        {
          id: '1',
          name: 'pw.locationMaster.isUECLocationStockNotVisibleForIBTTransfer',
          checked: this.locationDetails.inventoryDetails
            ? this.locationDetails.inventoryDetails.data
                .isUECLocationStockNotVisibleForIBTTransfer
              ? this.locationDetails.inventoryDetails.data
                  .isUECLocationStockNotVisibleForIBTTransfer
              : false
            : false
        }
      ];
    }

    const inventoryDetailsModel = new InventoryDetailsModel(
      1,
      inventoryDetailsCheckbox1,
      this.locationDetails.inventoryDetails
        ? this.locationDetails.inventoryDetails.data
            .maximumNoOfDaysForPhysicalReceiptDate
          ? this.locationDetails.inventoryDetails.data
              .maximumNoOfDaysForPhysicalReceiptDate
          : ''
        : '',
      inventoryDetailsCheckbox2,
      this.locationDetails.inventoryDetails
        ? this.locationDetails.inventoryDetails.data
            .maximumNoOfDaysForSTNCancellation
          ? this.locationDetails.inventoryDetails.data
              .maximumNoOfDaysForSTNCancellation
          : ''
        : '',
      inventoryDetailsCheckbox3,
      this.fieldValidatorsService,
      this.translateService,
      this.locationDetails.locationCode === 'UEC'
        ? inventoryDetailsCheckbox4
        : null
    );
    // ----------------------

    // ---------------------
    const inventoryASSMModel = new InventoryASSMModel(
      1,
      this.locationDetails.inventoryDetails
        ? this.locationDetails.inventoryDetails.data
            .sparewtToleranceforStockItem
          ? this.locationDetails.inventoryDetails.data
              .sparewtToleranceforStockItem
          : ''
        : '',
      this.locationDetails.inventoryDetails
        ? this.locationDetails.inventoryDetails.data
            .servicewtToleranceforStockItem
          ? this.locationDetails.inventoryDetails.data
              .servicewtToleranceforStockItem
          : ''
        : '',
      this.locationDetails.inventoryDetails
        ? this.locationDetails.inventoryDetails.data
            .conversionwtToleranceforBangle
          ? this.locationDetails.inventoryDetails.data
              .conversionwtToleranceforBangle
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );
    // ----------------------

    const detailsmain = new InventoryMainFormModel(
      1,
      inventoryDetailsModel,
      inventoryASSMModel
    );

    return detailsmain;
  }

  getCssProp() {
    // const annot = (LocationFormComponent as any).__annotations__;
    // return annot[0].styles;

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
      formName: 'pw.locationMaster.inventory',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,

      // grammageCNTransfer: formData['1-GhsDetails']['1-ghsDetailsCheckbox'][0],

      inventoryDetails: {
        type: LocationApiKeyEnum.INVENTORY_DETAILS,
        data: {
          isIssueToFactory:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox1'
            ][0],
          isIssueToMerchandise:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox1'
            ][1],
          isIssueToOtherBoutique:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox1'
            ][2],
          isIssueToTEP:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox1'
            ][3],
          isIssueToGEP:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox1'
            ][4],
          isIssueDefective:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox1'
            ][5],
          isIssueOthers:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox1'
            ][6],
          maximumNoOfDaysForPhysicalReceiptDate:
            formData['1-inventoryDetailsModel']['1-maxDaysPhysicalReceipt'],
          maximumNoOfDaysForSTNCancellation:
            formData['1-inventoryDetailsModel']['1-maxDaysSTNCancellation'],
          isConversionRestricted:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox2'
            ][0],
          isSTNcancellationAllowed:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox3'
            ][0],
          isStuddedSplitAllowed:
            formData['1-inventoryDetailsModel'][
              '1-inventoryDetailsCheckbox3'
            ][1],
          isUECLocationStockNotVisibleForIBTTransfer:
            this.locationDetails.locationCode === 'UEC'
              ? formData['1-inventoryDetailsModel'][
                  '1-inventoryDetailsCheckbox4'
                ][0]
              : null,

          sparewtToleranceforStockItem:
            formData['1-inventoryASSMModel']['1-spareWtTolerance'],
          servicewtToleranceforStockItem:
            formData['1-inventoryASSMModel']['1-serviceWtTolerance'],
          conversionwtToleranceforBangle:
            formData['1-inventoryASSMModel']['1-conversionwtToleranceforBangle']
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
      this.translateService
        .get('pw.locationMaster.daysforphysicalReceiptdate')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-inventoryDetailsModel',
            '1-maxDaysPhysicalReceipt',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.wttoleranceforstock')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-inventoryASSMModel',
            '1-spareWtTolerance',
            [
              this.fieldValidatorsService.weightField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.servicewttoleranceforstock')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-inventoryASSMModel',
            '1-serviceWtTolerance',
            [
              this.fieldValidatorsService.weightField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.conversionwtToleranceforBangle')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-inventoryASSMModel',
            '1-conversionwtToleranceforBangle',
            [
              this.fieldValidatorsService.percentageField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
    } else {
      this.translateService
        .get('pw.locationMaster.daysforphysicalReceiptdate')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-inventoryDetailsModel',
            '1-maxDaysPhysicalReceipt',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.wttoleranceforstock')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-inventoryASSMModel',
            '1-spareWtTolerance',
            [this.fieldValidatorsService.weightField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.servicewttoleranceforstock')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-inventoryASSMModel',
            '1-serviceWtTolerance',
            [this.fieldValidatorsService.weightField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.conversionwtToleranceforBangle')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-inventoryASSMModel',
            '1-conversionwtToleranceforBangle',
            [this.fieldValidatorsService.percentageField(fieldNameTranslate)]
          );
        });
    }
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
