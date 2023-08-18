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
  LocationTypeLists
} from '@poss-web/shared/models';
import {
  OtpDetailsModel,
  OtpMainFormModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-otp-form',
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
export class OtpFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private cdr: ChangeDetectorRef,
    private helperFunctions: HelperFunctions,
    private fieldValidatorsService: FieldValidatorsService,
    public dialog: MatDialog
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
    const otpDetailsCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.isOTPallowedASSM?',
        checked: this.locationDetails.otpDetails
          ? this.locationDetails.otpDetails.data.isOTPallowedASSM
            ? this.locationDetails.otpDetails.data.isOTPallowedASSM
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.isOTPallowedCM?',
        checked: this.locationDetails.otpDetails
          ? this.locationDetails.otpDetails.data.isOTPallowedCM
            ? this.locationDetails.otpDetails.data.isOTPallowedCM
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.isOTPallowedAdvance?',
        checked: this.locationDetails.otpDetails
          ? this.locationDetails.otpDetails.data.isOTPallowedAdvance
            ? this.locationDetails.otpDetails.data.isOTPallowedAdvance
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.isOTPallowedAB?',
        checked: this.locationDetails.otpDetails
          ? this.locationDetails.otpDetails.data.isOTPallowedAB
            ? this.locationDetails.otpDetails.data.isOTPallowedAB
            : false
          : false
      },
      {
        id: '5',
        name: 'pw.locationMaster.isOTPallowedGHS?',
        checked: this.locationDetails.otpDetails
          ? this.locationDetails.otpDetails.data.isOTPallowedGHS
            ? this.locationDetails.otpDetails.data.isOTPallowedGHS
            : false
          : false
      },
      {
        id: '6',
        name: 'pw.locationMaster.isOTPallowedCO?',
        checked: this.locationDetails.otpDetails
          ? this.locationDetails.otpDetails.data.isOTPallowedCO
            ? this.locationDetails.otpDetails.data.isOTPallowedCO
            : false
          : false
      },
      {
        id: '7',
        name: 'pw.locationMaster.isOTPrequiredforGC?',
        checked: this.locationDetails.otpDetails
          ? this.locationDetails.otpDetails.data.isOTPrequiredforGC
            ? this.locationDetails.otpDetails.data.isOTPrequiredforGC
            : false
          : false
      },
      {
        id: '8',
        name: 'pw.locationMaster.IsOTPRequiredForGHS',
        checked: this.locationDetails.otpDetails
          ? this.locationDetails.otpDetails.data.isOTPrequiredforGHSRedemption
            ? this.locationDetails.otpDetails.data.isOTPrequiredforGHSRedemption
            : false
          : false
      }
    ];

    const otpDetailsModel = new OtpDetailsModel(
      1,
      otpDetailsCheckbox,
      this.locationDetails.otpDetails
        ? this.locationDetails.otpDetails.data.otpHelpDeskEmailId
          ? this.locationDetails.otpDetails.data.otpHelpDeskEmailId
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new OtpMainFormModel(1, otpDetailsModel);

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
      formName: 'pw.locationMaster.OTP',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,

      otpDetails: {
        type: LocationApiKeyEnum.OTP_DETAILS,
        data: {
          isOTPallowedASSM:
            formData['1-otpDetailsModel']['1-otpDetailsCheckbox'][0],
          isOTPallowedCM:
            formData['1-otpDetailsModel']['1-otpDetailsCheckbox'][1],
          isOTPallowedAdvance:
            formData['1-otpDetailsModel']['1-otpDetailsCheckbox'][2],
          isOTPallowedAB:
            formData['1-otpDetailsModel']['1-otpDetailsCheckbox'][3],
          isOTPallowedGHS:
            formData['1-otpDetailsModel']['1-otpDetailsCheckbox'][4],
          isOTPallowedCO:
            formData['1-otpDetailsModel']['1-otpDetailsCheckbox'][5],
          isOTPrequiredforGC:
            formData['1-otpDetailsModel']['1-otpDetailsCheckbox'][6],
          isOTPrequiredforGHSRedemption:
            formData['1-otpDetailsModel']['1-otpDetailsCheckbox'][7],
          otpHelpDeskEmailId: formData['1-otpDetailsModel']['1-helpdeskEmailId']
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

  public formGroupCreated(formGroup: FormGroup) {
    if (this.locationDetails.locationTypeCode === LocationTypeLists.BTQ) {
      this.translateService
        .get('pw.locationMaster.otpEmail')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-otpDetailsModel',
            '1-helpdeskEmailId',
            [
              this.fieldValidatorsService.emailField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
    } else {
      this.translateService
        .get('pw.locationMaster.otpEmail')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-otpDetailsModel',
            '1-helpdeskEmailId',
            [this.fieldValidatorsService.emailField(fieldNameTranslate)]
          );
        });
    }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
