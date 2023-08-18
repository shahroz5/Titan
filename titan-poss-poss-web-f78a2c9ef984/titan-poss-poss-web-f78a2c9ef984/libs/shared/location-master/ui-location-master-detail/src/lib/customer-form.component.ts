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
import { TEMPLATE19 } from '@poss-web/shared/components/ui-dynamic-form';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  LocationApiKeyEnum,
  LocationMasterDetails,
  OverlayNotificationServiceAbstraction,
} from '@poss-web/shared/models';
import {
  CustomerEncircleModel,
  CustomerInstitutionalCustomerLMModel,
  CustomerInternationalCustomerModel,
  CustomerKycModel,
  CustomerMainFormModel,
  CustomerOneTimeCustomerModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-customer-form',
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
    >
    </poss-web-dynamic-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private fieldValidatorsService: FieldValidatorsService,
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
    const customerKycCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.isUploadDocumentAllowed',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data.isUploadDocumentAllowed
            ? this.locationDetails.customerDetails.data.isUploadDocumentAllowed
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.isDownloadDocumentAllowed',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data.isDownloadDocumentAllowed
            ? this.locationDetails.customerDetails.data
                .isDownloadDocumentAllowed
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.DocumentdisplayforCC',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data.isDocumentDisplayForCC
            ? this.locationDetails.customerDetails.data.isDocumentDisplayForCC
            : false
          : false
      }
    ];

    const customerKycModel = new CustomerKycModel(
      1,
      customerKycCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );

    const customerEncircleCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.IsEmailIDtobemandatory',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data.isEmailForEncircleCustomer
            ? this.locationDetails.customerDetails.data
                .isEmailForEncircleCustomer
            : false
          : false
      }
    ];
    const customerEncircleModel = new CustomerEncircleModel(
      1,
      customerEncircleCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );

    const customerOneTimeCustomerCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.IsMobileNotobemandatory',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data
              .isMobileNoForOneTimeCustomer
            ? this.locationDetails.customerDetails.data
                .isMobileNoForOneTimeCustomer
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.IsEmailIDtobemandatory',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data.isEmailForOneTimeCustomer
            ? this.locationDetails.customerDetails.data
                .isEmailForOneTimeCustomer
            : false
          : false
      }
    ];
    const customerOneTimeCustomerModel = new CustomerOneTimeCustomerModel(
      1,
      customerOneTimeCustomerCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );

    const customerInstitutionalCustomerCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.IsMobileNotobemandatory',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data
              .isMobileNoForInstitutionalCustomer
            ? this.locationDetails.customerDetails.data
                .isMobileNoForInstitutionalCustomer
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.IsEmailIDtobemandatory',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data
              .isEmailForInstitutionalCustomer
            ? this.locationDetails.customerDetails.data
                .isEmailForInstitutionalCustomer
            : false
          : false
      }
    ];
    const customerInstitutionalCustomerModel = new CustomerInstitutionalCustomerLMModel(
      1,
      customerInstitutionalCustomerCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );

    const customerInternationalCustomerCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.IsMobileNotobemandatory',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data
              .isMobileNoForInternationalCustomer
            ? this.locationDetails.customerDetails.data
                .isMobileNoForInternationalCustomer
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.IsEmailIDtobemandatory',
        checked: this.locationDetails.customerDetails
          ? this.locationDetails.customerDetails.data
              .isEmailForInternationalCustomer
            ? this.locationDetails.customerDetails.data
                .isEmailForInternationalCustomer
            : false
          : false
      }
    ];
    const customerInternationalCustomerModel = new CustomerInternationalCustomerModel(
      1,
      customerInternationalCustomerCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new CustomerMainFormModel(
      1,
      customerKycModel,
      customerEncircleModel,
      customerOneTimeCustomerModel,
      customerInstitutionalCustomerModel,
      customerInternationalCustomerModel
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
      formName: 'pw.locationMaster.Customer',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,

      customerDetails: {
        type: LocationApiKeyEnum.CUSTOMER_DETAILS,
        data: {
          isUploadDocumentAllowed:
            formData['1-customerKycModel']['1-customerKycCheckbox'][0],
          isDownloadDocumentAllowed:
            formData['1-customerKycModel']['1-customerKycCheckbox'][1],
          isDocumentDisplayForCC:
            formData['1-customerKycModel']['1-customerKycCheckbox'][2],
          isEmailForEncircleCustomer:
            formData['1-customerEncircleModel'][
              '1-customerEncircleCheckbox'
            ][0],
          isMobileNoForOneTimeCustomer:
            formData['1-customerOneTimeCustomerModel'][
              '1-customerOneTimeCustomerCheckbox'
            ][0],
          isEmailForOneTimeCustomer:
            formData['1-customerOneTimeCustomerModel'][
              '1-customerOneTimeCustomerCheckbox'
            ][1],
          isMobileNoForInstitutionalCustomer:
            formData['1-customerInstitutionalCustomerModel'][
              '1-customerInstitutionalCustomerCheckbox'
            ][0],
          isEmailForInstitutionalCustomer:
            formData['1-customerInstitutionalCustomerModel'][
              '1-customerInstitutionalCustomerCheckbox'
            ][1],
          isMobileNoForInternationalCustomer:
            formData['1-customerInternationalCustomerModel'][
              '1-customerInternationalCustomerCheckbox'
            ][0],
          isEmailForInternationalCustomer:
            formData['1-customerInternationalCustomerModel'][
              '1-customerInternationalCustomerCheckbox'
            ][1]
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
