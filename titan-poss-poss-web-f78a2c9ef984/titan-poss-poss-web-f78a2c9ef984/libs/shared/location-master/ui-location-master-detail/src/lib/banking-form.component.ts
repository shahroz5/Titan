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
  StateTypes
} from '@poss-web/shared/models';
import {
  BankingDetailsModel,
  BankingMainFormModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-banking-form',
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
export class BankingFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private cdr: ChangeDetectorRef,
    private helperFunctions: HelperFunctions,
    public dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  @Input() locationDetails: LocationMasterDetails;
  @Input() refundMode: StateTypes[];
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

    if (this.locationDetails.bankingDetails) {
      this.refundMode = this.helperFunctions.patchValue(
        this.refundMode,
        'id',
        'selected',
        this.locationDetails.bankingDetails.data.paymentMode,
        true
      );
    }

    const bankingDetailsCheckbox1 = [
      {
        id: '1',
        name: 'pw.locationMaster.enableCashDeposit',
        checked: this.locationDetails.bankingDetails
          ? this.locationDetails.bankingDetails.data.enableCashDeposit
            ? this.locationDetails.bankingDetails.data.enableCashDeposit
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.enableChequeDeposit',
        checked: this.locationDetails.bankingDetails
          ? this.locationDetails.bankingDetails.data.enableChequeDeposit
            ? this.locationDetails.bankingDetails.data.enableChequeDeposit
            : false
          : false
      }
    ];

    const bankingDetailsCheckbox2 = [
      {
        id: '1',
        name: 'pw.locationMaster.isBankingMandatory',
        checked: this.locationDetails.bankingDetails
          ? this.locationDetails.bankingDetails.data.isBankingMandatory
            ? this.locationDetails.bankingDetails.data.isBankingMandatory
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.isPasswordMandatory',
        checked: this.locationDetails.bankingDetails
          ? this.locationDetails.bankingDetails.data.isPasswordMandatory
            ? this.locationDetails.bankingDetails.data.isPasswordMandatory
            : false
          : false
      }
    ];

    const ghsFormDetailsModel = new BankingDetailsModel(
      1,
      this.refundMode,
      bankingDetailsCheckbox1,
      this.locationDetails.bankingDetails
        ? this.locationDetails.bankingDetails.data.sapCode
          ? this.locationDetails.bankingDetails.data.sapCode
          : ''
        : '',
      bankingDetailsCheckbox2,
      this.locationDetails.bankingDetails
        ? this.locationDetails.bankingDetails.data.remarksForPassword
          ? this.locationDetails.bankingDetails.data.remarksForPassword
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new BankingMainFormModel(1, ghsFormDetailsModel);

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
      formName: 'pw.locationMaster.Banking',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,

      bankingDetails: {
        type: LocationApiKeyEnum.BANKING_DETAILS,
        data: {
          isBankingMandatory:
            formData['1-bankingDetailsModel']['1-bankingDetailsCheckbox2'][0],
          isPasswordMandatory:
            formData['1-bankingDetailsModel']['1-bankingDetailsCheckbox2'][1],
          enableCashDeposit:
            formData['1-bankingDetailsModel']['1-bankingDetailsCheckbox1'][0],
          enableChequeDeposit:
            formData['1-bankingDetailsModel']['1-bankingDetailsCheckbox1'][1],
          remarksForPassword:
            formData['1-bankingDetailsModel']['1-remarkForPassword'],
          sapCode: formData['1-bankingDetailsModel']['1-sapCode'],
          paymentMode:
            formData['1-bankingDetailsModel']['1-bankingDetailsSelect']
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
  // showMessage(key: string) {
  //   this.translateService
  //     .get(key)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((translatedMessage: string) => {
  //       this.overlayNotification
  //         .show({
  //           type: OverlayNotificationType.SIMPLE,
  //           message: translatedMessage,
  //           hasBackdrop: true,
  //           hasClose: true
  //         })
  //         .events.subscribe((eventType: OverlayNotificationEventType) => {});
  //     });
  // }

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
        .get('pw.locationMaster.paymentModeForRefund')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-bankingDetailsModel',
            '1-bankingDetailsSelect',
            [
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
    } else {
      this.helperFunctions.setConditionalValidators(
        formGroup,
        '1-bankingDetailsModel',
        '1-bankingDetailsSelect',
        []
      );
    }
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
