import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TEMPLATE16 } from '@poss-web/shared/components/ui-dynamic-form';
import { TranslateService } from '@ngx-translate/core';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { CashPaymentConfigurationModel } from '@poss-web/shared/ui-master-form-models';
import {
  AlertPopupServiceAbstraction,
  CashPaymentConfiguration,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'poss-web-cash-payment-configuration-details',
  templateUrl: './cash-payment-configuration-details.component.html',
  styleUrls: ['./cash-payment-configuration-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashPaymentConfigurationDetailsComponent implements OnInit {
  @Input() cashPaymentConfigurationDetails: Observable<
    CashPaymentConfiguration
  >;
  cashPaymentConfiguration: CashPaymentConfiguration;
  @Output() cashPaymentConfigurationDetailsForm = new EventEmitter<{
    form: CashPaymentConfiguration;
    mode: boolean;
  }>();

  destroy$ = new Subject<null>();

  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;

  /// above is dynamic form specific code

  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.cashPaymentConfigurationDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe(cashDetails => {
        this.cashPaymentConfiguration = cashDetails;
        const form = this.prepareSet(cashDetails);
        this.formFields = this.getInputs(form);
        console.log(this.formFields);
        this.currentStyle = this.getCssProp();
        this.cdr.detectChanges();
      });
  }

  /// below is dynamic form specific code

  prepareSet(cashDetails: CashPaymentConfiguration) {
    console.log(cashDetails);
    const applicableDaysRadio: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.cashTransactionOnVariableDays',
        checked: cashDetails.ruleDetails.data.applicableDays.isVariableDay
      },
      {
        id: '2',
        name: 'pw.cashPaymentConfiguration.cashTransactionOnSingleDay',
        checked: cashDetails.ruleDetails.data.applicableDays.isSingleDay
      }
    ];

    const creditNotesCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
      disabled?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.GRN_Check',
        checked: cashDetails.ruleDetails.data.applicablePaymentType.grn,
        disabled: true
      },
      {
        id: '2',
        name: 'pw.cashPaymentConfiguration.GHSMaturity_Check',
        checked: cashDetails.ruleDetails.data.applicablePaymentType.ghsMaturity,
        disabled: true
      },
      {
        id: '3',
        name: 'pw.cashPaymentConfiguration.advanceCN_Check',
        checked: cashDetails.ruleDetails.data.applicablePaymentType.advanceCN,
        disabled: true
      },
      {
        id: '4',
        name: 'pw.cashPaymentConfiguration.billCancel_Check',
        checked: cashDetails.ruleDetails.data.applicablePaymentType.billCancel,
        disabled: true
      },
      {
        id: '5',
        name: 'pw.cashPaymentConfiguration.CNInterBtqTransfer_Check',
        disabled: true,
        checked: cashDetails.ruleDetails.data.applicablePaymentType.cnIBT
      },
      {
        id: '6',
        name: 'pw.cashPaymentConfiguration.GiftCard_Check',
        checked: cashDetails.ruleDetails.data.applicablePaymentType.giftCard,
        disabled: true
      }
    ];

    const applicableapplicableStoresUptoL1L2Checkbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.uptoL1L2Stores',
        checked: cashDetails.ruleDetails.data.l1l2Stores
      }
    ];
    const applicableapplicableStoresUptoL1L2Radio: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.sameStore',
        checked: cashDetails.ruleDetails.data.applicableL1L2Stores.sameStore
      },
      {
        id: '2',
        name: 'pw.cashPaymentConfiguration.sameState',
        checked: cashDetails.ruleDetails.data.applicableL1L2Stores.sameState
      },
      {
        id: '3',
        name: 'pw.cashPaymentConfiguration.acrossCountry',
        checked: cashDetails.ruleDetails.data.applicableL1L2Stores.acrossCountry
      }
    ];
    const applicableapplicableStoresUptoL3Checkbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.uptoL3Stores',
        checked: cashDetails.ruleDetails.data.l3Stores
      }
    ];
    const applicableapplicableStoresUptoL3Radio: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.sameStore',
        checked: cashDetails.ruleDetails.data.applicableL3Stores.sameStore
      },
      {
        id: '2',
        name: 'pw.cashPaymentConfiguration.sameState',
        checked: cashDetails.ruleDetails.data.applicableL3Stores.sameState
      },
      {
        id: '3',
        name: 'pw.cashPaymentConfiguration.acrossCountry',
        checked: cashDetails.ruleDetails.data.applicableL3Stores.acrossCountry
      }
    ];

    const applicableTransactionsCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.advanceOrderBooking_Check',
        checked:
          cashDetails.ruleDetails.data.applicableTransaction.advanceBooking
      },
      {
        id: '2',
        name: 'pw.cashPaymentConfiguration.cashMemo_Check',
        checked: cashDetails.ruleDetails.data.applicableTransaction.cashMemo
      },
      {
        id: '3',
        name: 'pw.cashPaymentConfiguration.GHS_Check',
        checked: cashDetails.ruleDetails.data.applicableTransaction.ghs
      },
      //{ id: '4', name: 'pw.cashPaymentConfiguration.ASSM_Check' },
      {
        id: '4',
        name: 'pw.cashPaymentConfiguration.customerOrder_Check',
        checked:
          cashDetails.ruleDetails.data.applicableTransaction.customerOrder
      },
      {
        id: '5',
        name: 'pw.cashPaymentConfiguration.acceptAdvance_Check',
        checked:
          cashDetails.ruleDetails.data.applicableTransaction.acceptAdvance
      },
      {
        id: '6',
        name: 'pw.cashPaymentConfiguration.GRF_Check',
        checked: cashDetails.ruleDetails.data.applicableTransaction.grf
      },
      {
        id: '7',
        name: 'pw.cashPaymentConfiguration.giftCardValueAccessQCGC_Check',
        checked:
          cashDetails.ruleDetails.data.applicableTransaction.giftCardValue
      },
      {
        id: '8',
        name: 'pw.cashPaymentConfiguration.servicePoss_Check',
        checked:
          cashDetails.ruleDetails.data.applicableTransaction.servicePoss
      }
      // {
      //   id: '9', name: 'pw.cashPaymentConfiguration.quickCM_Check',
      //   checked: cashDetails.ruleDetails.data.applicableTransaction.quickCM
      // }
    ];

    const applicableCummulativeCashValueCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.applicableOnCummulative_Check',
        checked: cashDetails.ruleDetails.data.cummulativeCashValue
      }
    ];

    const pmlaApplicableapplicableStoresUptoL1L2Checkbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.uptoL1L2Stores',
        checked: cashDetails.ruleDetails.data.pmlaSettings.l1l2Stores
      }
    ];

    const pmlaApplicableapplicableStoresUptoL1L2Radio: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.sameStore',
        checked:
          cashDetails.ruleDetails.data.pmlaSettings.applicableL1L2Stores
            .sameStore
      },
      {
        id: '2',
        name: 'pw.cashPaymentConfiguration.sameState',
        checked:
          cashDetails.ruleDetails.data.pmlaSettings.applicableL1L2Stores
            .sameState
      },
      {
        id: '3',
        name: 'pw.cashPaymentConfiguration.acrossCountry',
        checked:
          cashDetails.ruleDetails.data.pmlaSettings.applicableL1L2Stores
            .acrossCountry
      }
    ];

    const pmlaApplicableapplicableStoresUptoL3Checkbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.uptoL3Stores',
        checked: cashDetails.ruleDetails.data.pmlaSettings.l3Stores
      }
    ];

    const pmlaApplicableapplicableStoresUptoL3Radio: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.cashPaymentConfiguration.sameStore',
        checked:
          cashDetails.ruleDetails.data.pmlaSettings.applicableL3Stores.sameStore
      },
      {
        id: '2',
        name: 'pw.cashPaymentConfiguration.sameState',
        checked:
          cashDetails.ruleDetails.data.pmlaSettings.applicableL3Stores.sameState
      },
      {
        id: '3',
        name: 'pw.cashPaymentConfiguration.acrossCountry',
        checked:
          cashDetails.ruleDetails.data.pmlaSettings.applicableL3Stores
            .acrossCountry
      }
    ];

    const cashPaymentConfiguration = new CashPaymentConfigurationModel(
      1,
      cashDetails.ruleDetails.data.cashAmountMaxCap,
      cashDetails.ruleDetails.data.validFrom,
      applicableDaysRadio,
      creditNotesCheckbox,
      applicableapplicableStoresUptoL1L2Checkbox,
      applicableapplicableStoresUptoL1L2Radio,
      applicableapplicableStoresUptoL3Checkbox,
      applicableapplicableStoresUptoL3Radio,
      applicableCummulativeCashValueCheckbox,
      applicableTransactionsCheckbox,
      cashDetails.ruleDetails.data.cashRefundSetting.refundCashLimit,
      cashDetails.ruleDetails.data.pmlaSettings.cashAmountMaxCap,
      pmlaApplicableapplicableStoresUptoL1L2Checkbox,
      pmlaApplicableapplicableStoresUptoL1L2Radio,
      pmlaApplicableapplicableStoresUptoL3Checkbox,
      pmlaApplicableapplicableStoresUptoL3Radio,
      this.fieldValidatorsService,
      this.translateService
    );
    return cashPaymentConfiguration;
  }

  getCssProp() {
    const annot = (CashPaymentConfigurationDetailsComponent as any)
      .__annotations__;
    return [`.mt-22{ margin-top: -22px; }`];
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: '',
      formDesc: '',
      formTemplate: TEMPLATE16
    };
  }

  addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();
    if (
      formData['1-applicableCummulativeCashValueCheckbox'][0] &&
      !formData['1-applicableTransactionsCheckbox'][0] &&
      !formData['1-applicableTransactionsCheckbox'][1] &&
      !formData['1-applicableTransactionsCheckbox'][2] &&
      !formData['1-applicableTransactionsCheckbox'][3] &&
      !formData['1-applicableTransactionsCheckbox'][4] &&
      !formData['1-applicableTransactionsCheckbox'][5] &&
      !formData['1-applicableTransactionsCheckbox'][6] &&
      !formData['1-applicableTransactionsCheckbox'][7]
    ) {
      {
        this.openPopup('pw.cashPaymentConfiguration.applyTransactionLabel');
      }
    } else if (
      !formData['1-applicableCummulativeCashValueCheckbox'][0] &&
      (formData['1-applicableTransactionsCheckbox'][0] ||
        formData['1-applicableTransactionsCheckbox'][1] ||
        formData['1-applicableTransactionsCheckbox'][2] ||
        formData['1-applicableTransactionsCheckbox'][3] ||
        formData['1-applicableTransactionsCheckbox'][4] ||
        formData['1-applicableTransactionsCheckbox'][5] ||
        formData['1-applicableTransactionsCheckbox'][6] ||
        formData['1-applicableTransactionsCheckbox'][7])
    ) {
      {
        this.openPopup('pw.cashPaymentConfiguration.applyCumulativeLabel');
      }
    } else {
      const cashPaymentConfigurationForm: CashPaymentConfiguration = {
        ruleId: this.cashPaymentConfiguration.ruleId,
        description: this.cashPaymentConfiguration.description,
        isActive: this.cashPaymentConfiguration.isActive,
        ruleType: this.cashPaymentConfiguration.ruleType,
        ruleDetails: {
          type: this.cashPaymentConfiguration.ruleDetails.type,
          data: {
            cashAmountMaxCap: formData['1-cashAmountMaxCap'],
            validFrom: formData['1-validForm'],
            applicableDays: {
              isVariableDay: formData['1-applicableDaysRadio'] === '1',
              isSingleDay: formData['1-applicableDaysRadio'] === '2'
            },
            applicablePaymentType: {
              grn: formData['1-creditNotesCheckbox'][0]
                ? formData['1-creditNotesCheckbox'][0]
                : false,
              ghsMaturity: formData['1-creditNotesCheckbox'][1]
                ? formData['1-creditNotesCheckbox'][1]
                : false,
              advanceCN: formData['1-creditNotesCheckbox'][2]
                ? formData['1-creditNotesCheckbox'][2]
                : false,
              billCancel: formData['1-creditNotesCheckbox'][3]
                ? formData['1-creditNotesCheckbox'][3]
                : false,
              cnIBT: formData['1-applicableTransactionsCheckbox'][4]
                ? formData['1-applicableTransactionsCheckbox'][4]
                : false,
              giftCard: formData['1-creditNotesCheckbox'][5]
                ? formData['1-creditNotesCheckbox'][5]
                : false
            },
            applicableTransaction: {
              advanceBooking: formData['1-applicableTransactionsCheckbox'][0]
                ? formData['1-applicableTransactionsCheckbox'][0]
                : false,
              cashMemo: formData['1-applicableTransactionsCheckbox'][1]
                ? formData['1-applicableTransactionsCheckbox'][1]
                : false,
              ghs: formData['1-applicableTransactionsCheckbox'][2]
                ? formData['1-applicableTransactionsCheckbox'][2]
                : false,
              //assm: formData['1-applicableTransactionsCheckbox'][3],
              customerOrder: formData['1-applicableTransactionsCheckbox'][3]
                ? formData['1-applicableTransactionsCheckbox'][3]
                : false,
              acceptAdvance: formData['1-applicableTransactionsCheckbox'][4]
                ? formData['1-applicableTransactionsCheckbox'][4]
                : false,
              grf: formData['1-applicableTransactionsCheckbox'][5]
                ? formData['1-applicableTransactionsCheckbox'][5]
                : false,
              giftCardValue: formData['1-applicableTransactionsCheckbox'][6]
                ? formData['1-applicableTransactionsCheckbox'][6]
                : false,
              servicePoss: formData['1-applicableTransactionsCheckbox'][7]
                ? formData['1-applicableTransactionsCheckbox'][7]
                : false
              //quickCM: formData['1-applicableTransactionsCheckbox'][8]
            },
            cummulativeCashValue:
              formData['1-applicableCummulativeCashValueCheckbox'][0],
            l1l2Stores: formData['1-applicableStoresUptoL1L2Checkbox'][0],
            l3Stores: formData['1-applicableStoresUptoL3Checkbox'][0],
            applicableL1L2Stores: {
              sameStore: formData['1-applicableStoresUptoL1L2Radio'] === '1',
              sameState: formData['1-applicableStoresUptoL1L2Radio'] === '2',
              acrossCountry: formData['1-applicableStoresUptoL1L2Radio'] === '3'
            },
            applicableL3Stores: {
              sameStore: formData['1-applicableStoresUptoL3Radio'] === '1',
              sameState: formData['1-applicableStoresUptoL3Radio'] === '2',
              acrossCountry: formData['1-applicableStoresUptoL3Radio'] === '3'
            },
            cashRefundSetting:{
              refundCashLimit: formData['1-refundCashLimit']
            },
            pmlaSettings: {
              cashAmountMaxCap: formData['1-pmlaCashAmountMaxCap'],
              applicableL1L2Stores: {
                sameStore:
                  formData['1-pmlaApplicableStoresUptoL1L2Radio'] === '1',
                sameState:
                  formData['1-pmlaApplicableStoresUptoL1L2Radio'] === '2',
                acrossCountry:
                  formData['1-pmlaApplicableStoresUptoL1L2Radio'] === '3'
              },
              applicableL3Stores: {
                sameStore:
                  formData['1-pmlaApplicableStoresUptoL3Radio'] === '1',
                sameState:
                  formData['1-pmlaApplicableStoresUptoL3Radio'] === '2',
                acrossCountry:
                  formData['1-pmlaApplicableStoresUptoL3Radio'] === '3'
              },
              l1l2Stores: formData['1-pmlaApplicableStoresUptoL1L2Checkbox'][0],
              l3Stores: formData['1-pmlaApplicableStoresUptoL3Checkbox'][0]
            }
          }
        }
      };

      let mode = true; // true=New; false=Edit
      if (this.cashPaymentConfiguration.ruleId === 1) {
        mode = false;
      }

      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(take(1))
        .subscribe((res: boolean) => {
          if (res) {
            this.cashPaymentConfigurationDetailsForm.emit({
              form: cashPaymentConfigurationForm,
              mode
            });
          }
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
        });
    }
  }
  openPopup(key: string) {
    this.translateService
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.ERROR,
          message: translatedMsg
        });
      });
  }

  deleteButton() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.cancelConfirmation'
      })
      .pipe(take(1))
      .subscribe((res: boolean) => {
        if (res) {
          this.ngOnInit();
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
        }
      });
  }

  public formGroupCreated(formGroup: FormGroup) {
    formGroup
      .get('1-applicableStoresUptoL1L2Checkbox')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(l1l2 => {
        if (l1l2[0]) {
          formGroup
            .get('1-applicableStoresUptoL1L2Radio')
            .enable({ onlySelf: true });
        } else {
          formGroup
            .get('1-applicableStoresUptoL1L2Radio')
            .disable({ onlySelf: true });
        }
      });
    formGroup
      .get('1-applicableStoresUptoL3Checkbox')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(l1l2 => {
        if (l1l2[0]) {
          formGroup
            .get('1-applicableStoresUptoL3Radio')
            .enable({ onlySelf: true });
        } else {
          formGroup
            .get('1-applicableStoresUptoL3Radio')
            .disable({ onlySelf: true });
        }
      });

    if (!this.cashPaymentConfiguration.ruleDetails.data.l1l2Stores) {
      formGroup
        .get('1-applicableStoresUptoL1L2Radio')
        .disable({ onlySelf: true });
    }

    if (!this.cashPaymentConfiguration.ruleDetails.data.l3Stores) {
      formGroup
        .get('1-applicableStoresUptoL3Radio')
        .disable({ onlySelf: true });
    }
    formGroup
      .get('1-pmlaApplicableStoresUptoL1L2Checkbox')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(l1l2 => {
        if (l1l2[0]) {
          formGroup
            .get('1-pmlaApplicableStoresUptoL1L2Radio')
            .enable({ onlySelf: true });
        } else {
          formGroup
            .get('1-pmlaApplicableStoresUptoL1L2Radio')
            .disable({ onlySelf: true });
        }
      });
    formGroup
      .get('1-pmlaApplicableStoresUptoL3Checkbox')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(l1l2 => {
        if (l1l2[0]) {
          formGroup
            .get('1-pmlaApplicableStoresUptoL3Radio')
            .enable({ onlySelf: true });
        } else {
          formGroup
            .get('1-pmlaApplicableStoresUptoL3Radio')
            .disable({ onlySelf: true });
        }
      });

    if (
      !this.cashPaymentConfiguration.ruleDetails.data.pmlaSettings.l1l2Stores
    ) {
      formGroup
        .get('1-pmlaApplicableStoresUptoL1L2Radio')
        .disable({ onlySelf: true });
    }

    if (!this.cashPaymentConfiguration.ruleDetails.data.pmlaSettings.l3Stores) {
      formGroup
        .get('1-pmlaApplicableStoresUptoL3Radio')
        .disable({ onlySelf: true });
    }
    if (
      this.cashPaymentConfiguration.ruleDetails.data.applicableDays
        .isVariableDay
    ) {
      formGroup.get('1-creditNotesCheckbox').enable({ onlySelf: true });
    }
    if (
      this.cashPaymentConfiguration.ruleDetails.data.applicableDays.isSingleDay
    ) {
      formGroup.get('1-creditNotesCheckbox').disable({ onlySelf: true });
      formGroup.get('1-creditNotesCheckbox').reset({ onlySelf: true });
    }

    formGroup
      .get('1-applicableDaysRadio')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(applicableDays => {
        if (applicableDays === '2') {
          formGroup.get('1-creditNotesCheckbox').disable({ onlySelf: true });
          formGroup.get('1-creditNotesCheckbox').reset({ onlySelf: true });
        } else {
          formGroup.get('1-creditNotesCheckbox').enable({ onlySelf: true });
        }
      });

    formGroup
      .get('1-applicableCummulativeCashValueCheckbox')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(cumulative => {
        if (cumulative[0]) {
          formGroup
            .get('1-applicableTransactionsCheckbox')
            .enable({ onlySelf: true });
        } else {
          formGroup
            .get('1-applicableTransactionsCheckbox')
            .disable({ onlySelf: true });
          formGroup
            .get('1-applicableTransactionsCheckbox')
            .reset({ onlySelf: true });
        }
      });

    if (this.cashPaymentConfiguration.ruleDetails.data.cummulativeCashValue) {
      formGroup
        .get('1-applicableTransactionsCheckbox')
        .enable({ onlySelf: true });
    } else {
      formGroup
        .get('1-applicableTransactionsCheckbox')
        .disable({ onlySelf: true });
    }
  }
}
