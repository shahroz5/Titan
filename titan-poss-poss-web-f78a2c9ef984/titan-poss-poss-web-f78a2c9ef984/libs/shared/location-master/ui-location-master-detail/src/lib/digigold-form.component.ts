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
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  TEMPLATE19
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  LocationApiKeyEnum,
  LocationMasterDetails} from '@poss-web/shared/models';
import {
  DigigoldDetailsModel,
  DigigoldMainFormModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-digigold-form',
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
export class DigigoldFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private cdr: ChangeDetectorRef,
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
    const detailsCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.isCNPartialRedemptionAllowedForDigiGold',
        checked: this.locationDetails.digigoldDetails
          ? this.locationDetails.digigoldDetails.data
              .isCNPartialRedemptionAllowedForDigiGold
            ? this.locationDetails.digigoldDetails.data
                .isCNPartialRedemptionAllowedForDigiGold
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.isCNCancelAllowedForDigiGold',
        checked: this.locationDetails.digigoldDetails
          ? this.locationDetails.digigoldDetails.data
              .isCNCancelAllowedForDigiGold
            ? this.locationDetails.digigoldDetails.data
                .isCNCancelAllowedForDigiGold
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.isCNCancelAllowedForNonDigiGold',
        checked: this.locationDetails.digigoldDetails
          ? this.locationDetails.digigoldDetails.data
              .isCNCancelAllowedForNonDigiGold
            ? this.locationDetails.digigoldDetails.data
                .isCNCancelAllowedForNonDigiGold
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.isCNTransferAllowedForDigiGold',
        checked: this.locationDetails.digigoldDetails
          ? this.locationDetails.digigoldDetails.data
              .isCNTransferAllowedForDigiGold
            ? this.locationDetails.digigoldDetails.data
                .isCNTransferAllowedForDigiGold
            : false
          : false
      },
      {
        id: '5',
        name: 'pw.locationMaster.isCNTransferAllowedForNonDigiGold',
        checked: this.locationDetails.digigoldDetails
          ? this.locationDetails.digigoldDetails.data
              .isCNTransferAllowedForNonDigiGold
            ? this.locationDetails.digigoldDetails.data
                .isCNTransferAllowedForNonDigiGold
            : false
          : false
      }
    ];

    const digigoldDetailsModel = new DigigoldDetailsModel(
      1,
      this.locationDetails.digigoldDetails
        ? this.locationDetails.digigoldDetails.data.digiGoldDiscountPercent
          ? this.locationDetails.digigoldDetails.data.digiGoldDiscountPercent
          : ''
        : '',
      detailsCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new DigigoldMainFormModel(1, digigoldDetailsModel);

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
      formName: 'pw.locationMaster.DIGIGOLD',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,

      digigoldDetails: {
        type: LocationApiKeyEnum.DIGIGOLD_DETAILS,
        data: {
          digiGoldDiscountPercent:
            formData['1-digigoldDetailsModel']['1-digiGoldDiscountPercent'],
          isCNPartialRedemptionAllowedForDigiGold:
            formData['1-digigoldDetailsModel']['1-detailsCheckbox'][0],
          isCNCancelAllowedForDigiGold:
            formData['1-digigoldDetailsModel']['1-detailsCheckbox'][1],
          isCNCancelAllowedForNonDigiGold:
            formData['1-digigoldDetailsModel']['1-detailsCheckbox'][2],
          isCNTransferAllowedForDigiGold:
            formData['1-digigoldDetailsModel']['1-detailsCheckbox'][3],
          isCNTransferAllowedForNonDigiGold:
            formData['1-digigoldDetailsModel']['1-detailsCheckbox'][4]
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
    // if (this.locationDetails.locationTypeCode === LocationTypeLists.BTQ) {
    //   this.translateService
    //     .get('pw.locationMaster.otpEmail')
    //     .toPromise()
    //     .then(fieldNameTranslate => {
    //       this.helperFunctions.setConditionalValidators(
    //         formGroup,
    //         '1-otpDetailsModel',
    //         '1-helpdeskEmailId',
    //         [
    //           this.fieldValidatorsService.emailField(fieldNameTranslate),
    //           this.fieldValidatorsService.requiredField(fieldNameTranslate),
    //           Validators.required
    //         ]
    //       );
    //     });
    // } else {
    //   this.translateService
    //     .get('pw.locationMaster.otpEmail')
    //     .toPromise()
    //     .then(fieldNameTranslate => {
    //       this.helperFunctions.setConditionalValidators(
    //         formGroup,
    //         '1-otpDetailsModel',
    //         '1-helpdeskEmailId',
    //         [this.fieldValidatorsService.emailField(fieldNameTranslate)]
    //       );
    //     });
    // }
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
