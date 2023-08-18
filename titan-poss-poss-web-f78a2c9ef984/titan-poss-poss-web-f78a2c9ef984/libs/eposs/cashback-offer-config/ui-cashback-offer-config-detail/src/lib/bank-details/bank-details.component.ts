import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  QueryList,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  TEMPLATE15,
  HelperFunctions,
  CommandButton,
  ButtonType
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  CasbackOfferConfigTwoModel,
  CashBackOfferConfigOneModel,
  CashBackOfferConigMainModel
} from '@poss-web/shared/ui-master-form-models';
import {
  BankDetailsPayload,
  SaveBankDetailsPayload,
  PayerBankList,
  offerDetailsEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-bank-details',
  templateUrl: './bank-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankDetailsComponent implements OnInit, OnDestroy {
  @Input() bankDetails$: Observable<BankDetailsPayload>;
  @Input() payerBankList$: Observable<PayerBankList[]>;

  @Output() saveBankDetails = new EventEmitter<SaveBankDetailsPayload>();
  @Output() openProductGroupMappingEvent = new EventEmitter<boolean>();

  bankDetailsfromForm: SaveBankDetailsPayload;
  configId: string;
  destroy$ = new Subject<null>();
  public formFields: any;
  endDateLabel: string;

  public currentStyle: string[];
  commandButtonOutput: QueryList<ElementRef>;
  commandButtons: CommandButton[] = [
    {
      name: 'Product Group Mapping',
      cssClassName: 'pw-btn pw-primary-btn',
      type: ButtonType.BUTTON
    },
    {
      name: 'Save',
      cssClassName: 'pw-btn pw-accent-btn',
      type: ButtonType.SUBMIT
    }
  ];
  bankDetails: BankDetailsPayload;
  constructor(
    private hf: HelperFunctions,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {

    this.translateService
      .get([
        'pw.cashbackConfig.endDate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.endDateLabel = translatedMessages['pw.cashbackConfig.endDate']
      });
  }

  commandButtonsOutput($event) {
    this.commandButtonOutput = $event;
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.configId = params['_configId'];
        if (this.configId && this.configId === offerDetailsEnum.new) {
          this.newBank();
        } else if (this.configId && this.configId !== offerDetailsEnum.new) {
          this.BankCreated();
        }
      });
  }

  newBank() {
    this.commandButtonOutput.forEach(el => {
      if (el.nativeElement.innerHTML.trim() === 'Product Group Mapping') {
        el.nativeElement.disabled = true;
      }
    });
  }

  BankCreated() {
    this.commandButtonOutput.forEach(el => {
      if (el.nativeElement.innerHTML.trim() === 'Product Group Mapping') {
        el.nativeElement.disabled = false;
      }
    });
  }
  public buttonClick(btn: CommandButton) {
    if (this.bankDetails?.cashbackName !== '' && !this.bankDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (btn.name === 'Product Group Mapping') {
        this.openProductGroupMappingEvent.emit(true);
      }
    }
  }

  ngOnInit() {
    combineLatest([this.bankDetails$, this.payerBankList$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.currentStyle = [''];
        const form = this.prepareSet(result[0], result[1]);
        this.formFields = this.getInputs(form);
      });
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.configId = params['_configId'];
      });
    this.bankDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((details: BankDetailsPayload) => {
        if (details) {
          this.bankDetails = details;
        }
      });
  }

  prepareSet(bankDetails: BankDetailsPayload, payerBankList: PayerBankList[]) {
    console.log(bankDetails);
    this.cdr.markForCheck();
    payerBankList = this.hf.patchValue(
      payerBankList,
      'id',
      'selected',
      bankDetails ? bankDetails.bankName : '',
      true
    );

    const cashBackOfferConfigOneModel = new CashBackOfferConfigOneModel(
      1,
      bankDetails
        ? bankDetails.cashbackName
          ? bankDetails.cashbackName
          : ''
        : '',
      payerBankList,

      this.fieldValidatorsService,
      this.translateService
    );
    const casbackOfferConfigTwoModel = new CasbackOfferConfigTwoModel(
      1,
      bankDetails ? (bankDetails.startDate ? bankDetails.startDate : '') : '',
      bankDetails ? (bankDetails.endDate ? bankDetails.endDate : '') : '',
      bankDetails
        ? bankDetails.cardNoLength
          ? bankDetails.cardNoLength
          : ''
        : '',

      [
        {
          id: 'true',
          name: 'From Start',
          checked: bankDetails
            ? bankDetails.fromFirst
              ? bankDetails.fromFirst
              : false
            : false
        },
        {
          id: 'false',
          name: 'From End',
          checked: bankDetails
            ? !bankDetails.fromFirst
              ? !bankDetails.fromFirst
              : false
            : false
        }
      ],

      bankDetails
        ? bankDetails.digitsTobeValidated
          ? bankDetails.digitsTobeValidated
          : ''
        : '',
      bankDetails
        ? bankDetails.maxUsageCount
          ? bankDetails.maxUsageCount
          : ''
        : '',
      [
        {
          id: '1',
          name: 'validate mobile number',
          checked: bankDetails
            ? bankDetails.mobileFlag
              ? bankDetails.mobileFlag
              : false
            : false
        }
      ],
      [
        {
          id: '1',
          name: 'Exclude cashback',
          checked: bankDetails
            ? bankDetails.excludeCashback
              ? bankDetails.excludeCashback
              : false
            : false
        }
      ],
      bankDetails ? (bankDetails.cmRemarks ? bankDetails.cmRemarks : '') : '',
      bankDetails
        ? bankDetails.offerRemarks
          ? bankDetails.offerRemarks
          : ''
        : '',

      this.fieldValidatorsService,
      this.translateService
    );
    const cashBackOfferConigMainModel = new CashBackOfferConigMainModel(
      1,
      cashBackOfferConfigOneModel,
      casbackOfferConfigTwoModel,
      this.fieldValidatorsService,
      this.translateService
    );

    return cashBackOfferConigMainModel;
  }

  getCssProp() {
    const annot = (BankDetailsComponent as any).__annotations__;
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
      formName: 'cash back offer Configuration',
      formDesc: 'cash back offer Configuration',
      formTemplate: TEMPLATE15
    };
  }

  addButton(formGroup: FormGroup) {
    console.log(formGroup);
    if (this.bankDetails?.cashbackName !== '' && !this.bankDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const formValues = formGroup.getRawValue();
      const cashBackName =
        formValues['1-cashBackOfferConfigOneModel']['1-cashBackName'];
      const bankName =
        formValues['1-cashBackOfferConfigOneModel']['1-bankName'];
      const startDate =
        formValues['1-cashBackOfferConfigTwoModel']['1-startDate'];
      const endDate = formValues['1-cashBackOfferConfigTwoModel']['1-endDate'];
      const digitsToBeValidatedFromFirst = Boolean(
        formValues['1-cashBackOfferConfigTwoModel'][
          '1-digitsToBeValidatedFromFirst'
        ] === 'true'
      );
      const digitsTobeValidated =
        formValues['1-cashBackOfferConfigTwoModel']['1-digitsTobeValidated'];
      const noOfTimesCardAllowed =
        formValues['1-cashBackOfferConfigTwoModel']['1-noOfTimesCardAllowed'];
      const validateMobileNo =
        formValues['1-cashBackOfferConfigTwoModel']['1-validateMobileNo'][0];
      const excludeCashBack =
        formValues['1-cashBackOfferConfigTwoModel']['1-excludeCashBack'][0];
      const cmRemarks =
        formValues['1-cashBackOfferConfigTwoModel']['1-cmRemarks'];
      const cashBackOfferRemarks =
        formValues['1-cashBackOfferConfigTwoModel']['1-cashBackOfferRemarks'];
      const cardNoLength =
        formValues['1-cashBackOfferConfigTwoModel']['1-noOfCardDigits'];
      if (digitsToBeValidatedFromFirst) {
        this.bankDetailsfromForm = {
          cashbackName: cashBackName,
          bankName: bankName,
          startDate: startDate,
          endDate: endDate,
          firstCardDigits: digitsTobeValidated,
          lastCardDigits: null,
          maxUsageCount: noOfTimesCardAllowed,
          mobileFlag: validateMobileNo,
          cmRemarks: cmRemarks,
          offerRemarks: cashBackOfferRemarks,
          cardNoLength: cardNoLength,
          excludeCashback: excludeCashBack,
          isActive: true
        };
      } else {
        this.bankDetailsfromForm = {
          cashbackName: cashBackName,
          bankName: bankName,
          startDate: startDate,
          endDate: endDate,
          lastCardDigits: digitsTobeValidated,
          firstCardDigits: null,
          maxUsageCount: noOfTimesCardAllowed,
          mobileFlag: validateMobileNo,
          cmRemarks: cmRemarks,
          offerRemarks: cashBackOfferRemarks,
          cardNoLength: cardNoLength,
          excludeCashback: excludeCashBack,
          isActive: true
        };
      }

      this.saveBankDetails.emit(this.bankDetailsfromForm);
    }
  }
  showMessage(key: string) {
    this.translateService
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }
  formGroupCreated(formGroup) {
    const subForm: FormGroup = <FormGroup>(
      formGroup.get('1-cashBackOfferConfigOneModel')
    );
    const subForm2: FormGroup = <FormGroup>(
      formGroup.get('1-cashBackOfferConfigTwoModel')
    );

    if (this.configId !== offerDetailsEnum.new) {
      subForm.get('1-cashBackName').disable({ onlySelf: true });
      if (!moment(this.bankDetails.startDate).isAfter(moment())) {
        subForm2.get('1-startDate').disable();
      }
    }

    subForm2.get('1-startDate').valueChanges.subscribe(x => {
      if (moment(subForm2.get('1-startDate').value).isAfter(subForm2.get('1-endDate').value)) {
        subForm2.get('1-endDate').markAllAsTouched();
        subForm2.get('1-endDate').setValidators(
          this.fieldValidatorsService.minDate(moment(subForm2.get('1-startDate').value).subtract(1), this.endDateLabel)
        )
        subForm2.get('1-endDate').updateValueAndValidity({ onlySelf: true })
      } else {
        subForm2.get('1-endDate').clearValidators();
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
