import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import {
  CUSTOMER_TYPE_ENUM,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PanVerificationRequestPayload
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-pan-card-popup',
  templateUrl: './pan-card-popup.component.html'
})
export class PanCardPopupComponent implements OnInit, OnDestroy {
  pancardLabel: string;
  panUpdateForm: FormGroup;
  form60UpdateForm: FormGroup;
  destroy$ = new Subject();
  validPan = true;
  panVerificationStatus: any;
  isLoading$: Observable<boolean>;
  customerTypeRef = CUSTOMER_TYPE_ENUM;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PanCardPopupComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translationService
      .get(['pw.customerCreation.pancardNumberLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.pancardLabel =
          translatedMsg['pw.customerCreation.pancardNumberLabel'];
      });
  }

  ngOnInit(): void {
    this.createPanCardForm();
    this.isLoading$ = this.customerFacade.getIsLoading();

    this.customerFacade
      .getpanVerificationStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(panVerificationStatus => {
        if (panVerificationStatus) {
          this.panVerificationStatus = panVerificationStatus;
          // if (this.panVerificationStatus?.verificationStatus === false) {
          //   this.panUpdateForm.controls['pancard'].setErrors({
          //     incorrect: true
          //   });
          // }
        } else {
          this.panVerificationStatus = null;
        }
      });

    this.customerFacade
      .getUpdatedCustomerStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.data.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL) {
            this.updateNotification(
              'pw.customerCreation.form60UpdateSuccessMsg'
            );
          } else {
            this.updateNotification('pw.customerCreation.panUpdateSuccessMsg');
          }

          this.dialogRef.close(data);
        }
      });
  }

  updateNotification(updatedkey) {
    this.translationService
      .get([updatedkey])
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            hasBackdrop: false,
            hasClose: true,
            message: translatedMsg[updatedkey]
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  close(): void {
    this.dialogRef.close(null);
  }

  clearPanNumber() {
    this.customerFacade.clearPanVerificationStatus();
    this.panUpdateForm.get('pancard').setValue('');
  }

  createPanCardForm() {
    this.panUpdateForm = new FormGroup({
      pancard: new FormControl('', [
        this.fieldValidatorsService.pancardField(this.pancardLabel),
        this.fieldValidatorsService.requiredField(this.pancardLabel)
      ])
    });

    this.form60UpdateForm = new FormGroup({
      form60AndIdProofSubmitted: new FormControl(),
      passportId: new FormControl(this.data.passportId, [
        this.fieldValidatorsService.requiredField('Passport Number'),
        this.fieldValidatorsService.passportIdField('Passport Number')
      ])
    });
  }

  onPancardValueChange(event) {
    if (
      this.panUpdateForm.controls['pancard'].valid &&
      this.validPan === true &&
      this.panUpdateForm.controls['pancard'].value !== ''
    ) {
      const panVerificationRequestPayload: PanVerificationRequestPayload = {
        panCardNo: this.panUpdateForm.controls['pancard'].value,
        verificationType: 'NUMBER',
        vendorCode: 'PAN_KHOSLA'
      };
      this.customerFacade.loadPanVerificationStatus(
        panVerificationRequestPayload
      );
    }
  }

  updateform60() {
    if (
      this.form60UpdateForm.get('form60AndIdProofSubmitted').value &&
      this.form60UpdateForm.get('passportId').value
    ) {
      const updateCustomer = {
        customerId: this.data.customerId,
        data: {
          customerDetails: {
            data: {
              form60: this.form60UpdateForm.get('form60AndIdProofSubmitted')
                .value
            },
            type: this.data.customerType
          },
          passportId: this.form60UpdateForm.get('passportId').value
        }
      };

      this.customerFacade.updateCustomer(updateCustomer);
    }
  }

  updatePan() {
    if (this.panUpdateForm.valid) {
      const updateCustomer = {
        customerId: this.data.customerId,
        data: {
          customerDetails: {
            data: {
              form60: this.form60UpdateForm.get('form60AndIdProofSubmitted')
                .value
            },
            type: this.data.customerType
          },
          iscustTaxNoVerified: this.panVerificationStatus?.verificationStatus
            ? this.panVerificationStatus?.verificationStatus
            : false,
          custTaxNo: this.panUpdateForm.controls['pancard'].value
        }
      };

      this.customerFacade.updateCustomer(updateCustomer);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.customerFacade.clearPanVerificationStatus();
    this.customerFacade.clearUpdatedCustomerStatus();
  }
}
