import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  PaymentMaster,
  priceGroupEnum,
  paymentMasterEnum
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { PaymentMasterModel } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { TEMPLATE8 } from '@poss-web/shared/components/ui-dynamic-form';

@Component({
  selector: 'poss-web-payment-master-detail',
  templateUrl: './payment-master-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMasterDetailComponent implements OnInit, OnDestroy {
  dialogData: PaymentMaster;
  paymentGroup: string;
  paymentCode: string;
  description: string;
  referenceOne: string;
  referenceTwo: string;
  referenceThree: string;
  isActive: string;
  enable: boolean;
  customerDependent: boolean;
  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  destroy$: Subject<null> = new Subject<null>();
  constructor(
    public dialogRef: MatDialogRef<PaymentMasterDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
  ) {
    this.dialogData = data;
    console.log(this.dialogData);
  }

  ngOnInit() {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onClose() {
    this.dialogRef.close();
  }
  prepareSet() {
    const paymentMaster = new PaymentMasterModel(
      1,
      [
        {
          id: 'REGULAR',
          name: 'pw.paymentMaster.regular',
          checked:
            this.dialogData.paymentCode !== 'NEW'
              ? this.dialogData.type === 'REGULAR'
                ? this.dialogData.type === 'REGULAR'
                : false
              : true
        },
        {
          id: 'WALLET',
          name: 'pw.paymentMaster.wallet',
          checked:
            this.dialogData.type === 'WALLET'
              ? this.dialogData.type === 'WALLET'
              : false
        },
        {
          id: 'BANK_LOAN',
          name: 'pw.paymentMaster.bankLoan',
          checked:
            this.dialogData.type === 'BANK_LOAN'
              ? this.dialogData.type === 'BANK_LOAN'
              : false
        }
      ],
      this.dialogData.paymentCode
        ? this.dialogData.paymentCode === 'NEW'
          ? ''
          : this.dialogData.paymentCode
        : '',
      this.dialogData.paymentCode ? this.dialogData.description : '',

      this.dialogData.referenceOne,
      this.dialogData.referenceTwo,
      this.dialogData.referenceThree,

      [
        {
          id: '1',
          name: 'pw.paymentMaster.customerDependent',
          checked:
            this.dialogData.paymentCode === paymentMasterEnum.NEW
              ? true
              : this.dialogData.customerDependent
        }
      ],
      this.fieldValidatorsService,
      this.translateService
    );

    return paymentMaster;
  }

  getCssProp() {
    const annot = (PaymentMasterDetailComponent as any).__annotations__;
    return annot[0].styles;
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: 'Payment Master Form',
      formDesc: 'Payment Master',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();

    this.paymentGroup = formValues['1-type'];
    this.paymentCode = formValues['1-paymentCode'];
    this.description = formValues['1-description'];
    this.referenceOne = formValues['1-referenceOne'];
    this.referenceTwo = formValues['1-referenceTwo'];
    this.referenceThree = formValues['1-referenceThree'];

    this.customerDependent = formValues['1-customerDependent'][0];

    this.onCreate();
  }
  onCreate() {
    let mode = '';
    if (this.dialogData.paymentCode !== priceGroupEnum.NEW) {
      mode = priceGroupEnum.edit;
    } else {
      mode = priceGroupEnum.new;
    }

    this.dialogRef.close({
      paymentGroup: this.paymentGroup,
      paymentCode: this.paymentCode,
      description: this.description,
      referenceOne: this.referenceOne,
      referenceTwo: this.referenceTwo,
      referenceThree: this.referenceThree,

      customerDependent: this.customerDependent,
      mode: mode
    });
  }
  deleteButton() {
    this.dialogRef.close();
  }

  formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.paymentCode !== 'NEW') {
      if (this.dialogData.isEditable) {
        formGroup.get('1-paymentCode').disable({ onlySelf: true });
      } else {
        formGroup.disable();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
