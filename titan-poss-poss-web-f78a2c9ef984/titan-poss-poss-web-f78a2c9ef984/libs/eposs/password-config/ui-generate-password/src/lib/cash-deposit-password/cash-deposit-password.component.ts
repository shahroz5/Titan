import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import {
  AlertPopupServiceAbstraction,
  GenerateCashDepositPasswordRequest,
  GenerateCashDepositPasswordResponse,
  AlertPopupTypeEnum,
  LocationSummaryList,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cash-deposit-password',
  templateUrl: './cash-deposit-password.component.html',
  styleUrls: ['./cash-deposit-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashDepositPasswordComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() locationCodes$: Observable<LocationSummaryList[]>;
  @Input() generateCashDepositPasswordResponse$: Observable<
    GenerateCashDepositPasswordResponse
  >;
  @Output() generateCashDepositPasswordEvent = new EventEmitter<
    GenerateCashDepositPasswordRequest
  >();
  @Input() contextType: string;

  cashDepositPasswordForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  currentDate = moment();
  searchLocationPlaceHolder: string;
  selectLocationLableText: string;
  locationForSelection: SelectionDailogOption[] = [];
  minDate = moment('00010101');
  show = false;
  originalValue: any;
  getPasswordBtnDisable = false;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.locationCodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['contextType'] &&
      this.contextType &&
      this.cashDepositPasswordForm
    ) {
      this.resetValues();
      this.generateCashDepositPasswordEvent.emit(null);
    }
  }

  showPassword() {
    this.show = !this.show;
  }

  createForm() {
    this.translate
      .get([
        'pw.passwordConfig.locationCodePlaceHolder',
        'pw.passwordConfig.businessDatePlaceholder',
        'pw.passwordConfig.collectedDatePlaceholder',
        'pw.passwordConfig.depositAmountPlaceholder',
        'pw.passwordConfig.remarksLabel',
        'pw.passwordConfig.passwordLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.cashDepositPasswordForm = new FormGroup({
          locationCode: new FormControl(null, [
            this.fieldValidatorsService.requiredField(
              translatedMsg['pw.passwordConfig.locationCodePlaceHolder']
            )
          ]),

          businessDate: new FormControl(moment().format(), [
            this.fieldValidatorsService.requiredField(
              translatedMsg['pw.passwordConfig.businessDatePlaceholder']
            )
          ]),
          collectedDate: new FormControl(moment().format(), [
            this.fieldValidatorsService.requiredField(
              translatedMsg['pw.passwordConfig.collectedDatePlaceholder']
            )
          ]),
          depositAmount: new FormControl(null, [
            this.fieldValidatorsService.requiredField(
              translatedMsg['pw.passwordConfig.depositAmountPlaceholder']
            )
          ]),
          remarks: new FormControl(null, [
            this.fieldValidatorsService.requiredField(
              translatedMsg['pw.passwordConfig.remarksLabel']
            ),
            this.fieldValidatorsService.remarkField(
              translatedMsg['pw.passwordConfig.remarksLabel']
            )
          ]),
          password: new FormControl(null)
        });
      });
  }

  openLocationSelectionPopup() {
    this.dialog.closeAll();
    this.translate
      .get([
        'pw.passwordConfig.selectLocationPlaceHolder',
        'pw.passwordConfig.searchByLocationPlaceHolder'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.selectionDialog
          .open({
            title: translatedMsg['pw.passwordConfig.selectLocationPlaceHolder'],
            placeholder:
              translatedMsg['pw.passwordConfig.searchByLocationPlaceHolder'],
            options: this.locationForSelection
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((selectedOption: SelectionDailogOption) => {
            if (selectedOption) {
              this.cashDepositPasswordForm
                .get(['locationCode'])
                .patchValue(selectedOption.description);
            }
          });
      });
  }

  generatePassword() {
    const generateCashDepositPasswordRequest = {
      locationCode: this.cashDepositPasswordForm.value.locationCode.split(
        ' ',
        1
      )[0],
      businessDate: moment(
        this.cashDepositPasswordForm.value.businessDate
      ).valueOf(),
      remarks: this.cashDepositPasswordForm.value.remarks,
      collectionDate: moment(
        this.cashDepositPasswordForm.value.collectedDate
      ).valueOf(),
      depositAmount: this.cashDepositPasswordForm.value.depositAmount
    };
    this.generateCashDepositPasswordEvent.emit(
      generateCashDepositPasswordRequest
    );
  }

  onSubmit() {
    if (this.cashDepositPasswordForm.valid) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.passwordConfig.dataNotEnteredMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.generatePassword();
            this.generateCashDepositPasswordResponse$
              .pipe(takeUntil(this.destroy$))
              .subscribe((data: GenerateCashDepositPasswordResponse) => {
                if (data) {
                  this.cashDepositPasswordForm
                    .get(['password'])
                    .patchValue(data.password);
                  this.disableForm();
                }
              });
            this.getPasswordBtnDisable = true;
            this.originalValue = this.cashDepositPasswordForm.value;
            this.cashDepositPasswordForm.valueChanges
              .pipe(takeUntil(this.destroy$))
              .subscribe(changedValue => {
                const currentValue = this.cashDepositPasswordForm.value;

                if (
                  this.originalValue.locationCode !==
                    currentValue.locationCode ||
                  this.originalValue.businessDate !==
                    currentValue.businessDate ||
                  this.originalValue.collectedDate !==
                    currentValue.collectedDate ||
                  this.originalValue.depositAmount !==
                    currentValue.depositAmount
                ) {
                  this.getPasswordBtnDisable = false;
                }
              });
          }
        });
    }
  }

  resetValues() {
    this.enableForm();
    this.cashDepositPasswordForm.patchValue({
      locationCode: null,
      businessDate: moment().format(),
      collectedDate: moment().format(),
      remarks: null,
      password: null,
      depositAmount: null
    });
  }

  disableForm() {
    this.cashDepositPasswordForm.get('locationCode').disable({ emitEvent: false });
    this.cashDepositPasswordForm.get('businessDate').disable({ emitEvent: false });
    this.cashDepositPasswordForm.get('collectedDate').disable({ emitEvent: false });
    this.cashDepositPasswordForm.get('remarks').disable({ emitEvent: false });
    this.cashDepositPasswordForm.get('depositAmount').disable({ emitEvent: false });
  }

  enableForm() {
    this.cashDepositPasswordForm.get('locationCode').enable({ emitEvent: false });
    this.cashDepositPasswordForm.get('businessDate').enable({ emitEvent: false });
    this.cashDepositPasswordForm.get('collectedDate').enable({ emitEvent: false });
    this.cashDepositPasswordForm.get('remarks').enable({ emitEvent: false });
    this.cashDepositPasswordForm.get('depositAmount').enable({ emitEvent: false });
  }

  reset(cashDepositPasswordFormDirective){
   this.enableForm();
   cashDepositPasswordFormDirective.resetForm();
   }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
