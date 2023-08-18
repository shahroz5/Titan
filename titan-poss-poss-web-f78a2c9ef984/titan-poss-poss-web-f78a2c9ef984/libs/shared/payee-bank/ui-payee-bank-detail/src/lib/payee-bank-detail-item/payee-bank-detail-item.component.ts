import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { TranslateService } from '@ngx-translate/core';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PayeeBankDetails,
  SavePayeeBankFormPayload,
  StateSummary,
  TownSummary,
} from '@poss-web/shared/models';
import {
  HelperFunctions,
  TEMPLATE17
} from '@poss-web/shared/components/ui-dynamic-form';
import { PayeeBankMaster } from '@poss-web/shared/ui-master-form-models';

@Component({
  selector: 'poss-web-payee-bank-detail-item',
  templateUrl: './payee-bank-detail-item.component.html',
  styleUrls: ['./payee-bank-detail-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayeeBankDetailItemComponent implements OnInit, OnDestroy {
  @Input() bankDetails$: Observable<PayeeBankDetails>;
  @Input() towns$: Observable<any>;
  @Input() states: StateSummary[];
  @Input() country;
  @Output() tabOne = new EventEmitter<SavePayeeBankFormPayload>();
  @Output() formGroup = new EventEmitter<FormGroup>();
  destroy$ = new Subject<any>();
  bankName: string;
  ownerTypeVal = [];

  /// below is dynamic form specific code
  public formFields: any;

  public currentStyle: string[];
  bankDetails: PayeeBankDetails;
  ///
  constructor(
    public activatedRoute: ActivatedRoute,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private helperFunctions: HelperFunctions,
    private router: Router,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit() {
    this.bankDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bankDetails: PayeeBankDetails) => {
        if (bankDetails) {
          this.bankDetails = bankDetails;
        }
      });
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.bankName = params['_bankName'];
      });
    combineLatest([this.bankDetails$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.currentStyle = [''];
        const form = this.prepareSet(result[0]);

        this.formFields = this.getInputs(form);
      });
    this.bankDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bankDetails: PayeeBankDetails) => {
        if (bankDetails) {
          this.bankDetails = bankDetails;
        }
      });
  }
  prepareSet(payeeBankDetails: PayeeBankDetails) {
    console.log(payeeBankDetails.townName,'payee')
    let selctedstate;
    let states;
    let city;
    const ownerType = payeeBankDetails.ownerType.split(',');
    const statesArr = this.states.map(x => {
      return { id: x.stateId, name: x.description };
    })

    if(statesArr) {
      console.log(statesArr,'arr')
      selctedstate = statesArr.filter(x => x.name === payeeBankDetails.stateName);
    }


    if(selctedstate){
    states = this.helperFunctions.patchValue(
      statesArr,
      'id',
      'selected',
      selctedstate?.length > 0 ? selctedstate[0].id : ' ',
      true
    );
    }

    const bankDetails = new PayeeBankMaster(
      1,
      payeeBankDetails
        ? payeeBankDetails.bankName
          ? payeeBankDetails.bankName
          : ''
        : '',
      payeeBankDetails
        ? payeeBankDetails.bankCode
          ? payeeBankDetails.bankCode
          : ''
        : '',
      [
        {
          id: 'L1',
          name: 'L1',
          checked:
            ownerType[0] === 'L1'
              ? ownerType[0]
              : '' || ownerType[1] === 'L1'
              ? ownerType[1]
              : '' || ownerType[2] === 'L1'
              ? ownerType[2]
              : ''
        },
        {
          id: 'L2',
          name: 'L2',
          checked:
            ownerType[0] === 'L2'
              ? ownerType[0]
              : '' || ownerType[1] === 'L2'
              ? ownerType[1]
              : '' || ownerType[2] === 'L2'
              ? ownerType[2]
              : ''
        },
        {
          id: 'L3',
          name: 'L3',
          checked:
            ownerType[0] === 'L3'
              ? ownerType[0]
              : '' || ownerType[1] === 'L3'
              ? ownerType[1]
              : '' || ownerType[2] === 'L3'
              ? ownerType[2]
              : ''
        }
      ],
      payeeBankDetails
        ? payeeBankDetails.addressOne
          ? payeeBankDetails.addressOne
          : ''
        : '',
      payeeBankDetails
        ? payeeBankDetails.addressTwo
          ? payeeBankDetails.addressTwo
          : ''
        : '',
      this.country,
      states,
      [],
      payeeBankDetails
        ? payeeBankDetails.mailId
          ? payeeBankDetails.mailId
          : ''
        : '',
      payeeBankDetails
        ? payeeBankDetails.contactPerson
          ? payeeBankDetails.contactPerson
          : ''
        : '',

      this.fieldValidatorsService,
      this.translateService
    );

    return bankDetails;
  }
  getCssProp() {
    const annot = (PayeeBankDetailItemComponent as any).__annotations__;
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
      formName: 'Payee Bank',
      formDesc: 'Payee Bank',
      formTemplate: TEMPLATE17
    };
  }


  addButton(formGroup: FormGroup) {
    if (!this.bankDetails.isActive && this.bankDetails.bankCode !== '') {
      this.showMessage('pw.global.masterDeactiveMsg');
    } else {
      if (this.bankDetails$) this.ownerTypeVal = [];
      const formValues = formGroup.getRawValue();
      console.log(formValues, 'formValues');

      this.ownerTypeVal = [];
      if (formValues['1-ownerType'][0]) this.ownerTypeVal.push('L1');
      if (formValues['1-ownerType'][1]) this.ownerTypeVal.push('L2');
      if (formValues['1-ownerType'][2]) this.ownerTypeVal.push('L3');
      if (!this.ownerTypeVal.length) {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.ERROR,
          message: 'Please select a level'
        });
      } else {
        const details = {
          bankName: formValues['1-bankname'],
          isActive: true,
          bankCode: formValues['1-bankCode'],
          ownerType: this.ownerTypeVal.toString(),
          address:
            formValues['1-addressOne'] + ' addr2 ' + formValues['1-addressTwo'],
          stateName: formValues['1-state'],
          townName: formValues['1-city'],
          mailId: formValues['1-emailId'] ? formValues['1-emailId'] : null,
          contactPerson: formValues['1-contactPerson']
            ? formValues['1-contactPerson']
            : null
        };
        console.log(details, 'details');

        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.alertPopup.saveConfirmation'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.tabOne.emit(details);
            }
          });
      }
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
  public deleteButton(formGroup: FormGroup) {
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
        }
      });
  }
  public formGroupCreated(formGroup: FormGroup) {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.bankName = params['_bankName'];
        if (this.bankName && this.bankName !== 'new') {
          formGroup.get('1-bankname').disable({ onlySelf: true });
        }
      });
    this.towns$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      let selectedTown;
      const townArr: { value: string; description: string }[] = [];
      if (data?.length) {
        data.forEach(twns => {
          townArr.push({ value: twns.townCode, description: twns.description });
        });
        console.log('townArr', townArr);
        formGroup.get('1-city')['options'] = townArr;
        if (this.bankDetails.townName) {
          selectedTown = townArr.filter(x => x.description === this.bankDetails.townName);
          if(selectedTown?.length > 0)
            formGroup.get('1-city').patchValue(selectedTown[0].value);
        }
      }
    });
    this.formGroup.emit(formGroup);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
