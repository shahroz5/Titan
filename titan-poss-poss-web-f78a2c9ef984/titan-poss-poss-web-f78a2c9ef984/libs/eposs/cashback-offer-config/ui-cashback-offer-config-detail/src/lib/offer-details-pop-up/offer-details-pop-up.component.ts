import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OfferDetails } from '@poss-web/shared/models';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-offer-details-pop-up',
  templateUrl: './offer-details-pop-up.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferDetailsPopUpComponent implements OnInit, OnDestroy {
  dialogData: OfferDetails;

  maxSwipeAmt: string;
  minSwipeAmt: string;
  cashBackAmt: string;
  discount: string;
  maxDiscount: string;
  minInvoiceAmt: string;
  maxInvoiceAmt: string;
  validMinSwipeAmt = false;
  validMaxSwipeAmt = false;
  validMinInvoiceAmt = false;
  validMaxInvoiceAmt = false;
  validCashback = false;
  validDiscountPercent = false;
  validMaxDiscountPercent = false;
  destroy$ = new Subject<null>();
  offerDeatailsForm: FormGroup;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<OfferDetailsPopUpComponent>,
    private translationService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: OfferDetails
  ) {
    this.dialogData = data;
  }

  ngOnInit() {
    this.translationService
      .get([
        'pw.cashbackConfig.minSwipeAmt',
        'pw.cashbackConfig.maxSwipeAmt',
        'pw.cashbackConfig.cashBackAmt',
        'pw.cashbackConfig.discount%',
        'pw.cashbackConfig.maxDiscount%',
        'pw.cashbackConfig.minInvoiceAmt',
        'pw.cashbackConfig.maxInvoiceAmt'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.minSwipeAmt = translatedMsg['pw.cashbackConfig.minSwipeAmt'];
        this.maxSwipeAmt = translatedMsg['pw.cashbackConfig.maxSwipeAmt'];
        this.cashBackAmt = translatedMsg['pw.cashbackConfig.cashBackAmt'];
        this.discount = translatedMsg['pw.cashbackConfig.discount%'];
        this.maxDiscount = translatedMsg['pw.cashbackConfig.maxDiscount%'];
        this.minInvoiceAmt = translatedMsg['pw.cashbackConfig.minInvoiceAmt'];
        this.maxInvoiceAmt = translatedMsg['pw.cashbackConfig.maxInvoiceAmt'];
      });

    this.createOfferDetailsForm(this.dialogData);
  }

  createOfferDetailsForm(offerDetails: OfferDetails) {
    this.offerDeatailsForm = new FormGroup({
      minSwipeAmt: new FormControl(
        {
          value: offerDetails ? offerDetails.minSwipeAmt : '',
          disabled: offerDetails
            ? offerDetails.id
              ? !!offerDetails.id
              : false
            : false
        },
        [
          (this.fieldValidatorsService.requiredField(this.minSwipeAmt),
          this.fieldValidatorsService.amountField(this.minSwipeAmt))
        ]
      ),
      maxSwipeAmt: new FormControl(
        {
          value: offerDetails ? offerDetails.maxSwipeAmt : '',
          disabled: offerDetails
            ? offerDetails.id
              ? !!offerDetails.id
              : false
            : false
        },
        [
          (this.fieldValidatorsService.requiredField(this.maxSwipeAmt),
          this.fieldValidatorsService.amountField(this.maxSwipeAmt))
        ]
      ),
      discountAmt: new FormControl(
        {
          value: offerDetails ? offerDetails.discountAmt : '',
          disabled: offerDetails.isCashbackAmount
            ? !offerDetails.isCashbackAmount
            : true
        },
        [
          (this.fieldValidatorsService.requiredField(this.cashBackAmt),
          this.fieldValidatorsService.amountField(this.cashBackAmt))
        ]
      ),

      discountPercent: new FormControl(
        {
          value: offerDetails ? offerDetails.discountPercent : '',
          disabled: offerDetails.isCashbackAmount
            ? offerDetails.isCashbackAmount
            : false
        },
        [
          this.fieldValidatorsService.requiredField(this.discount),
          this.fieldValidatorsService.percentageField(this.discount)
        ]
      ),

      maxDiscountPercent: new FormControl(
        {
          value: offerDetails ? offerDetails.maxDiscountPercent : '',
          disabled: offerDetails.isCashbackAmount
            ? offerDetails.isCashbackAmount
            : false
        },
        [
          this.fieldValidatorsService.requiredField(this.maxDiscount),
          this.fieldValidatorsService.amountField(this.maxDiscount)
        ]
      ),
      minInvoiceAmt: new FormControl(
        {
          value: offerDetails ? offerDetails.minInvoiceAmt : '',
          disabled: offerDetails
            ? offerDetails.id
              ? !!offerDetails.id
              : false
            : false
        },
        [
          this.fieldValidatorsService.requiredField(this.minInvoiceAmt),
          this.fieldValidatorsService.amountField(this.minInvoiceAmt)
        ]
      ),
      maxInvoiceAmt: new FormControl(
        {
          value: offerDetails ? offerDetails.maxInvoiceAmt : '',
          disabled: offerDetails
            ? offerDetails.id
              ? !!offerDetails.id
              : false
            : false
        },
        [
          this.fieldValidatorsService.requiredField(this.maxInvoiceAmt),
          this.fieldValidatorsService.amountField(this.maxInvoiceAmt)
        ]
      )
    });
  }

  validateField(fieldName: string) {
    if (!this.dialogData.excludeCashback) {
      switch (fieldName) {
        case 'minSwipeAmt':
          if (
            this.offerDeatailsForm.get('minSwipeAmt').value !== '' &&
            this.dialogData.lastRowData &&
            fieldValidation.amountField.pattern.test(
              this.offerDeatailsForm.get('minSwipeAmt').value
            ) &&
            Number(this.offerDeatailsForm.get('minSwipeAmt').value) !==
              Number(this.dialogData.lastRowData.maxSwipeAmt) + 1
          ) {
            this.validMinSwipeAmt = false;
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([
                this.isGreaterThanPrevRow(
                  this.minSwipeAmt,
                  false,
                  this.maxSwipeAmt
                )
              ]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          } else {
            this.validMinSwipeAmt = true;
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([
                this.fieldValidatorsService.requiredField(this.minSwipeAmt),
                this.fieldValidatorsService.amountField(this.minSwipeAmt),
                this.isGreaterThanPrevRow(
                  this.minSwipeAmt,
                  true,
                  this.maxSwipeAmt
                )
              ]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          }
          this.validateField('maxSwipeAmt');
          break;
        case 'maxSwipeAmt':
          if (this.offerDeatailsForm.get('minSwipeAmt').value !== '') {
            this.offerDeatailsForm.get('maxSwipeAmt').markAsTouched();
            if (
              this.offerDeatailsForm.get('maxSwipeAmt').value !== '' &&
              (Number(this.offerDeatailsForm.get('maxSwipeAmt').value) <=
                Number(this.offerDeatailsForm.get('minSwipeAmt').value) )
            ) {
              this.validMaxSwipeAmt = false;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.isGreaterThanMin(this.maxSwipeAmt, false, this.minSwipeAmt),
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            } else if(this.offerDeatailsForm.get('maxSwipeAmt').value !== '' && this.dialogData.nextRowData && Number(this.offerDeatailsForm.get('maxSwipeAmt').value) + 1 !== Number(this.dialogData.nextRowData?.minSwipeAmt)) {
              this.validMaxSwipeAmt = false;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.isLessThanNextRow(this.maxSwipeAmt, true, this.minSwipeAmt)
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            } else {
              this.validMaxSwipeAmt = true;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.fieldValidatorsService.requiredField(this.maxSwipeAmt),
                  this.fieldValidatorsService.amountField(this.maxSwipeAmt)
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            }
          } else {
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([this.enterValue(this.minSwipeAmt, false)]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          }
          break;
        // case 'maxDiscountPercent':
        //   if (this.offerDeatailsForm.get('discountPercent').value !== '') {
        //     if (
        //       this.offerDeatailsForm.get('maxDiscountPercent').value !== '' &&
        //       Number(this.offerDeatailsForm.get('maxDiscountPercent').value) <
        //         Number(this.offerDeatailsForm.get('discountPercent').value)
        //     ) {
        //       this.validMaxSwipeAmt = false;
        //       this.offerDeatailsForm
        //         .get(fieldName)
        //         .setValidators([
        //           this.isGreaterThanOrEqualMin(
        //             this.maxDiscount,
        //             false,
        //             this.discount
        //           )
        //         ]);
        //       this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
        //     } else {
        //       this.validMaxSwipeAmt = true;
        //       this.offerDeatailsForm
        //         .get(fieldName)
        //         .setValidators([
        //           this.fieldValidatorsService.requiredField(this.maxDiscount),
        //           this.fieldValidatorsService.percentageField(this.maxDiscount)
        //         ]);
        //       this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
        //     }
        //   } else {
        //     this.offerDeatailsForm
        //       .get(fieldName)
        //       .setValidators([this.enterValue(this.discount, false)]);
        //     this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
        //   }
        //   break;
        case 'minInvoiceAmt':
          if (
            this.offerDeatailsForm.get('minInvoiceAmt').value !== '' &&
            this.dialogData.lastRowData &&
            fieldValidation.amountField.pattern.test(
              this.offerDeatailsForm.get('minInvoiceAmt').value
            ) &&
            Number(this.offerDeatailsForm.get('minInvoiceAmt').value) !==
              Number(this.dialogData.lastRowData.maxInvoiceAmt) + 1
          ) {
            this.validMinSwipeAmt = false;
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([
                this.isGreaterThanPrevRow(
                  this.minInvoiceAmt,
                  false,
                  this.maxInvoiceAmt
                )
              ]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          } else {
            this.validMinSwipeAmt = true;
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([
                this.fieldValidatorsService.requiredField(this.minInvoiceAmt),
                this.fieldValidatorsService.amountField(this.minInvoiceAmt),
                this.isGreaterThanPrevRow(
                  this.minInvoiceAmt,
                  true,
                  this.maxInvoiceAmt
                ),
                this.enterValue(this.discount, true),
                this.enterValue(this.minSwipeAmt, true)
              ]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          }
          this.validateField('maxInvoiceAmt');
          break;
        case 'maxInvoiceAmt':
          if (this.offerDeatailsForm.get('minInvoiceAmt').value !== '') {
            this.offerDeatailsForm.get('maxInvoiceAmt').markAsTouched()
            if (
              this.offerDeatailsForm.get('maxInvoiceAmt').value !== '' &&
              (Number(this.offerDeatailsForm.get('maxInvoiceAmt').value) <=
                Number(this.offerDeatailsForm.get('minInvoiceAmt').value) )
            ) {
              this.validMaxInvoiceAmt = false;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.isGreaterThanMin(
                    this.maxInvoiceAmt,
                    false,
                    this.minInvoiceAmt
                  )
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            } else if(this.offerDeatailsForm.get('maxInvoiceAmt').value !== '' && this.dialogData.nextRowData.minInvoiceAmt && Number(this.offerDeatailsForm.get('maxInvoiceAmt').value) + 1 !== Number(this.dialogData.nextRowData.minInvoiceAmt)) {
              this.validMaxInvoiceAmt = false;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.isLessThanNextRow(
                    this.maxInvoiceAmt,
                    true,
                    this.minInvoiceAmt
                  ),
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            } else {
              this.validMaxInvoiceAmt = true;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.fieldValidatorsService.requiredField(this.maxInvoiceAmt),
                  this.fieldValidatorsService.amountField(this.maxInvoiceAmt)
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            }
          } else {
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([this.enterValue(this.minInvoiceAmt, false)]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          }
          break;
        default:
          return;
      }
    } else {
      switch (fieldName) {
        case 'minSwipeAmt':
          let discountAmtLabel = this.dialogData.isCashbackAmount ? this.cashBackAmt : this.maxDiscount
          let discAmtField = this.dialogData.isCashbackAmount ? 'discountAmt' : 'maxDiscountPercent'
          if (
            this.offerDeatailsForm.get('minSwipeAmt').value !== '' &&
            fieldValidation.amountField.pattern.test(
              this.offerDeatailsForm.get('minSwipeAmt').value
            ) &&
            this.offerDeatailsForm.get('minInvoiceAmt').value !== '' &&
            (this.offerDeatailsForm.get(discAmtField).value !== '')  &&
            Number(this.offerDeatailsForm.get('minSwipeAmt').value) !==
              Number(this.offerDeatailsForm.get('minInvoiceAmt').value) - Number(this.offerDeatailsForm.get(discAmtField).value)
          ) {
            this.offerDeatailsForm.get('minSwipeAmt').markAsTouched();
            this.validMinSwipeAmt = false;
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([
                this.isDifference(
                  this.minSwipeAmt,
                  this.minInvoiceAmt,
                  discountAmtLabel
                )
              ]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          } else {
            this.validMinSwipeAmt = true;
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([
                this.fieldValidatorsService.requiredField(this.minSwipeAmt),
                this.fieldValidatorsService.amountField(this.minSwipeAmt),
                this.isGreaterThanPrevRow(
                  this.minSwipeAmt,
                  true,
                  this.maxSwipeAmt
                )
              ]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          }
          this.validateField('maxSwipeAmt');
          break;
        case 'maxSwipeAmt':
          if (this.offerDeatailsForm.get('minSwipeAmt').value !== '') {
            this.offerDeatailsForm.get('maxSwipeAmt').markAsTouched();
            if (
              this.offerDeatailsForm.get('maxSwipeAmt').value !== '' &&
              (Number(this.offerDeatailsForm.get('maxSwipeAmt').value) <=
                Number(this.offerDeatailsForm.get('minSwipeAmt').value) )
            ) {
              this.validMaxSwipeAmt = false;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.isGreaterThanMin(this.maxSwipeAmt, false, this.minSwipeAmt),
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            } else {
              this.validMaxSwipeAmt = true;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.fieldValidatorsService.requiredField(this.maxSwipeAmt),
                  this.fieldValidatorsService.amountField(this.maxSwipeAmt)
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            }
          } else {
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([this.enterValue(this.minSwipeAmt, false)]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          }
          break;

          if (this.offerDeatailsForm.get('discountPercent').value !== '') {
            if (
              this.offerDeatailsForm.get('maxDiscountPercent').value !== '' &&
              Number(this.offerDeatailsForm.get('maxDiscountPercent').value) <
                Number(this.offerDeatailsForm.get('discountPercent').value)
            ) {
              this.validMaxSwipeAmt = false;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.isGreaterThanOrEqualMin(
                    this.maxDiscount,
                    false,
                    this.discount
                  )
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            } else {
              this.validMaxSwipeAmt = true;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.fieldValidatorsService.requiredField(this.maxDiscount),
                  this.fieldValidatorsService.amountField(this.maxDiscount)
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            }
          } else {
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([this.enterValue(this.discount, false)]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          }
          break;
        case 'maxDiscountPercent':
        case 'discountAmt':
          let discountLabel = this.dialogData.isCashbackAmount ? this.cashBackAmt : this.maxDiscount
          if (
            this.offerDeatailsForm.get('minSwipeAmt').value !== '' &&
            this.offerDeatailsForm.get('minInvoiceAmt').value !== '' &&
            this.offerDeatailsForm.get(fieldName).value !== '' &&
            fieldValidation.amountField.pattern.test(
              this.offerDeatailsForm.get(fieldName).value
            ) &&
            Number(this.offerDeatailsForm.get('minSwipeAmt').value) !==
              Number(this.offerDeatailsForm.get('minInvoiceAmt').value) - Number(this.offerDeatailsForm.get(fieldName).value)
            ) {
              this.offerDeatailsForm
              .get(fieldName)
              .setValidators([
                this.isDifference(
                  discountLabel,
                  this.minInvoiceAmt,
                  this.minSwipeAmt,
                )
              ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            }
            break;
          case 'minInvoiceAmt':
          if (
            this.offerDeatailsForm.get('minInvoiceAmt').value !== '' &&
            this.dialogData.lastRowData &&
            fieldValidation.amountField.pattern.test(
              this.offerDeatailsForm.get('minInvoiceAmt').value
            ) &&
            Number(this.offerDeatailsForm.get('minInvoiceAmt').value) !==
              Number(this.dialogData.lastRowData.maxInvoiceAmt) + 1
          ) {
            this.validMinSwipeAmt = false;
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([
                this.isGreaterThanPrevRow(
                  this.minInvoiceAmt,
                  false,
                  this.maxInvoiceAmt
                )
              ]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          } else {
            this.validMinSwipeAmt = true;
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([
                this.fieldValidatorsService.requiredField(this.minInvoiceAmt),
                this.fieldValidatorsService.amountField(this.minInvoiceAmt),
                this.isGreaterThanPrevRow(
                  this.minInvoiceAmt,
                  true,
                  this.maxInvoiceAmt
                ),
                this.enterValue(this.discount, true),
                this.enterValue(this.minSwipeAmt, true)
              ]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          }
          this.validateField('maxInvoiceAmt');
          this.validateField('minSwipeAmt');
          break;
        case 'maxInvoiceAmt':
          if (this.offerDeatailsForm.get('minInvoiceAmt').value !== '') {
            this.offerDeatailsForm.get('maxInvoiceAmt').markAsTouched()
            if (
              this.offerDeatailsForm.get('maxInvoiceAmt').value !== '' &&
              (Number(this.offerDeatailsForm.get('maxInvoiceAmt').value) <=
                Number(this.offerDeatailsForm.get('minInvoiceAmt').value) )
            ) {
              this.validMaxInvoiceAmt = false;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.isGreaterThanMin(
                    this.maxInvoiceAmt,
                    false,
                    this.minInvoiceAmt
                  )
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            } else if(this.offerDeatailsForm.get('maxInvoiceAmt').value !== '' && this.dialogData.nextRowData?.minInvoiceAmt && Number(this.offerDeatailsForm.get('maxInvoiceAmt').value) + 1 !== Number(this.dialogData.nextRowData?.minInvoiceAmt)) {
              this.validMaxInvoiceAmt = false;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.isLessThanNextRow(
                    this.maxInvoiceAmt,
                    true,
                    this.minInvoiceAmt
                  ),
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            } else {
              this.validMaxInvoiceAmt = true;
              this.offerDeatailsForm
                .get(fieldName)
                .setValidators([
                  this.fieldValidatorsService.requiredField(this.maxInvoiceAmt),
                  this.fieldValidatorsService.amountField(this.maxInvoiceAmt)
                ]);
              this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
            }
          } else {
            this.offerDeatailsForm
              .get(fieldName)
              .setValidators([this.enterValue(this.minInvoiceAmt, false)]);
            this.offerDeatailsForm.controls[fieldName].updateValueAndValidity();
          }
          break;
        default:
          return;
      }
    }
  }

  save() {
    this.dialogRef.close({
      type: 'save',
      data: this.createResponse()
    });
  }

  isGreaterThanPrevRow(
    formControlName: string,
    isGreater: boolean,
    lastRowFieldLabel: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let errorMessage = '';
      this.translationService
        .get('pw.cashbackConfig.greaterThanPrevRowErrorMsg', {
          fieldName1: formControlName,
          fieldName2: lastRowFieldLabel
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          errorMessage = errorMsg;
        });

      if (isGreater === false) {
        errors = {
          errorArray: [errorMessage]
        };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  isDifference(
    field1: string,
    field2: string,
    field3: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let errorMessage = '';
      this.translationService
        .get('pw.cashbackConfig.differenceErrorMsg', {
          fieldName1: field1,
          fieldName2: field2,
          fieldName3: field3,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          errorMessage = errorMsg;
        });

        errors = {
          errorArray: [errorMessage]
        };

      return Object.keys(errors).length ? errors : null;
    };
  }

  isLessThanNextRow(
    formControlName: string,
    isGreater: boolean,
    nextRowFieldLabel: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let errorMessage = '';
      this.translationService
        .get('pw.cashbackConfig.lessThanPrevRowErrorMsg', {
          fieldName1: formControlName,
          fieldName2: nextRowFieldLabel
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          errorMessage = errorMsg;
        });

      if (isGreater === true) {
        errors = {
          errorArray: [errorMessage]
        };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  isGreaterThanOrEqualMin(
    formControlName: string,
    isGreater: boolean,
    minValueLabel: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let uniqueErrorMessage = '';
      this.translationService
        .get('pw.cashbackConfig.greaterThanOrEqualMinErrorMsg', {
          fieldName1: formControlName,
          fieldName2: minValueLabel
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          uniqueErrorMessage = errorMsg;
        });

      if (isGreater === false) {
        errors = {
          errorArray: [uniqueErrorMessage]
        };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }
  isGreaterThanMin(
    formControlName: string,
    isGreater: boolean,
    minValueLabel: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let uniqueErrorMessage = '';
      this.translationService
        .get('pw.cashbackConfig.greaterThanMinErrorMsg', {
          fieldName1: formControlName,
          fieldName2: minValueLabel
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          uniqueErrorMessage = errorMsg;
        });

      if (isGreater === false) {
        errors = {
          errorArray: [uniqueErrorMessage]
        };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  enterValue(fieldLabel: string, minValue: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let uniqueErrorMessage = '';
      this.translationService
        .get('pw.cashbackConfig.enterMinValueErrorMsg', {
          fieldName: fieldLabel
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          uniqueErrorMessage = errorMsg;
        });

      if (minValue === false) {
        errors = {
          errorArray: [uniqueErrorMessage]
        };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }
  createResponse() {
    return {
      discountAmt: this.offerDeatailsForm.get('discountAmt')
        ? this.offerDeatailsForm.get('discountAmt').value
        : '',
      discountPercent: this.offerDeatailsForm.get('discountPercent')
        ? this.offerDeatailsForm.get('discountPercent').value
        : '',
      maxDiscountPercent: this.offerDeatailsForm.get('maxDiscountPercent')
        ? this.offerDeatailsForm.get('maxDiscountPercent').value
        : '',
      maxInvoiceAmt: this.offerDeatailsForm.get('maxInvoiceAmt')
        ? this.offerDeatailsForm.get('maxInvoiceAmt').value
        : '',
      maxSwipeAmt: this.offerDeatailsForm.get('maxSwipeAmt')
        ? this.offerDeatailsForm.get('maxSwipeAmt').value
        : '',
      minInvoiceAmt: this.offerDeatailsForm.get('minInvoiceAmt')
        ? this.offerDeatailsForm.get('minInvoiceAmt').value
        : '',
      minSwipeAmt: this.offerDeatailsForm.get('minSwipeAmt')
        ? this.offerDeatailsForm.get('minSwipeAmt').value
        : '',
      isCashbackAmount: this.dialogData.isCashbackAmount
        ? this.dialogData.isCashbackAmount
        : '',
      id: this.dialogData.id ? this.dialogData.id : '',
      mode: this.dialogData.mode ? this.dialogData.mode : '',
      rowId: this.dialogData.rowId ? this.dialogData.rowId : ''
    };
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  close() {
    this.dialogRef.close();
  }
}
