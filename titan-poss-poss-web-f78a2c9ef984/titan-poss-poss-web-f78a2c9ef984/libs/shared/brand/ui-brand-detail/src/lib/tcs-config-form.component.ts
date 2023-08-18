import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TEMPLATE19 } from '@poss-web/shared/components/ui-dynamic-form';
import {
  BrandMasterDetails,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  TcsConfigApplicableRatesDummyModel,
  TcsConfigApplicableRatesInstitutionalModel,
  TcsConfigApplicableRatesInternationalModel,
  TcsConfigApplicableRatesRegularWithoutPanModel,
  TcsConfigApplicableRatesRegularWithPanModel,
  TcsConfigGrnConfigModel,
  TcsConfigMainFormModel,
  TcsConfigModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tcs-config-form',
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
  styles: []
})
export class TcsConfigFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  @Input() brandMasterDetails: BrandMasterDetails;
  @Output() formOutput = new EventEmitter<BrandMasterDetails>();

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
    console.log(this.brandMasterDetails);
    const tcsConfig_radio = [
      {
        id: '1',
        name: 'TCS Based on Mobile',
        checked: this.brandMasterDetails?.brandTcsDetails
          ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
            ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
                .tcsBasedOnMobileNumber
            : false
          : false
      },
      {
        id: '2',
        name: 'TCS Based on ULP ID',
        checked: this.brandMasterDetails?.brandTcsDetails
          ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
            ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
                .tcsBasedOnUlpNumber
            : false
          : false
      }
    ];

    const tcsConfigModel = new TcsConfigModel(
      1,
      tcsConfig_radio,
      this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableAmount
        ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
            ?.tcsApplicableAmount
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const tcsConfigApplicableRatesRegularWithPanModel = new TcsConfigApplicableRatesRegularWithPanModel(
      1,
      this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates
        ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates?.find(
            val => val.type === 'REGULAR' && val.isPanAvailable
          )?.percent
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const tcsConfigApplicableRatesRegularWithoutPanModel = new TcsConfigApplicableRatesRegularWithoutPanModel(
      1,
      this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates
        ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates?.find(
            val => val.type === 'REGULAR' && val.isPanAvailable === false
          )?.percent
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const tcsApplicableRatesDummy_checkBox = [
      {
        id: '1',
        name: 'Is PAN Available',
        checked: this.brandMasterDetails?.brandTcsDetails
          ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
              ?.tcsApplicableRates
            ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates.find(
                val => val.type === 'ONETIME'
              )?.isPanAvailable
            : false
          : false
      }
    ];

    const tcsConfigApplicableRatesDummyModel = new TcsConfigApplicableRatesDummyModel(
      1,
      this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates
        ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates.find(
            val => val.type === 'ONETIME'
          )?.percent
        : '',
      tcsApplicableRatesDummy_checkBox,
      this.fieldValidatorsService,
      this.translateService
    );

    const tcsApplicableRatesInstitutional_checkBox = [
      {
        id: '1',
        name: 'Is PAN Available',
        // checked: this.brandMasterDetails?.brandTcsDetails
        //   ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
        //       ?.tcsApplicableRates
        //     ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates.find(
        //         val => val.type === 'INSTITUTIONAL'
        //       )?.isPanAvailable
        //     : false
        //   : false
        checked: false
      }
    ];

    const tcsConfigApplicableRatesInstitutionalModel = new TcsConfigApplicableRatesInstitutionalModel(
      1,
      this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates
        ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates.find(
            val => val.type === 'INSTITUTIONAL'
          )?.percent
        : '',
      tcsApplicableRatesInstitutional_checkBox,
      this.fieldValidatorsService,
      this.translateService
    );

    const tcsApplicableRatesInternational_checkBox = [
      {
        id: '1',
        name: 'Is PAN Available',
        checked: this.brandMasterDetails?.brandTcsDetails
          ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
              ?.tcsApplicableRates
            ? this.brandMasterDetails?.brandTcsDetails?.data.b2c.tcsApplicableRates.find(
                val => val.type === 'INTERNATIONAL'
              )?.isPanAvailable
            : false
          : false
      }
    ];

    const tcsConfigApplicableRatesInternationalModel = new TcsConfigApplicableRatesInternationalModel(
      1,
      this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.tcsApplicableRates
        ? this.brandMasterDetails?.brandTcsDetails?.data.b2c.tcsApplicableRates.find(
            val => val.type === 'INTERNATIONAL'
          )?.percent
        : '',
      tcsApplicableRatesInternational_checkBox,
      this.fieldValidatorsService,
      this.translateService
    );

    const tcsReverseInCaseOfGRN_checkBox = [
      {
        id: '1',
        name: 'Reverse in case of GRN',
        checked: this.brandMasterDetails?.brandTcsDetails
          ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.grnConfig
              ?.tcsReverseInCaseOfGRN
            ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.grnConfig
                ?.tcsReverseInCaseOfGRN
            : false
          : false
      }
    ];
    const tcsReverseForInterboutiqueGRN_checkBox = [
      {
        id: '1',
        name: 'Reverse for Interboutique GRN',
        checked: this.brandMasterDetails?.brandTcsDetails
          ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.grnConfig
              ?.tcsReverseForInterboutiqueGRN
            ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.grnConfig
                ?.tcsReverseForInterboutiqueGRN
            : false
          : false
      }
    ];

    const tcsReverseForGRnDate_radio = [
      {
        id: '1',
        name: 'Same Month',
        checked: this.brandMasterDetails?.brandTcsDetails
          ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
            ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.grnConfig
                ?.tcsReverseForGRnDate.sameMonth
            : false
          : false
      },
      {
        id: '2',
        name: 'After Calender Month',
        checked: this.brandMasterDetails?.brandTcsDetails
          ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c
            ? this.brandMasterDetails?.brandTcsDetails?.data?.b2c?.grnConfig
                ?.tcsReverseForGRnDate.afterCalanderMonth
            : false
          : false
      }
    ];

    const tcsConfigGrnConfigModel = new TcsConfigGrnConfigModel(
      1,
      tcsReverseInCaseOfGRN_checkBox,
      tcsReverseForGRnDate_radio,
      tcsReverseForInterboutiqueGRN_checkBox,
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new TcsConfigMainFormModel(
      1,
      tcsConfigModel,
      tcsConfigApplicableRatesRegularWithPanModel,
      tcsConfigApplicableRatesRegularWithoutPanModel,
      tcsConfigApplicableRatesDummyModel,
      tcsConfigApplicableRatesInstitutionalModel,
      tcsConfigApplicableRatesInternationalModel,
      tcsConfigGrnConfigModel
    );

    return detailsmain;
  }

  getCssProp() {
    // const annot = (LocationFormComponent as any).__annotations__;
    // return annot[0].styles;

    return [`.pw-form-card__flex-3-column{ height:auto !important; }`];
  }

  public getInputs(form: any) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }

  public setFormConfig() {
    return {
      formName: 'pw.brandMaster.tcsConfiguration',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();
    console.log(formData);
    const brandDetails: BrandMasterDetails = {
      brandCode: this.brandMasterDetails.brandCode,
      brandTcsDetails: {
        type: 'TCS_DETAILS',
        data: {
          b2b: null,
          b2c: {
            tcsApplicableAmount:
              formData['1-tcsConfigModel']['1-tcsApplicableAmount'],
            tcsBasedOnMobileNumber:
              formData['1-tcsConfigModel'][
                '1-tcsBasedOnMobileNumberOrUlpNumberRadio'
              ] === '1',
            tcsBasedOnUlpNumber:
              formData['1-tcsConfigModel'][
                '1-tcsBasedOnMobileNumberOrUlpNumberRadio'
              ] === '2',
            tcsApplicableRates: [
              {
                type: 'REGULAR',
                isPanAvailable: true,
                isForm60Available: false,
                percent:
                  formData['1-tcsConfigApplicableRatesRegularWithPanModel'][
                    '1-tcsApplicableRatesPanCardPercentRegular'
                  ]
              },
              {
                type: 'REGULAR',
                isPanAvailable: false,
                isForm60Available: true,
                percent:
                  formData['1-tcsConfigApplicableRatesRegularWithoutPanModel'][
                    '1-tcsApplicableRatesPanCardPercentRegular'
                  ]
              },
              {
                type: 'ONETIME',
                isPanAvailable:
                  formData['1-tcsConfigApplicableRatesDummyModel'][
                    '1-tcsApplicableRatesRegular_checkBox'
                  ][0],
                isForm60Available: false,
                percent:
                  formData['1-tcsConfigApplicableRatesDummyModel'][
                    '1-tcsApplicableRatesPanCardPercentRegular'
                  ]
              },
              {
                type: 'INSTITUTIONAL',
                isPanAvailable:
                  formData['1-tcsConfigApplicableRatesInstitutionalModel'][
                    '1-tcsApplicableRatesRegular_checkBox'
                  ][0],
                isForm60Available: false,
                percent:
                  formData['1-tcsConfigApplicableRatesInstitutionalModel'][
                    '1-tcsApplicableRatesPanCardPercentRegular'
                  ]
              },
              {
                type: 'INTERNATIONAL',
                isPanAvailable:
                  formData['1-tcsConfigApplicableRatesInternationalModel'][
                    '1-tcsApplicableRatesRegular_checkBox'
                  ][0],
                isForm60Available: false,
                percent:
                  formData['1-tcsConfigApplicableRatesInternationalModel'][
                    '1-tcsApplicableRatesPanCardPercentRegular'
                  ]
              }
            ],
            grnConfig: {
              tcsReverseForGRnDate: {
                sameMonth:
                  formData['1-tcsConfigGrnConfigModel'][
                    '1-tcsReverseForGRnDate_radio'
                  ] === '1',
                afterCalanderMonth:
                  formData['1-tcsConfigGrnConfigModel'][
                    '1-tcsReverseForGRnDate_radio'
                  ] === '2'
              },

              tcsReverseForInterboutiqueGRN:
                formData['1-tcsConfigGrnConfigModel'][
                  '1-tcsReverseForInterboutiqueGRN_checkBox'
                ][0],
              tcsReverseInCaseOfGRN:
                formData['1-tcsConfigGrnConfigModel'][
                  '1-tcsReverseInCaseOfGRN_checkBox'
                ][0]
            }
          }
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
          this.formOutput.emit(brandDetails);
        }
      });
  }

  public formGroupCreated(form: FormGroup) {
    // if (this.locationDetails.factoryCodeValue === LocationTypeLists.BTQ) {
    //   this.helperFunctions.setRequiredValidators(
    //     formGroup,
    //     '1-otpDetailsModel',
    //     '1-helpdeskEmailId',
    //     true
    //   );
    // } else {
    //   this.helperFunctions.setRequiredValidators(
    //     formGroup,
    //     '1-otpDetailsModel',
    //     '1-helpdeskEmailId',
    //     false
    //   );
    // }
    form
      .get('1-tcsConfigApplicableRatesInstitutionalModel')
      .get('1-tcsApplicableRatesRegular_checkBox')
      .disable({ onlySelf: true });
  }

  invalidForm($event: boolean) {
    if ($event) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.inventoryMasters.invalidAlert'
      });
      // const dialogRef = this.dialog.open(ValidationAlertDialogComponent, {
      //   width: '500px',
      //   height: 'auto',
      //   disableClose: true,
      //   data: 'pw.inventoryMasters.invalidAlert'
      // });
      // dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  public deleteButton() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.inventoryMasters.cancelConfirmation'
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
