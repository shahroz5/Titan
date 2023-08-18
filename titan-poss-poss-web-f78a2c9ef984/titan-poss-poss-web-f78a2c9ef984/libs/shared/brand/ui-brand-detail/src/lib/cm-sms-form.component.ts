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
  AlertPopupServiceAbstraction,
  BrandMasterDetails,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  CmSMSConfigMainFormModel,
  CmSMSConfigModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cm-sms-form',
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
export class CmSmsFormComponent implements OnInit, OnDestroy {
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
    const cmSMSConfigModel = new CmSMSConfigModel(
      1,
      this.brandMasterDetails.cmDetails
        ? this.brandMasterDetails.cmDetails.data
          ? this.brandMasterDetails.cmDetails.data.residualAmountForeGHSTransfer
            ? this.brandMasterDetails.cmDetails.data
                .residualAmountForeGHSTransfer
            : ''
          : ''
        : '' /* residualAmountForeGHSTransfer */,
      this.brandMasterDetails.cmDetails
        ? this.brandMasterDetails.cmDetails.data
          ? this.brandMasterDetails.cmDetails.data.smsUserName
            ? this.brandMasterDetails.cmDetails.data.smsUserName
            : ''
          : ''
        : '' /* smsUserName */,
      this.brandMasterDetails.cmDetails
        ? this.brandMasterDetails.cmDetails.data
          ? this.brandMasterDetails.cmDetails.data.smsPassword
            ? this.brandMasterDetails.cmDetails.data.smsPassword
            : ''
          : ''
        : '' /* smsPassword */,
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new CmSMSConfigMainFormModel(1, cmSMSConfigModel);

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
      formName: 'pw.brandMaster.CMSMSConfigurationModel',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const brandDetails: BrandMasterDetails = {
      brandCode: this.brandMasterDetails.brandCode,
      cmDetails: {
        type: 'CM_DETAILS',
        data: {
          smsUserName: formData['1-cmSMSConfigModel']['1-smsUserName'],
          smsPassword: formData['1-cmSMSConfigModel']['1-smsPassword'],
          residualAmountForeGHSTransfer:
            formData['1-cmSMSConfigModel']['1-residualAmountForeGHSTransfer']
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

  public formGroupCreated() {
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
  }

  invalidForm($event: boolean) {
    if ($event) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.inventoryMasters.invalidAlert'
      });
      //   const dialogRef = this.dialog.open(ValidationAlertDialogComponent, {
      //     width: '500px',
      //     height: 'auto',
      //     disableClose: true,
      //     data: 'pw.inventoryMasters.invalidAlert'
      //   });
      //   dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
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
