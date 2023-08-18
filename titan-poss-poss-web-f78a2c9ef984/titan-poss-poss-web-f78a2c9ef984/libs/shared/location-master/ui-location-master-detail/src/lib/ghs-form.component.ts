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
  GhsFormDetailsModel,
  GhsMainFormModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-ghs-form',
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
export class GhsFormComponent implements OnInit, OnDestroy {
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
    const ghsDetailsCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.EnableGrammagecreditnotetransfer',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data.grammageCNTransfer
            ? this.locationDetails.ghsDetails.data.grammageCNTransfer
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.consentLetter',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data.isConsentLetterUploadMandatory
            ? this.locationDetails.ghsDetails.data
                .isConsentLetterUploadMandatory
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.IsclubbingofGHSaccountsrestricted',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data.isClubbingGHSAccRestricted
            ? this.locationDetails.ghsDetails.data.isClubbingGHSAccRestricted
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.IseGHSmandatory',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data.isEghsMandatory
            ? this.locationDetails.ghsDetails.data.isEghsMandatory
            : false
          : false
      },
      // {
      //   id: '5',
      //   name: 'pw.locationMaster.IsOTPRequiredForGHS',
      //   checked: this.locationDetails.ghsDetails
      //     ? this.locationDetails.ghsDetails.data.isOtpRequired
      //       ? this.locationDetails.ghsDetails.data.isOtpRequired
      //       : false
      //     : false
      // },
      {
        id: '6',
        name: 'pw.locationMaster.isGHSRedemptionAllowed',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data.isGHSRedemptionAllowed
            ? this.locationDetails.ghsDetails.data.isGHSRedemptionAllowed
            : false
          : false
      },
      {
        id: '7',
        name: 'pw.locationMaster.isAllowedToClubRivaahGhsAndGhs',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data.isAllowedToClubRivahGhsAndGhs
            ? this.locationDetails.ghsDetails.data.isAllowedToClubRivahGhsAndGhs
            : false
          : false
      },
      {
        id: '8',
        name: 'pw.locationMaster.canClubMultipleAccountOfSameCategory',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data
              .isAllowedToClubAccountsOfSameScheme
            ? this.locationDetails.ghsDetails.data
                .isAllowedToClubAccountsOfSameScheme
            : false
          : false
      },
      {
        id: '9',
        name: 'pw.locationMaster.canClubMultipleAccountOfDiffrentPlanCategory',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data
              .isAlowedToClubAccountsOfDiffCategory
            ? this.locationDetails.ghsDetails.data
                .isAlowedToClubAccountsOfDiffCategory
            : false
          : false
      },
      {
        id: '10',
        name: 'pw.locationMaster.isUploadMandatoryforGHSWithoutOTP',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data
              .isUploadMandatoryforGHSWithoutOTP
            ? this.locationDetails.ghsDetails.data
                .isUploadMandatoryforGHSWithoutOTP
            : false
          : false
      },
      {
        id: '11',
        name: 'pw.locationMaster.isAllowedToClubRivaahGhsAndGrammage',
        checked: this.locationDetails.ghsDetails
          ? this.locationDetails.ghsDetails.data
              .isAllowedToClubRivahGhsAndGrammage
            ? this.locationDetails.ghsDetails.data
                .isAllowedToClubRivahGhsAndGrammage
            : false
          : false
      }
    ];

    const ghsFormDetailsModel = new GhsFormDetailsModel(
      1,
      this.locationDetails.ghsDetails
        ? this.locationDetails.ghsDetails.data.noOfDaysForSuspendingGhs
          ? this.locationDetails.ghsDetails.data.noOfDaysForSuspendingGhs
          : ''
        : '',
      this.locationDetails.ghsDetails
        ? this.locationDetails.ghsDetails.data.gracePeriodAfterSuspenededGhs
          ? this.locationDetails.ghsDetails.data.gracePeriodAfterSuspenededGhs
          : ''
        : '',
      this.locationDetails.ghsDetails
        ? this.locationDetails.ghsDetails.data.consolidateAttempts
          ? this.locationDetails.ghsDetails.data.consolidateAttempts
          : ''
        : '',
      this.locationDetails.ghsDetails
        ? this.locationDetails.ghsDetails.data.noOfDaysToBlockCustomerConfig
          ? this.locationDetails.ghsDetails.data.noOfDaysToBlockCustomerConfig
          : ''
        : '',
      this.locationDetails.ghsDetails
        ? this.locationDetails.ghsDetails.data.noOfDaysToBlockAdvanceBooking
          ? this.locationDetails.ghsDetails.data.noOfDaysToBlockAdvanceBooking
          : ''
        : '',
      ghsDetailsCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new GhsMainFormModel(1, ghsFormDetailsModel);

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
      formName: 'pw.locationMaster.GHS',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,

      ghsDetails: {
        type: LocationApiKeyEnum.GHS_DETAILS,
        data: {
          grammageCNTransfer:
            formData['1-GhsDetails']['1-ghsDetailsCheckbox'][0],
          isConsentLetterUploadMandatory:
            formData['1-GhsDetails']['1-ghsDetailsCheckbox'][1],
          isClubbingGHSAccRestricted:
            formData['1-GhsDetails']['1-ghsDetailsCheckbox'][2],
          isEghsMandatory: formData['1-GhsDetails']['1-ghsDetailsCheckbox'][3],
          // isOtpRequired: formData['1-GhsDetails']['1-ghsDetailsCheckbox'][4],
          isGHSRedemptionAllowed:
            formData['1-GhsDetails']['1-ghsDetailsCheckbox'][4],
          isAllowedToClubRivahGhsAndGhs:
            formData['1-GhsDetails']['1-ghsDetailsCheckbox'][5],
          isAllowedToClubAccountsOfSameScheme:
            formData['1-GhsDetails']['1-ghsDetailsCheckbox'][6],
          isAlowedToClubAccountsOfDiffCategory:
            formData['1-GhsDetails']['1-ghsDetailsCheckbox'][7],
          noOfDaysForSuspendingGhs:
            formData['1-GhsDetails']['1-daysSuspendingGHS'],
          consolidateAttempts: formData['1-GhsDetails']['1-MaxGHSRevenue'],
          gracePeriodAfterSuspenededGhs:
            formData['1-GhsDetails']['1-gracePeriod'],
          noOfDaysToBlockCustomerConfig:
            formData['1-GhsDetails']['1-daysToBlockCustomerOrder'],
          noOfDaysToBlockAdvanceBooking:
            formData['1-GhsDetails']['1-daysToBlockAdvanceBooking'],
          isUploadMandatoryforGHSWithoutOTP:
            formData['1-GhsDetails']['1-ghsDetailsCheckbox'][8],
          isAllowedToClubRivahGhsAndGrammage:
            formData['1-GhsDetails']['1-ghsDetailsCheckbox'][9]
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
        .get('pw.locationMaster.suspendingGhs')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-GhsDetails',
            '1-daysSuspendingGHS',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.GHSRevenueConsolidate')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-GhsDetails',
            '1-MaxGHSRevenue',
            [
              this.fieldValidatorsService.numbersField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
    } else {
      this.translateService
        .get('pw.locationMaster.suspendingGhs')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-GhsDetails',
            '1-daysSuspendingGHS',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.GHSRevenueConsolidate')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-GhsDetails',
            '1-MaxGHSRevenue',
            [this.fieldValidatorsService.numbersField(fieldNameTranslate)]
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
