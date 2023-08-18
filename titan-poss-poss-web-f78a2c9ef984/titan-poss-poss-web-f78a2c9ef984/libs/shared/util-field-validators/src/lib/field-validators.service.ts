import {
  CurrencyFormatterService,
  DateFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { Injectable, OnDestroy } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { fieldValidation } from './field-validators.pattern';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoleTypes } from '@poss-web/shared/models';
import { Moment } from 'moment';
import * as moment from 'moment';

/**
 *  Non - Static Validators Service
 */
@Injectable({
  providedIn: 'root'
})
export class FieldValidatorsService implements OnDestroy {
  destroy$ = new Subject<null>();
  constructor(
    private traslateService: TranslateService,
    private dateFormatterService: DateFormatterService,
    private currencyFormatterService: CurrencyFormatterService
  ) {}

  isEmptyInputValue(value: any): boolean {
    if (value !== '' && value !== null && value !== undefined) {
      value = String(value);
    }
    return value == null || value.length === 0;
  }

  returnErrorMessage(
    control,
    pattern,
    patternErrorMsg,
    formControlName,
    maximumAmountAllowed?: number,
    minimumAmountAllowed?: number
  ) {
    if (this.isEmptyInputValue(control.value)) {
      return null;
    }
    let errors: ValidationErrors = {};
    const value: string = control.value;
    let errorMessage = '';
    let amountLimitErrorMessages = [];
    this.traslateService
      .get('pw.fieldValidators.invalidErrorMsg', {
        fieldName: formControlName
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(errorMsg => {
        errorMessage = errorMsg;
      });
    if (!pattern.test(value)) {
      errors = {
        errorArray: [errorMessage, patternErrorMsg]
      };
    }
    this.traslateService
      .get(
        [
          'pw.fieldValidators.maximumAmountLimitErrorMessage',
          'pw.fieldValidators.minimumAmountLimitErrorMessage'
        ],
        {
          maximumAmount: maximumAmountAllowed,
          minimumAmount: minimumAmountAllowed
        }
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedErrorMessages => {
        amountLimitErrorMessages = [
          translatedErrorMessages[
            'pw.fieldValidators.maximumAmountLimitErrorMessage'
          ],
          translatedErrorMessages[
            'pw.fieldValidators.minimumAmountLimitErrorMessage'
          ]
        ];
      });
    // [`Minimum amount should be ${minimumAmountAllowed}`, `Maximum amount should be ${maximumAmountAllowed}`]
    if (
      (maximumAmountAllowed && Number(value) > maximumAmountAllowed) ||
      (minimumAmountAllowed && Number(value) < minimumAmountAllowed)
    ) {
      errors = {
        errorArray: [errorMessage, amountLimitErrorMessages]
      };
    }
    return Object.keys(errors).length ? errors : null;
  }

  requiredField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let errorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.requiredErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          errorMessage = errorMsg;
        });
      if (this.isEmptyInputValue(control.value)) {
        errors = {
          errorArray: [errorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  requiredTrueField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let errorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.requiredErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          errorMessage = errorMsg;
        });
      if (Validators.requiredTrue(control)) {
        errors = {
          errorArray: [errorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  isUniqueCheck(formControlName: string, isUnique: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let uniqueErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.uniqueCheckErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          uniqueErrorMessage = errorMsg;
        });

      if (isUnique === false) {
        errors = {
          errorArray: [uniqueErrorMessage]
        };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  gstCustomValidate(
    formControlName: string,
    gstFirstTwoDigit: any
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let errors: ValidationErrors = {};
      let gstFirstTwoDigitErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.gstFirstTwoDigitErrorMsg', {
          fieldName: formControlName,
          stateTaxCode: gstFirstTwoDigit
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          gstFirstTwoDigitErrorMessage = errorMsg;
        });
      if (this.isEmptyInputValue(control.value)) {
        return null;
      } else {
        if (control.value.startsWith(gstFirstTwoDigit)) {
          return null;
        } else {
          errors = {
            errorArray: [gstFirstTwoDigitErrorMessage]
          };
        }

        return Object.keys(errors).length ? errors : null;
      }
    };
  }

  emailField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.emailField.pattern;
      let emailErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.emailPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          emailErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        emailErrorMessage,
        formControlName
      );
    };
  }

  mobileSeriesCheck(
    formControlName: string,
    startSeries: string[]
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let mobilePatternErrorMessage = null;
      let mobileStartSeriesErrorMessage = null;
      const pattern: RegExp = fieldValidation.customerMobileField.pattern;
      this.traslateService
        .get(
          [
            'pw.fieldValidators.customerMobilePatternErrorMsg',
            'pw.fieldValidators.customerMobileStartSeriesErrorMsg'
          ],
          {
            fieldName: formControlName,
            startSeries: startSeries
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          mobilePatternErrorMessage =
            errorMsg['pw.fieldValidators.customerMobilePatternErrorMsg'];
          mobileStartSeriesErrorMessage =
            errorMsg['pw.fieldValidators.customerMobileStartSeriesErrorMsg'];
        });
      const mobileErrorMsg = [
        mobilePatternErrorMessage,
        mobileStartSeriesErrorMessage
      ];
      if (this.isEmptyInputValue(control.value)) {
        return null;
      } else {
        const startSeriesInInteger = startSeries.map(i => Number(i));
        const isSeriesPresent = startSeries.find(element =>
          control.value.startsWith(element)
        );
        if (
          isSeriesPresent !== undefined &&
          isSeriesPresent !== null &&
          isSeriesPresent !== ''
        ) {
          let errors: ValidationErrors = {};
          const value: string = control.value;
          let errorMessage = '';
          this.traslateService
            .get('pw.fieldValidators.invalidErrorMsg', {
              fieldName: formControlName
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(errorMsg => {
              errorMessage = errorMsg;
            });
          if (!pattern.test(value)) {
            errors = {
              errorArray: [errorMessage, mobileErrorMsg]
            };
          }
          return Object.keys(errors).length ? errors : null;
        } else {
          let errors: ValidationErrors = {};
          let errorMessage = '';
          this.traslateService
            .get('pw.fieldValidators.invalidErrorMsg', {
              fieldName: formControlName
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(errorMsg => {
              errorMessage = errorMsg;
            });
          errors = {
            errorArray: [errorMessage, mobileErrorMsg]
          };

          return Object.keys(errors).length ? errors : null;
        }
      }
    };
  }

  mobileSeriesCheckInternational(
    formControlName: string,
    startSeries: string[]
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let mobileStartSeriesErrorMessage = null;
      this.traslateService
        .get(['pw.fieldValidators.customerIntMobileStartSeriesErrorMsg'], {
          fieldName: formControlName,
          startSeries: startSeries
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          mobileStartSeriesErrorMessage =
            errorMsg['pw.fieldValidators.customerIntMobileStartSeriesErrorMsg'];
        });
      const mobileErrorMsg = [mobileStartSeriesErrorMessage];
      if (this.isEmptyInputValue(control.value)) {
        return null;
      } else {
        const isSeriesPresent = startSeries.find(element =>
          control.value.startsWith(element)
        );
        if (
          isSeriesPresent !== undefined &&
          isSeriesPresent !== null &&
          isSeriesPresent !== ''
        ) {
          return null;
        } else {
          let errors: ValidationErrors = {};
          let errorMessage = '';
          this.traslateService
            .get('pw.fieldValidators.invalidErrorMsg', {
              fieldName: formControlName
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(errorMsg => {
              errorMessage = errorMsg;
            });
          errors = {
            errorArray: [errorMessage, mobileErrorMsg]
          };

          return Object.keys(errors).length ? errors : null;
        }
      }
    };
  }

  amountField(
    formControlName: string,
    maximumAmountAllowed?: number,
    minimumAmountAllowed?: number,
    decimalNotAllowed?: boolean
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.amountField.pattern;
      const pattern1: RegExp = fieldValidation.amountNoDecimalField.pattern;
      let amountErrorMessage1 = '';
      let amountErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.amountRangeErrorMsg',
            'pw.fieldValidators.amountTypeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          amountErrorMessage1 =
            errorMsg['pw.fieldValidators.amountRangeErrorMsg'];
          amountErrorMessage2 =
            errorMsg['pw.fieldValidators.amountTypeErrorMsg'];
        });
      const amountErrorMessage = [amountErrorMessage1, amountErrorMessage2];
      const amountErrorMessageNoDecimal = [amountErrorMessage1];
      if (decimalNotAllowed) {
        return this.returnErrorMessage(
          control,
          pattern1,
          amountErrorMessageNoDecimal,
          formControlName,
          maximumAmountAllowed,
          minimumAmountAllowed
        );
      } else {
        return this.returnErrorMessage(
          control,
          pattern,
          amountErrorMessage,
          formControlName,
          maximumAmountAllowed,
          minimumAmountAllowed
        );
      }
    };
  }

  numbersField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.numbersField.pattern;
      let numberErrorMessage1 = '';
      let numberErrorMessage2 = '';
      let numberErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.numbersAllowedTypeErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeAErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          numberErrorMessage1 =
            errorMsg['pw.fieldValidators.numbersAllowedTypeErrorMsg'];
          numberErrorMessage2 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeAErrorMsg'];
          numberErrorMessage3 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'];
        });
      const numberErrorMessage = [
        numberErrorMessage1,
        numberErrorMessage2,
        numberErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        numberErrorMessage,
        formControlName
      );
    };
  }

  alphaNumericField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.alphaNumericField.pattern;
      let alphanumericErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.alphanumericPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          alphanumericErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        alphanumericErrorMessage,
        formControlName
      );
    };
  }

  alphaNumericWithSpaceField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp =
        fieldValidation.alphaNumericWithSpaceField.pattern;
      let alphaNumericWithSpaceErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.alphaNumericwithspacePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          alphaNumericWithSpaceErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        alphaNumericWithSpaceErrorMessage,
        formControlName
      );
    };
  }

  cpgGroupNameField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.cpgGroupNameField.pattern;
      let cpgGroupNameErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.cpgGroupNamePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          cpgGroupNameErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        cpgGroupNameErrorMessage,
        formControlName
      );
    };
  }

  commaSaperatedNumberField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.commaSaperatedNumberField.pattern;
      let errorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.commaSaperatedNumberErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          errorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        errorMessage,
        formControlName
      );
    };
  }

  binCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.binCodeField.pattern;
      let bincodeErrorMessage1 = '';
      let bincodeErrorMessage2 = '';
      let bincodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.bincodeLengthErrorMsg',
            'pw.fieldValidators.bincodeTypeErrorMsg',
            'pw.fieldValidators.bincodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          bincodeErrorMessage1 =
            errorMsg['pw.fieldValidators.bincodeLengthErrorMsg'];
          bincodeErrorMessage2 =
            errorMsg['pw.fieldValidators.bincodeTypeErrorMsg'];
          bincodeErrorMessage3 =
            errorMsg['pw.fieldValidators.bincodeFirstCharErrorMsg'];
        });
      const bincodeErrorMessage = [
        bincodeErrorMessage1,
        bincodeErrorMessage2,
        bincodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        bincodeErrorMessage,
        formControlName
      );
    };
  }

  binGroupCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.binGroupCodeField.pattern;
      let bingroupcodeErrorMessage1 = '';
      let bingroupcodeErrorMessage2 = '';
      let bingroupcodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.bingroupLengthErrorMsg',
            'pw.fieldValidators.bingroupTypeErrorMsg',
            'pw.fieldValidators.bingroupFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          bingroupcodeErrorMessage1 =
            errorMsg['pw.fieldValidators.bingroupLengthErrorMsg'];
          bingroupcodeErrorMessage2 =
            errorMsg['pw.fieldValidators.bingroupTypeErrorMsg'];
          bingroupcodeErrorMessage3 =
            errorMsg['pw.fieldValidators.bingroupFirstCharErrorMsg'];
        });
      const bingroupcodeErrorMessage = [
        bingroupcodeErrorMessage1,
        bingroupcodeErrorMessage2,
        bingroupcodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        bingroupcodeErrorMessage,
        formControlName
      );
    };
  }

  brandCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.brandCodeField.pattern;
      let brandcodeErrorMessage1 = '';
      let brandcodeErrorMessage2 = '';
      let brandcodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.brandcodeLengthErrorMsg',
            'pw.fieldValidators.brandcodeTypeErrorMsg',
            'pw.fieldValidators.brandcodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          brandcodeErrorMessage1 =
            errorMsg['pw.fieldValidators.brandcodeLengthErrorMsg'];
          brandcodeErrorMessage2 =
            errorMsg['pw.fieldValidators.brandcodeTypeErrorMsg'];
          brandcodeErrorMessage3 =
            errorMsg['pw.fieldValidators.brandcodeFirstCharErrorMsg'];
        });
      const brandcodeErrorMessage = [
        brandcodeErrorMessage1,
        brandcodeErrorMessage2,
        brandcodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        brandcodeErrorMessage,
        formControlName
      );
    };
  }

  subBrandCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.subBrandCodeField.pattern;
      let subbrandcodeErrorMessage1 = '';
      let subbrandcodeErrorMessage2 = '';
      let subbrandcodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.subbrandcodeLengthErrorMsg',
            'pw.fieldValidators.subbrandcodeTypeErrorMsg',
            'pw.fieldValidators.subbrandcodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          subbrandcodeErrorMessage1 =
            errorMsg['pw.fieldValidators.subbrandcodeLengthErrorMsg'];
          subbrandcodeErrorMessage2 =
            errorMsg['pw.fieldValidators.subbrandcodeTypeErrorMsg'];
          subbrandcodeErrorMessage3 =
            errorMsg['pw.fieldValidators.subbrandcodeFirstCharErrorMsg'];
        });
      const subbrandcodeErrorMessage = [
        subbrandcodeErrorMessage1,
        subbrandcodeErrorMessage2,
        subbrandcodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        subbrandcodeErrorMessage,
        formControlName
      );
    };
  }

  regionCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.regionCodeField.pattern;
      let regioncodeErrorMessage1 = '';
      let regioncodeErrorMessage2 = '';
      let regioncodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.regioncodeLengthErrorMsg',
            'pw.fieldValidators.regioncodeTypeErrorMsg',
            'pw.fieldValidators.regioncodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          regioncodeErrorMessage1 =
            errorMsg['pw.fieldValidators.regioncodeLengthErrorMsg'];
          regioncodeErrorMessage2 =
            errorMsg['pw.fieldValidators.regioncodeTypeErrorMsg'];
          regioncodeErrorMessage3 =
            errorMsg['pw.fieldValidators.regioncodeFirstCharErrorMsg'];
        });
      const regioncodeErrorMessage = [
        regioncodeErrorMessage1,
        regioncodeErrorMessage2,
        regioncodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        regioncodeErrorMessage,
        formControlName
      );
    };
  }

  subRegionCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.subRegionCodeField.pattern;
      let subregioncodeErrorMessage1 = '';
      let subregioncodeErrorMessage2 = '';
      let subregioncodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.subregioncodeLengthErrorMsg',
            'pw.fieldValidators.subregioncodeTypeErrorMsg',
            'pw.fieldValidators.subregioncodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          subregioncodeErrorMessage1 =
            errorMsg['pw.fieldValidators.subregioncodeLengthErrorMsg'];
          subregioncodeErrorMessage2 =
            errorMsg['pw.fieldValidators.subregioncodeTypeErrorMsg'];
          subregioncodeErrorMessage3 =
            errorMsg['pw.fieldValidators.subregioncodeFirstCharErrorMsg'];
        });
      const subregioncodeErrorMessage = [
        subregioncodeErrorMessage1,
        subregioncodeErrorMessage2,
        subregioncodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        subregioncodeErrorMessage,
        formControlName
      );
    };
  }

  stoneCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.stoneCodeField.pattern;
      let stonecodeErrorMessage1 = '';
      let stonecodeErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.stonecodeLengthErrorMsg',
            'pw.fieldValidators.stonecodeTypeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          stonecodeErrorMessage1 =
            errorMsg['pw.fieldValidators.stonecodeLengthErrorMsg'];
          stonecodeErrorMessage2 =
            errorMsg['pw.fieldValidators.stonecodeTypeErrorMsg'];
        });
      const stonecodeErrorMessage = [
        stonecodeErrorMessage1,
        stonecodeErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        stonecodeErrorMessage,
        formControlName
      );
    };
  }

  materialCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.materialCodeField.pattern;
      let materialcodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.materialcodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          materialcodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        materialcodeErrorMessage,
        formControlName
      );
    };
  }

  marketCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.marketCodeField.pattern;
      let marketcodeErrorMessage1 = '';
      let marketcodeErrorMessage2 = '';
      let marketcodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.marketcodeLengthErrorMsg',
            'pw.fieldValidators.marketcodeTypeErrorMsg',
            'pw.fieldValidators.marketcodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          marketcodeErrorMessage1 =
            errorMsg['pw.fieldValidators.marketcodeLengthErrorMsg'];
          marketcodeErrorMessage2 =
            errorMsg['pw.fieldValidators.marketcodeTypeErrorMsg'];
          marketcodeErrorMessage3 =
            errorMsg['pw.fieldValidators.marketcodeFirstCharErrorMsg'];
        });
      const marketcodeErrorMessage = [
        marketcodeErrorMessage1,
        marketcodeErrorMessage2,
        marketcodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        marketcodeErrorMessage,
        formControlName
      );
    };
  }

  priceGroupTypeCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.priceGroupTypeCodeField.pattern;
      let pricegrouptypecodeErrorMessage1 = '';
      let pricegrouptypecodeErrorMessage2 = '';
      let pricegrouptypecodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.pricegroupTypecodeLengthErrorMsg',
            'pw.fieldValidators.pricegroupTypecodeTypeErrorMsg',
            'pw.fieldValidators.pricegroupTypecodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          pricegrouptypecodeErrorMessage1 =
            errorMsg['pw.fieldValidators.pricegroupTypecodeLengthErrorMsg'];
          pricegrouptypecodeErrorMessage2 =
            errorMsg['pw.fieldValidators.pricegroupTypecodeTypeErrorMsg'];
          pricegrouptypecodeErrorMessage3 =
            errorMsg['pw.fieldValidators.pricegroupTypecodeFirstCharErrorMsg'];
        });
      const pricegrouptypecodeErrorMessage = [
        pricegrouptypecodeErrorMessage1,
        pricegrouptypecodeErrorMessage2,
        pricegrouptypecodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        pricegrouptypecodeErrorMessage,
        formControlName
      );
    };
  }

  paymentCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.paymentCodeField.pattern;
      let paymentcodeErrorMessage1 = '';
      let paymentcodeErrorMessage2 = '';
      let paymentcodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.paymentcodeLengthErrorMsg',
            'pw.fieldValidators.paymentcodeTypeErrorMsg',
            'pw.fieldValidators.paymentcodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          paymentcodeErrorMessage1 =
            errorMsg['pw.fieldValidators.paymentcodeLengthErrorMsg'];
          paymentcodeErrorMessage2 =
            errorMsg['pw.fieldValidators.paymentcodeTypeErrorMsg'];
          paymentcodeErrorMessage3 =
            errorMsg['pw.fieldValidators.paymentcodeFirstCharErrorMsg'];
        });
      const paymentcodeErrorMessage = [
        paymentcodeErrorMessage1,
        paymentcodeErrorMessage2,
        paymentcodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        paymentcodeErrorMessage,
        formControlName
      );
    };
  }

  depreciationCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.depreciationCodeField.pattern;
      let depriciationcodeErrorMessage1 = '';
      let depriciationcodeErrorMessage2 = '';
      let depriciationcodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.depriciationcodeLengthErrorMsg',
            'pw.fieldValidators.depriciationcodeTypeErrorMsg',
            'pw.fieldValidators.depriciationcodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          depriciationcodeErrorMessage1 =
            errorMsg['pw.fieldValidators.depriciationcodeLengthErrorMsg'];
          depriciationcodeErrorMessage2 =
            errorMsg['pw.fieldValidators.depriciationcodeTypeErrorMsg'];
          depriciationcodeErrorMessage3 =
            errorMsg['pw.fieldValidators.depriciationcodeFirstCharErrorMsg'];
        });
      const depriciationcodeErrorMessage = [
        depriciationcodeErrorMessage1,
        depriciationcodeErrorMessage2,
        depriciationcodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        depriciationcodeErrorMessage,
        formControlName
      );
    };
  }

  cfaProductCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.cfaProductCodeField.pattern;
      let cfaproductcodeErrorMessage1 = '';
      let cfaproductcodeErrorMessage2 = '';
      let cfaproductcodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.cfaproductcodeLengthErrorMsg',
            'pw.fieldValidators.cfaproductcodeTypeErrorMsg',
            'pw.fieldValidators.cfaproductcodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          cfaproductcodeErrorMessage1 =
            errorMsg['pw.fieldValidators.cfaproductcodeLengthErrorMsg'];
          cfaproductcodeErrorMessage2 =
            errorMsg['pw.fieldValidators.cfaproductcodeTypeErrorMsg'];
          cfaproductcodeErrorMessage3 =
            errorMsg['pw.fieldValidators.cfaproductcodeFirstCharErrorMsg'];
        });
      const cfaproductcodeErrorMessage = [
        cfaproductcodeErrorMessage1,
        cfaproductcodeErrorMessage2,
        cfaproductcodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        cfaproductcodeErrorMessage,
        formControlName
      );
    };
  }

  colorField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.colorField.pattern;
      let colorErrorMessage1 = null;
      let colorErrorMessage2 = null;
      this.traslateService
        .get(
          [
            'pw.fieldValidators.colorPatternErrorMsg',
            'pw.fieldValidators.colorFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          colorErrorMessage1 =
            errorMsg['pw.fieldValidators.colorPatternErrorMsg'];
          colorErrorMessage2 =
            errorMsg['pw.fieldValidators.colorFirstCharErrorMsg'];
        });

      const colorErrorMessage = [colorErrorMessage1, colorErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        colorErrorMessage,
        formControlName
      );
    };
  }

  daysField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.daysField.pattern;
      let daysErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.daysPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          daysErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        daysErrorMessage,
        formControlName
      );
    };
  }

  descriptionField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.descriptionField.pattern;
      let descriptionErrorMessage1 = null;
      let descriptionErrorMessage2 = null;
      this.traslateService
        .get(
          [
            'pw.fieldValidators.descriptionPatternErrorMsg',
            'pw.fieldValidators.descriptionFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          descriptionErrorMessage1 =
            errorMsg['pw.fieldValidators.descriptionPatternErrorMsg'];
          descriptionErrorMessage2 =
            errorMsg['pw.fieldValidators.descriptionFirstCharErrorMsg'];
        });
      const descriptionErrorMessage = [
        descriptionErrorMessage1,
        descriptionErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        descriptionErrorMessage,
        formControlName
      );
    };
  }

  gstNumberField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.gstNumberField.pattern;
      let gstnumberErrorMessage1 = '';
      let gstnumberErrorMessage2 = '';
      let gstnumberErrorMessage3 = '';
      let gstnumberErrorMessage4 = '';
      let gstnumberErrorMessage5 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.gstnumberStateCodeErrorMsg',
            'pw.fieldValidators.gstnumberPanErrorMsg',
            'pw.fieldValidators.gstnumberRegErrorMsg',
            'pw.fieldValidators.gstnumberDefaultErrorMsg',
            'pw.fieldValidators.gstnumberChecksumErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          gstnumberErrorMessage1 =
            errorMsg['pw.fieldValidators.gstnumberStateCodeErrorMsg'];
          gstnumberErrorMessage2 =
            errorMsg['pw.fieldValidators.gstnumberPanErrorMsg'];
          gstnumberErrorMessage3 =
            errorMsg['pw.fieldValidators.gstnumberRegErrorMsg'];
          gstnumberErrorMessage4 =
            errorMsg['pw.fieldValidators.gstnumberDefaultErrorMsg'];
          gstnumberErrorMessage5 =
            errorMsg['pw.fieldValidators.gstnumberChecksumErrorMsg'];
        });
      const gstnumberErrorMessage = [
        gstnumberErrorMessage1,
        gstnumberErrorMessage2,
        gstnumberErrorMessage3,
        gstnumberErrorMessage4,
        gstnumberErrorMessage5
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        gstnumberErrorMessage,
        formControlName
      );
    };
  }

  passportIdField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.passportIdField.pattern;
      let passportIdErrorMessage1 = '';
      let passportIdErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.passportIdLengthErrorMsg',
            'pw.fieldValidators.passportIdTypeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          passportIdErrorMessage1 =
            errorMsg['pw.fieldValidators.passportIdLengthErrorMsg'];
          passportIdErrorMessage2 =
            errorMsg['pw.fieldValidators.passportIdTypeErrorMsg'];
        });
      const passportIdErrorMessage = [
        passportIdErrorMessage1,
        passportIdErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        passportIdErrorMessage,
        formControlName
      );
    };
  }

  karatField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.karatField.pattern;
      let karatErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.karatPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          karatErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        karatErrorMessage,
        formControlName
      );
    };
  }

  zipcodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.zipcodeField.pattern;
      let zipcodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.zipcodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          zipcodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        zipcodeErrorMessage,
        formControlName
      );
    };
  }

  factorField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.factorField.pattern;
      let factorErrorMessage1 = '';
      let factorErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.factorValueErrorMsg',
            'pw.fieldValidators.factorRangeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          factorErrorMessage1 =
            errorMsg['pw.fieldValidators.factorValueErrorMsg'];
          factorErrorMessage2 =
            errorMsg['pw.fieldValidators.factorRangeErrorMsg'];
        });
      const factorErrorMessage = [factorErrorMessage1, factorErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        factorErrorMessage,
        formControlName
      );
    };
  }

  mobileField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.mobileField.pattern;
      let mobileErrorMessage1 = '';
      let mobileErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.mobileTypeErrorMsg',
            'pw.fieldValidators.mobileLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          mobileErrorMessage1 =
            errorMsg['pw.fieldValidators.mobileTypeErrorMsg'];
          mobileErrorMessage2 =
            errorMsg['pw.fieldValidators.mobileLengthErrorMsg'];
        });
      const mobileErrorMessage = [mobileErrorMessage1, mobileErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        mobileErrorMessage,
        formControlName
      );
    };
  }

  numberOfPrintsAllowedField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp =
        fieldValidation.numberOfPrintsAllowedField.pattern;
      let errorMessage1 = '';
      let errorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.numberOfPrintsAllowedErrorMsg',
            'pw.fieldValidators.numberOfPrintsAllowedLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          errorMessage1 =
            errorMsg['pw.fieldValidators.numberOfPrintsAllowedErrorMsg'];
          errorMessage2 =
            errorMsg['pw.fieldValidators.numberOfPrintsAllowedLengthErrorMsg'];
        });
      const errorMessage = [errorMessage1, errorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        errorMessage,
        formControlName
      );
    };
  }

  nameWithSpaceField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.nameWithSpaceField.pattern;
      let namewithspaceErrorMessage1 = '';
      let namewithspaceErrorMessage2 = '';
      let namewithspaceErrorMessage3 = '';
      let namewithspaceErrorMessage4 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.namewithspaceLengthErrorMsg',
            'pw.fieldValidators.namewithspaceAllowedCharErrorMsg',
            'pw.fieldValidators.namewithspaceNotAllowedCharErrorMsg',
            'pw.fieldValidators.namewithspaceFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          namewithspaceErrorMessage1 =
            errorMsg['pw.fieldValidators.namewithspaceLengthErrorMsg'];
          namewithspaceErrorMessage2 =
            errorMsg['pw.fieldValidators.namewithspaceAllowedCharErrorMsg'];
          namewithspaceErrorMessage3 =
            errorMsg['pw.fieldValidators.namewithspaceNotAllowedCharErrorMsg'];
          namewithspaceErrorMessage4 =
            errorMsg['pw.fieldValidators.namewithspaceFirstCharErrorMsg'];
        });
      const namewithspaceErrorMessage = [
        namewithspaceErrorMessage1,
        namewithspaceErrorMessage2,
        namewithspaceErrorMessage3,
        namewithspaceErrorMessage4
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        namewithspaceErrorMessage,
        formControlName
      );
    };
  }

  accountHolderField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.accountHolderField.pattern;
      let accountHolderErrorMessage1 = '';
      let accountHolderErrorMessage2 = '';
      let accountHolderErrorMessage3 = '';
      let accountHolderErrorMessage4 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.accountHolderLengthErrorMsg',
            'pw.fieldValidators.accountHolderAllowedCharErrorMsg',
            'pw.fieldValidators.accountHolderNotAllowedCharErrorMsg',
            'pw.fieldValidators.accountHolderFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          accountHolderErrorMessage1 =
            errorMsg['pw.fieldValidators.accountHolderLengthErrorMsg'];
          accountHolderErrorMessage2 =
            errorMsg['pw.fieldValidators.accountHolderAllowedCharErrorMsg'];
          accountHolderErrorMessage3 =
            errorMsg['pw.fieldValidators.accountHolderNotAllowedCharErrorMsg'];
          accountHolderErrorMessage4 =
            errorMsg['pw.fieldValidators.accountHolderFirstCharErrorMsg'];
        });
      const accountHolderErrorMessage = [
        accountHolderErrorMessage1,
        accountHolderErrorMessage2,
        accountHolderErrorMessage3,
        accountHolderErrorMessage4
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        accountHolderErrorMessage,
        formControlName
      );
    };
  }

  purityField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.purityField.pattern;
      let purityErrorMessage1 = '';
      let purityErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.purityOffsetRangeErrorMsg',
            'pw.fieldValidators.purityOffsetLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          purityErrorMessage1 =
            errorMsg['pw.fieldValidators.purityOffsetRangeErrorMsg'];
          purityErrorMessage2 =
            errorMsg['pw.fieldValidators.purityOffsetLengthErrorMsg'];
        });
      const purityErrorMessage = [purityErrorMessage1, purityErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        purityErrorMessage,
        formControlName
      );
    };
  }

  offsetField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.offsetField.pattern;
      let offsetErrorMessage1 = '';
      let offsetErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.offsetNameErrorMsg',
            'pw.fieldValidators.offsetLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          offsetErrorMessage1 =
            errorMsg['pw.fieldValidators.offsetNameErrorMsg'];
          offsetErrorMessage2 =
            errorMsg['pw.fieldValidators.offsetLengthErrorMsg'];
        });
      const offsetErrorMessage = [offsetErrorMessage1, offsetErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        offsetErrorMessage,
        formControlName
      );
    };
  }

  percentageField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.percentageField.pattern;
      let percentageErrorMessage1 = '';
      let percentageErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.percentageRangeErrorMsg',
            'pw.fieldValidators.percentageLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          percentageErrorMessage1 =
            errorMsg['pw.fieldValidators.percentageRangeErrorMsg'];
          percentageErrorMessage2 =
            errorMsg['pw.fieldValidators.percentageLengthErrorMsg'];
        });
      const percentageErrorMessage = [
        percentageErrorMessage1,
        percentageErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        percentageErrorMessage,
        formControlName
      );
    };
  }

  discountPercentageField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.discountPercentageField.pattern;
      let percentageErrorMessage1 = '';
      let percentageErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.percentageRangeErrorMsg',
            'pw.fieldValidators.discountPercentageLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          percentageErrorMessage1 =
            errorMsg['pw.fieldValidators.percentageRangeErrorMsg'];
          percentageErrorMessage2 =
            errorMsg['pw.fieldValidators.discountPercentageLengthErrorMsg'];
        });
      const percentageErrorMessage = [
        percentageErrorMessage1,
        percentageErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        percentageErrorMessage,
        formControlName
      );
    };
  }

  pincodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.pincodeField.pattern;
      let pincodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.pincodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          pincodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        pincodeErrorMessage,
        formControlName
      );
    };
  }

  alphabetsField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.alphabetsField.pattern;
      let alphabetsErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.alphabetPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          alphabetsErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        alphabetsErrorMessage,
        formControlName
      );
    };
  }

  toleranceField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.toleranceField.pattern;
      let toleranceErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.tolerancePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          toleranceErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        toleranceErrorMessage,
        formControlName
      );
    };
  }

  urlField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.urlField.pattern;
      let urlErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.urlPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          urlErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        urlErrorMessage,
        formControlName
      );
    };
  }

  productCategoryField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.productCategoryField.pattern;
      let productCategoryErrorMessage1 = '';
      let productCategoryErrorMessage2 = '';
      let productCategoryErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.productCategoryLengthErrorMsg',
            'pw.fieldValidators.productCategoryTypeErrorMsg',
            'pw.fieldValidators.productCategoryFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          productCategoryErrorMessage1 =
            errorMsg['pw.fieldValidators.productCategoryLengthErrorMsg'];
          productCategoryErrorMessage2 =
            errorMsg['pw.fieldValidators.productCategoryTypeErrorMsg'];
          productCategoryErrorMessage3 =
            errorMsg['pw.fieldValidators.productCategoryFirstCharErrorMsg'];
        });
      const productCategoryErrorMessage = [
        productCategoryErrorMessage1,
        productCategoryErrorMessage2,
        productCategoryErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        productCategoryErrorMessage,
        formControlName
      );
    };
  }

  addressField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.addressField.pattern;
      let addressErrorMessage1 = null;
      let addressErrorMessage2 = null;
      this.traslateService
        .get(
          [
            'pw.fieldValidators.addressPatternErrorMsg',
            'pw.fieldValidators.addressAcceptErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          addressErrorMessage1 =
            errorMsg['pw.fieldValidators.addressPatternErrorMsg'];
          addressErrorMessage2 =
            errorMsg['pw.fieldValidators.addressAcceptErrorMsg'];
        });

      const addressErrorMessage = [addressErrorMessage1, addressErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        addressErrorMessage,
        formControlName
      );
    };
  }

  corporateAddressField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.corporateAddressField.pattern;
      let addressErrorMessage1 = null;
      let addressErrorMessage2 = null;
      this.traslateService
        .get(
          [
            'pw.fieldValidators.corporateAddressPatternErrorMsg',
            'pw.fieldValidators.addressAcceptErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          addressErrorMessage1 =
            errorMsg['pw.fieldValidators.corporateAddressPatternErrorMsg'];
          addressErrorMessage2 =
            errorMsg['pw.fieldValidators.addressAcceptErrorMsg'];
        });

      const addressErrorMessage = [addressErrorMessage1, addressErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        addressErrorMessage,
        formControlName
      );
    };
  }

  approvalCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.approvalCodeField.pattern;
      let approvalCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.approvalCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          approvalCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        approvalCodeErrorMessage,
        formControlName
      );
    };
  }

  cityField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.cityField.pattern;
      let cityErrorMessage1 = '';
      let cityErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.cityLengthErrorMsg',
            'pw.fieldValidators.cityTypeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          cityErrorMessage1 = errorMsg['pw.fieldValidators.cityLengthErrorMsg'];
          cityErrorMessage2 = errorMsg['pw.fieldValidators.cityTypeErrorMsg'];
        });
      const cityErrorMessage = [cityErrorMessage1, cityErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        cityErrorMessage,
        formControlName
      );
    };
  }

  courierDocNoField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.courierDocNoField.pattern;
      let courierDocNoErrorMessage1 = '';
      let courierDocNoErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.courierDocNoLengthErrorMsg',
            'pw.fieldValidators.courierDocNoTypeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          courierDocNoErrorMessage1 =
            errorMsg['pw.fieldValidators.courierDocNoLengthErrorMsg'];
          courierDocNoErrorMessage2 =
            errorMsg['pw.fieldValidators.courierDocNoTypeErrorMsg'];
        });
      const courierDocNoErrorMessage = [
        courierDocNoErrorMessage1,
        courierDocNoErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        courierDocNoErrorMessage,
        formControlName
      );
    };
  }

  courierRoadPermitNoField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.courierRoadPermitNoField.pattern;
      let courierRoadPermitNoErrorMessage1 = '';
      let courierRoadPermitNoErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.courierRoadPermitNoLengthErrorMsg',
            'pw.fieldValidators.courierRoadPermitNoTypeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          courierRoadPermitNoErrorMessage1 =
            errorMsg['pw.fieldValidators.courierRoadPermitNoLengthErrorMsg'];
          courierRoadPermitNoErrorMessage2 =
            errorMsg['pw.fieldValidators.courierRoadPermitNoTypeErrorMsg'];
        });
      const courierRoadPermitNoErrorMessage = [
        courierRoadPermitNoErrorMessage1,
        courierRoadPermitNoErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        courierRoadPermitNoErrorMessage,
        formControlName
      );
    };
  }

  designationField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.designationField.pattern;
      let designationErrorMessage1 = '';
      let designationErrorMessage2 = '';
      let designationErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.designationLengthErrorMsg',
            'pw.fieldValidators.designationTypeErrorMsg',
            'pw.fieldValidators.designationFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          designationErrorMessage1 =
            errorMsg['pw.fieldValidators.designationLengthErrorMsg'];
          designationErrorMessage2 =
            errorMsg['pw.fieldValidators.designationTypeErrorMsg'];
          designationErrorMessage3 =
            errorMsg['pw.fieldValidators.designationFirstCharErrorMsg'];
        });
      const designationErrorMessage = [
        designationErrorMessage1,
        designationErrorMessage2,
        designationErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        designationErrorMessage,
        formControlName
      );
    };
  }

  pancardField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.pancardField.pattern;
      let pancardErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.pancardPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          pancardErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        pancardErrorMessage,
        formControlName
      );
    };
  }

  quantityField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.quantityField.pattern;
      let quantityErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.quantityPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          quantityErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        quantityErrorMessage,
        formControlName
      );
    };
  }

  lockNumberField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.lockNumberField.pattern;
      let lockNumberErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.lockNumberPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          lockNumberErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        lockNumberErrorMessage,
        formControlName
      );
    };
  }

  reasonField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.reasonField.pattern;
      let reasonErrorMessage1 = '';
      let reasonErrorMessage2 = '';
      let reasonErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.reasonLengthErrorMsg',
            'pw.fieldValidators.reasonTypeErrorMsg',
            'pw.fieldValidators.reasonFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          reasonErrorMessage1 =
            errorMsg['pw.fieldValidators.reasonLengthErrorMsg'];
          reasonErrorMessage2 =
            errorMsg['pw.fieldValidators.reasonTypeErrorMsg'];
          reasonErrorMessage3 =
            errorMsg['pw.fieldValidators.reasonFirstCharErrorMsg'];
        });
      const reasonErrorMessage = [
        reasonErrorMessage1,
        reasonErrorMessage2,
        reasonErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        reasonErrorMessage,
        formControlName
      );
    };
  }

  remarkField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.remarkField.pattern;
      let remarkErrorMessage1 = '';
      let remarkErrorMessage2 = '';
      let remarkErrorMessage3 = '';
      let remarkErrorMessage4 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.remarkLengthErrorMsg',
            'pw.fieldValidators.remarkTypeErrorMsg',
            'pw.fieldValidators.remarkFirstCharErrorMsg',
            'pw.fieldValidators.remarkContinuosCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          remarkErrorMessage1 =
            errorMsg['pw.fieldValidators.remarkLengthErrorMsg'];
          remarkErrorMessage2 =
            errorMsg['pw.fieldValidators.remarkTypeErrorMsg'];
          remarkErrorMessage3 =
            errorMsg['pw.fieldValidators.remarkFirstCharErrorMsg'];
          remarkErrorMessage4 =
            errorMsg['pw.fieldValidators.remarkContinuosCharErrorMsg'];
        });
      const remarkErrorMessage = [
        remarkErrorMessage1,
        remarkErrorMessage2,
        remarkErrorMessage3,
        remarkErrorMessage4
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        remarkErrorMessage,
        formControlName
      );
    };
  }

  roleCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.roleCodeField.pattern;
      let roleCodeErrorMessage1 = '';
      let roleCodeErrorMessage2 = '';
      let roleCodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.roleCodeLengthErrorMsg',
            'pw.fieldValidators.roleCodeTypeErrorMsg',
            'pw.fieldValidators.roleCodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          roleCodeErrorMessage1 =
            errorMsg['pw.fieldValidators.roleCodeLengthErrorMsg'];
          roleCodeErrorMessage2 =
            errorMsg['pw.fieldValidators.roleCodeTypeErrorMsg'];
          roleCodeErrorMessage3 =
            errorMsg['pw.fieldValidators.roleCodeFirstCharErrorMsg'];
        });
      const roleCodeErrorMessage = [
        roleCodeErrorMessage1,
        roleCodeErrorMessage2,
        roleCodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        roleCodeErrorMessage,
        formControlName
      );
    };
  }

  isPrimaryRoleRequiredForBoutiqueLocation(
    formControlName: string,
    primaryRole: AbstractControl,
    locationCode: AbstractControl,
    roleType: AbstractControl
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let primaryRoleRequiredErrorMessage = '';
      let errors: ValidationErrors = {};

      this.traslateService
        .get('pw.fieldValidators.primaryroleRequiredErrorMessage', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          primaryRoleRequiredErrorMessage = errorMsg;
        });

      if (
        !primaryRole.value &&
        primaryRole.hasError('required') &&
        (roleType.value === RoleTypes.Boutique ? !locationCode.invalid : true)
      ) {
        errors = {
          errorArray: [primaryRoleRequiredErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  isSameRoleCheck(
    formControlName: string,
    primaryRole: AbstractControl
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let sameRoleErrorMessage = '';
      let errors: ValidationErrors = {};
      this.traslateService
        .get('pw.fieldValidators.secondaryroleDuplicateErrorMessage', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          sameRoleErrorMessage = errorMsg;
        });
      if (!!primaryRole.value && primaryRole.value === control.value) {
        errors = {
          errorArray: [sameRoleErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  invalidLocationDetailsCheck(
    formControlName: string,
    locationCode: AbstractControl,
    roleType: AbstractControl
  ) {
    return (control: AbstractControl): ValidationErrors | null => {
      let invalidLocationDetailsErrorMessage = '';
      let errors: ValidationErrors = {};

      this.traslateService
        .get('pw.fieldValidators.locationdetailsInvalidErrorMessage', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          invalidLocationDetailsErrorMessage = errorMsg;
        });

      if (locationCode.invalid && roleType.value === RoleTypes.Boutique) {
        errors = {
          errorArray: [invalidLocationDetailsErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  stateField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.stateField.pattern;
      let stateErrorMessage1 = '';
      let stateErrorMessage2 = '';

      this.traslateService
        .get(
          [
            'pw.fieldValidators.stateLengthErrorMsg',
            'pw.fieldValidators.stateFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          stateErrorMessage1 =
            errorMsg['pw.fieldValidators.stateLengthErrorMsg'];
          stateErrorMessage2 =
            errorMsg['pw.fieldValidators.stateFirstCharErrorMsg'];
        });
      const stateErrorMessage = [stateErrorMessage1, stateErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        stateErrorMessage,
        formControlName
      );
    };
  }

  weightField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.weightField.pattern;
      let weightErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.weightPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          weightErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        weightErrorMessage,
        formControlName
      );
    };
  }

  townCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.townCodeField.pattern;
      let townCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.townCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          townCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        townCodeErrorMessage,
        formControlName
      );
    };
  }

  stateCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.stateCodeField.pattern;
      let stateCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.stateCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          stateCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        stateCodeErrorMessage,
        formControlName
      );
    };
  }

  locationTypeCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.locationTypeCodeField.pattern;
      let locationTypeCodeErrorMessage1 = '';
      let locationTypeCodeErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.locationTypeCodeLengthErrorMsg',
            'pw.fieldValidators.locationTypeCodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          locationTypeCodeErrorMessage1 =
            errorMsg['pw.fieldValidators.locationTypeCodeLengthErrorMsg'];
          locationTypeCodeErrorMessage2 =
            errorMsg['pw.fieldValidators.locationTypeCodeFirstCharErrorMsg'];
        });
      const locationTypeCodeErrorMessage = [
        locationTypeCodeErrorMessage1,
        locationTypeCodeErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        locationTypeCodeErrorMessage,
        formControlName
      );
    };
  }

  countryCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.countryCodeField.pattern;
      let countryCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.countryCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          countryCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        countryCodeErrorMessage,
        formControlName
      );
    };
  }

  currencyCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.currencyCodeField.pattern;
      let currencyCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.currencyCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          currencyCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        currencyCodeErrorMessage,
        formControlName
      );
    };
  }

  uniCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.uniCodeField.pattern;
      let uniCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.uniCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          uniCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        uniCodeErrorMessage,
        formControlName
      );
    };
  }

  itemCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.itemCodeField.pattern;
      let itemCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.itemCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          itemCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        itemCodeErrorMessage,
        formControlName
      );
    };
  }

  productCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.productCodeField.pattern;
      let productCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.productCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          productCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        productCodeErrorMessage,
        formControlName
      );
    };
  }

  complexityCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.complexityCodeField.pattern;
      let complexityCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.complexityCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          complexityCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        complexityCodeErrorMessage,
        formControlName
      );
    };
  }

  stoneQualityField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.stoneQualityField.pattern;
      let stoneQualityErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.stoneQualityPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          stoneQualityErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        stoneQualityErrorMessage,
        formControlName
      );
    };
  }

  productGroupCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.productGroupCodeField.pattern;
      let productGroupCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.productGroupCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          productGroupCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        productGroupCodeErrorMessage,
        formControlName
      );
    };
  }

  stoneTypeCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.stoneTypeCodeField.pattern;
      let stoneTypeCodeErrorMessage1 = '';
      let stoneTypeCodeErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.stoneTypeCodeTypeErrorMsg',
            'pw.fieldValidators.stoneTypeCodeRangeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          stoneTypeCodeErrorMessage1 =
            errorMsg['pw.fieldValidators.stoneTypeCodeTypeErrorMsg'];
          stoneTypeCodeErrorMessage2 =
            errorMsg['pw.fieldValidators.stoneTypeCodeRangeErrorMsg'];
        });
      const stoneTypeCodeErrorMessage = [
        stoneTypeCodeErrorMessage1,
        stoneTypeCodeErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        stoneTypeCodeErrorMessage,
        formControlName
      );
    };
  }

  supplyChainCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.supplyChainCodeField.pattern;
      let supplyChainCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.supplyChainCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          supplyChainCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        supplyChainCodeErrorMessage,
        formControlName
      );
    };
  }

  productTypeCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.productTypeCodeField.pattern;
      let productTypeCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.productTypeCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          productTypeCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        productTypeCodeErrorMessage,
        formControlName
      );
    };
  }

  findingCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.findingCodeField.pattern;
      let findingCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.findingCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          findingCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        findingCodeErrorMessage,
        formControlName
      );
    };
  }

  locationCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.locationCodeField.pattern;
      let locationCodeErrorMessage1 = '';
      let locationCodeErrorMessage2 = '';
      let locationCodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.locationCodeLengthErrorMsg',
            'pw.fieldValidators.locationCodeTypeErrorMsg',
            'pw.fieldValidators.locationCodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          locationCodeErrorMessage1 =
            errorMsg['pw.fieldValidators.locationCodeLengthErrorMsg'];
          locationCodeErrorMessage2 =
            errorMsg['pw.fieldValidators.locationCodeTypeErrorMsg'];
          locationCodeErrorMessage3 =
            errorMsg['pw.fieldValidators.locationCodeFirstCharErrorMsg'];
        });
      const locationCodeErrorMessage = [
        locationCodeErrorMessage1,
        locationCodeErrorMessage2,
        locationCodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        locationCodeErrorMessage,
        formControlName
      );
    };
  }

  priceGroupCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.priceGroupCodeField.pattern;
      let priceGroupCodeErrorMessage1 = '';
      let priceGroupCodeErrorMessage2 = '';
      let priceGroupCodeErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.priceGroupCodeLengthErrorMsg',
            'pw.fieldValidators.priceGroupCodeTypeErrorMsg',
            'pw.fieldValidators.priceGroupCodeFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          priceGroupCodeErrorMessage1 =
            errorMsg['pw.fieldValidators.priceGroupCodeLengthErrorMsg'];
          priceGroupCodeErrorMessage2 =
            errorMsg['pw.fieldValidators.priceGroupCodeTypeErrorMsg'];
          priceGroupCodeErrorMessage3 =
            errorMsg['pw.fieldValidators.priceGroupCodeFirstCharErrorMsg'];
        });
      const priceGroupCodeErrorMessage = [
        priceGroupCodeErrorMessage1,
        priceGroupCodeErrorMessage2,
        priceGroupCodeErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        priceGroupCodeErrorMessage,
        formControlName
      );
    };
  }

  cinNumberField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.cinNumberField.pattern;
      let cinNumberErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.cinNumberPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          cinNumberErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        cinNumberErrorMessage,
        formControlName
      );
    };
  }

  contactNoField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.contactNoField.pattern;
      let contactNoErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.contactNoPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          contactNoErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        contactNoErrorMessage,
        formControlName
      );
    };
  }

  userCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.userCodeField.pattern;
      let userCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.userCodeErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          userCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        userCodeErrorMessage,
        formControlName
      );
    };
  }

  requestNumberField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.requestNumberField.pattern;
      let requestNumberErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.requestNumberErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          requestNumberErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        requestNumberErrorMessage,
        formControlName
      );
    };
  }

  cfaCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.cfaCodeField.pattern;
      let requestNumberErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.invalidErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          requestNumberErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        requestNumberErrorMessage,
        formControlName
      );
    };
  }
  ulpIdField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.ulpIdField.pattern;
      let ulpIdErrorMessage1 = null;
      let ulpIdErrorMessage2 = null;
      this.traslateService
        .get(
          [
            'pw.fieldValidators.ulpIdErrorMsg',
            'pw.fieldValidators.ulpLengthErrorMsg'
          ],
          { fieldName: formControlName }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          ulpIdErrorMessage1 = errorMsg['pw.fieldValidators.ulpIdErrorMsg'];
          ulpIdErrorMessage2 = errorMsg['pw.fieldValidators.ulpLengthErrorMsg'];
        });
      const ulpErrorMessage = [ulpIdErrorMessage1, ulpIdErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        ulpErrorMessage,
        formControlName
      );
    };
  }

  employeeCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.employeeCodeField.pattern;
      let employeeCodeErrorMessage1 = null;
      let employeeCodeErrorMessage2 = null;
      this.traslateService
        .get(
          [
            'pw.fieldValidators.employeeCodeErrorMsg',
            'pw.fieldValidators.employeeCodeZeroErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          employeeCodeErrorMessage1 =
            errorMsg['pw.fieldValidators.employeeCodeErrorMsg'];
          employeeCodeErrorMessage2 =
            errorMsg['pw.fieldValidators.employeeCodeZeroErrorMsg'];
        });
      const employeeCodeErrorMessage = [
        employeeCodeErrorMessage1,
        employeeCodeErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        employeeCodeErrorMessage,
        formControlName
      );
    };
  }

  employeeNameField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.employeeNameField.pattern;
      let employeeNameErrorMsg = null;
      this.traslateService
        .get('pw.fieldValidators.employeeNameErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          employeeNameErrorMsg = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        employeeNameErrorMsg,
        formControlName
      );
    };
  }

  taxCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.taxCodeField.pattern;
      let taxCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.taxCodeErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          taxCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        taxCodeErrorMessage,
        formControlName
      );
    };
  }

  taxClassCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.taxClassCodeField.pattern;
      let taxClassCodeErrorMessage1 = null;
      let taxClassCodeErrorMessage2 = null;
      this.traslateService
        .get(
          [
            'pw.fieldValidators.taxClassCodeTypeErrorMsg',
            'pw.fieldValidators.taxClassCodeRangeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          taxClassCodeErrorMessage1 =
            errorMsg['pw.fieldValidators.taxClassCodeTypeErrorMsg'];
          taxClassCodeErrorMessage2 =
            errorMsg['pw.fieldValidators.taxClassCodeRangeErrorMsg'];
        });
      const taxClassCodeErrorMessage = [
        taxClassCodeErrorMessage1,
        taxClassCodeErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        taxClassCodeErrorMessage,
        formControlName
      );
    };
  }

  customerNameField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.customerNameField.pattern;
      let customerNameErrorMessage1 = '';
      let customerNameErrorMessage2 = '';
      let customerNameErrorMessage3 = '';
      let customerNameErrorMessage4 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.customerNameTypeErrorMsg',
            'pw.fieldValidators.customerNameFirstCharErrorMsg',
            'pw.fieldValidators.customerNameDotNotAllowedErrorMsg',
            'pw.fieldValidators.customerNameRangeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          customerNameErrorMessage1 =
            errorMsg['pw.fieldValidators.customerNameTypeErrorMsg'];
          customerNameErrorMessage2 =
            errorMsg['pw.fieldValidators.customerNameFirstCharErrorMsg'];
          customerNameErrorMessage3 =
            errorMsg['pw.fieldValidators.customerNameDotNotAllowedErrorMsg'];
          customerNameErrorMessage4 =
            errorMsg['pw.fieldValidators.customerNameRangeErrorMsg'];
        });
      const customerNameErrorMessage = [
        customerNameErrorMessage1,
        customerNameErrorMessage2,
        customerNameErrorMessage3,
        customerNameErrorMessage4
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        customerNameErrorMessage,
        formControlName
      );
    };
  }

  InstitutionNameField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.InstitutionNameField.pattern;
      let institutionNameErrorMessage1 = '';
      let institutionNameErrorMessage2 = '';
      let institutionNameErrorMessage3 = '';
      let institutionNameErrorMessage4 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.institutionNameTypeErrorMsg',
            'pw.fieldValidators.institutionNameFirstCharErrorMsg',
            'pw.fieldValidators.institutionNameDotNotAllowedErrorMsg',
            'pw.fieldValidators.institutionNameRangeErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          institutionNameErrorMessage1 =
            errorMsg['pw.fieldValidators.institutionNameTypeErrorMsg'];
          institutionNameErrorMessage2 =
            errorMsg['pw.fieldValidators.institutionNameFirstCharErrorMsg'];
          institutionNameErrorMessage3 =
            errorMsg['pw.fieldValidators.institutionNameDotNotAllowedErrorMsg'];
          institutionNameErrorMessage4 =
            errorMsg['pw.fieldValidators.institutionNameRangeErrorMsg'];
        });
      const institutionNameErrorMessage = [
        institutionNameErrorMessage1,
        institutionNameErrorMessage2,
        institutionNameErrorMessage3,
        institutionNameErrorMessage4
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        institutionNameErrorMessage,
        formControlName
      );
    };
  }

  stateTaxCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.stateTaxCodeField.pattern;
      let stateTaxCodeErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.stateTaxCodeErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          stateTaxCodeErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        stateTaxCodeErrorMessage,
        formControlName
      );
    };
  }

  countryNameField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.countryNameField.pattern;
      let countryNameErrorMessage1 = '';
      let countryNameErrorMessage2 = '';
      let countryNameErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.countryLengthErrorMsg',
            'pw.fieldValidators.countryTypeErrorMsg',
            'pw.fieldValidators.countryFirstCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          countryNameErrorMessage1 =
            errorMsg['pw.fieldValidators.countryLengthErrorMsg'];
          countryNameErrorMessage2 =
            errorMsg['pw.fieldValidators.countryTypeErrorMsg'];
          countryNameErrorMessage3 =
            errorMsg['pw.fieldValidators.countryFirstCharErrorMsg'];
        });
      const countryNameErrorMessage = [
        countryNameErrorMessage1,
        countryNameErrorMessage2,
        countryNameErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        countryNameErrorMessage,
        formControlName
      );
    };
  }

  giftCardField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.giftCardField.pattern;
      let giftCardErrorMessage1 = '';
      let giftCardErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.giftCardTypeErrorMsg',
            'pw.fieldValidators.giftCardLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          giftCardErrorMessage1 =
            errorMsg['pw.fieldValidators.giftCardTypeErrorMsg'];
          giftCardErrorMessage2 =
            errorMsg['pw.fieldValidators.giftCardLengthErrorMsg'];
        });
      const giftCardErrorMessage = [
        giftCardErrorMessage1,
        giftCardErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        giftCardErrorMessage,
        formControlName
      );
    };
  }

  giftCardPinField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.giftCardPinField.pattern;
      let giftCardPinErrorMessage1 = '';
      let giftCardPinErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.giftCardPinTypeErrorMsg',
            'pw.fieldValidators.giftCardPinLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          giftCardPinErrorMessage1 =
            errorMsg['pw.fieldValidators.giftCardPinTypeErrorMsg'];
          giftCardPinErrorMessage2 =
            errorMsg['pw.fieldValidators.giftCardPinLengthErrorMsg'];
        });
      const giftCardPinErrorMessage = [
        giftCardPinErrorMessage1,
        giftCardPinErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        giftCardPinErrorMessage,
        formControlName
      );
    };
  }

  costCenterPinField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.costCenterPinField.pattern;
      let costCenterPinErrorMessage1 = '';
      let costCenterPinErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.giftCardPinTypeErrorMsg',
            'pw.fieldValidators.costCenterPinLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          costCenterPinErrorMessage1 =
            errorMsg['pw.fieldValidators.giftCardPinTypeErrorMsg'];
          costCenterPinErrorMessage2 =
            errorMsg['pw.fieldValidators.costCenterPinLengthErrorMsg'];
        });
      const giftCardPinErrorMessage = [
        costCenterPinErrorMessage1,
        costCenterPinErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        giftCardPinErrorMessage,
        formControlName
      );
    };
  }

  referenceIdField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.referenceIdField.pattern;
      let referenceIdErrorMessage1 = '';
      let referenceIdErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.referenceIdTypeErrorMsg',
            'pw.fieldValidators.referenceIdLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          referenceIdErrorMessage1 =
            errorMsg['pw.fieldValidators.referenceIdTypeErrorMsg'];
          referenceIdErrorMessage2 =
            errorMsg['pw.fieldValidators.referenceIdLengthErrorMsg'];
        });
      const referenceIdErrorMessage = [
        referenceIdErrorMessage1,
        referenceIdErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        referenceIdErrorMessage,
        formControlName
      );
    };
  }

  giftVoucherSerialNoField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.giftVoucherSerialNoField.pattern;
      let giftVoucherSerialNoErrorMessage1 = '';
      let giftVoucherSerialNoErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.giftVoucherSerialNoTypeErrorMsg',
            'pw.fieldValidators.giftVoucherSerialNoLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          giftVoucherSerialNoErrorMessage1 =
            errorMsg['pw.fieldValidators.giftVoucherSerialNoTypeErrorMsg'];
          giftVoucherSerialNoErrorMessage2 =
            errorMsg['pw.fieldValidators.giftVoucherSerialNoLengthErrorMsg'];
        });
      const giftVoucherSerialNoErrorMessage = [
        giftVoucherSerialNoErrorMessage1,
        giftVoucherSerialNoErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        giftVoucherSerialNoErrorMessage,
        formControlName
      );
    };
  }

  ghVoucherNoField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.ghVoucherNoField.pattern;
      let ghVoucherNoErrorMessage1 = '';
      let ghVoucherNoErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.ghVoucherNoTypeErrorMsg',
            'pw.fieldValidators.ghVoucherNoLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          ghVoucherNoErrorMessage1 =
            errorMsg['pw.fieldValidators.ghVoucherNoTypeErrorMsg'];
          ghVoucherNoErrorMessage2 =
            errorMsg['pw.fieldValidators.ghVoucherNoLengthErrorMsg'];
        });
      const ghVoucherNoErrorMessage = [
        ghVoucherNoErrorMessage1,
        ghVoucherNoErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        ghVoucherNoErrorMessage,
        formControlName
      );
    };
  }

  binSeriesField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.binSeriesField.pattern;
      let binSeriesErrorMessage1 = '';
      let binSeriesErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.binSeriesTypeErrorMsg',
            'pw.fieldValidators.binSeriesLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          binSeriesErrorMessage1 =
            errorMsg['pw.fieldValidators.binSeriesTypeErrorMsg'];
          binSeriesErrorMessage2 =
            errorMsg['pw.fieldValidators.binSeriesLengthErrorMsg'];
        });
      const binSeriesErrorMessage = [
        binSeriesErrorMessage1,
        binSeriesErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        binSeriesErrorMessage,
        formControlName
      );
    };
  }

  merchantIdField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.merchantIdField.pattern;
      let merchantIdErrorMessage1 = '';
      let merchantIdErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.merchantIdTypeErrorMsg',
            'pw.fieldValidators.merchantIdLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          merchantIdErrorMessage1 =
            errorMsg['pw.fieldValidators.merchantIdTypeErrorMsg'];
          merchantIdErrorMessage2 =
            errorMsg['pw.fieldValidators.merchantIdLengthErrorMsg'];
        });
      const merchantIdErrorMessage = [
        merchantIdErrorMessage1,
        merchantIdErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        merchantIdErrorMessage,
        formControlName
      );
    };
  }

  apiKeyField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.apiKeyField.pattern;
      let apiKeyErrorMessage1 = '';
      let apiKeyErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.apiKeyTypeErrorMsg',
            'pw.fieldValidators.apiKeyLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          apiKeyErrorMessage1 =
            errorMsg['pw.fieldValidators.apiKeyTypeErrorMsg'];
          apiKeyErrorMessage2 =
            errorMsg['pw.fieldValidators.apiKeyLengthErrorMsg'];
        });
      const apiKeyErrorMessage = [apiKeyErrorMessage1, apiKeyErrorMessage2];
      return this.returnErrorMessage(
        control,
        pattern,
        apiKeyErrorMessage,
        formControlName
      );
    };
  }

  themeCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.themeCodeField.pattern;
      let themeCodeErrorMessage1 = '';
      let themeCodeErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.themeCodeTypeErrorMsg',
            'pw.fieldValidators.themeCodeLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          themeCodeErrorMessage1 =
            errorMsg['pw.fieldValidators.themeCodeTypeErrorMsg'];
          themeCodeErrorMessage2 =
            errorMsg['pw.fieldValidators.themeCodeLengthErrorMsg'];
        });
      const themeCodeErrorMessage = [
        themeCodeErrorMessage1,
        themeCodeErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        themeCodeErrorMessage,
        formControlName
      );
    };
  }

  bankNameField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.bankNameField.pattern;
      let bankNameErrorMessage1 = '';
      let bankNameErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.bankNameTypeErrorMsg',
            'pw.fieldValidators.bankNameLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          bankNameErrorMessage1 =
            errorMsg['pw.fieldValidators.bankNameTypeErrorMsg'];
          bankNameErrorMessage2 =
            errorMsg['pw.fieldValidators.bankNameLengthErrorMsg'];
        });
      const bankNameErrorMessage = [
        bankNameErrorMessage1,
        bankNameErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        bankNameErrorMessage,
        formControlName
      );
    };
  }

  bankCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.bankCodeField.pattern;
      let bankCodeErrorMessage1 = '';
      let bankCodeErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.bankCodeTypeErrorMsg',
            'pw.fieldValidators.bankCodeLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          bankCodeErrorMessage1 =
            errorMsg['pw.fieldValidators.bankCodeTypeErrorMsg'];
          bankCodeErrorMessage2 =
            errorMsg['pw.fieldValidators.bankCodeLengthErrorMsg'];
        });
      const bankCodeErrorMessage = [
        bankCodeErrorMessage1,
        bankCodeErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        bankCodeErrorMessage,
        formControlName
      );
    };
  }

  passwordField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.passwordField.pattern;
      let passwordErrorMessage2 = '';
      let passwordErrorMessage3 = '';
      let passwordErrorMessage4 = '';
      let passwordErrorMessage5 = '';

      let passwordErrorMessage8 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.passwordUppercaseErrorMsg',
            'pw.fieldValidators.passwordLowercaseErrorMsg',
            'pw.fieldValidators.passwordValueErrorMsg',
            'pw.fieldValidators.passwordSpecialCharErrorMsg',

            'pw.fieldValidators.passwordConsecutiveErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          passwordErrorMessage2 =
            errorMsg['pw.fieldValidators.passwordUppercaseErrorMsg'];
          passwordErrorMessage3 =
            errorMsg['pw.fieldValidators.passwordLowercaseErrorMsg'];
          passwordErrorMessage4 =
            errorMsg['pw.fieldValidators.passwordValueErrorMsg'];
          passwordErrorMessage5 =
            errorMsg['pw.fieldValidators.passwordSpecialCharErrorMsg'];

          passwordErrorMessage8 =
            errorMsg['pw.fieldValidators.passwordConsecutiveErrorMsg'];
        });
      const passwordErrorMessage = [
        passwordErrorMessage2,
        passwordErrorMessage3,
        passwordErrorMessage4,
        passwordErrorMessage5,

        passwordErrorMessage8
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        passwordErrorMessage,
        formControlName
      );
    };
  }

  alphabetWithSpaceField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.alphabetWithSpaceField.pattern;
      let alphabetWithSpaceErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.alphabetwithSpaceErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          alphabetWithSpaceErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        alphabetWithSpaceErrorMessage,
        formControlName
      );
    };
  }

  minLength(minLength: number, formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isEmptyInputValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
      }
      let errors: ValidationErrors = {};

      let minErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.minValidationErrorMsg', {
          lengthValue: minLength,
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          minErrorMessage = errorMsg;
        });

      const length: number = control.value ? control.value.length : 0;
      if (length < minLength) {
        errors = {
          errorArray: [minErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  maxLength(maxLength: number, formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isEmptyInputValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
      }
      let errors: ValidationErrors = {};

      let maxErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.maxValidationErrorMsg', {
          lengthValue: maxLength,
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          maxErrorMessage = errorMsg;
        });

      const length: number = control.value ? control.value.length : 0;
      if (length > maxLength) {
        errors = {
          errorArray: [maxErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  min(min: number, formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isEmptyInputValue(control.value) ||
        this.isEmptyInputValue(min)
      ) {
        return null;
      }
      let errors: ValidationErrors = {};

      let minValueErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.minValueErrorMsg', {
          lengthValue: min,
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          minValueErrorMessage = errorMsg;
        });

      const value = parseFloat(control.value);
      if (!isNaN(value) && value < min) {
        errors = {
          errorArray: [minValueErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  minAmount(
    min: number,
    formControlName: string,
    currencyCode: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isEmptyInputValue(control.value) ||
        this.isEmptyInputValue(min)
      ) {
        return null;
      }
      let errors: ValidationErrors = {};

      let minValueErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.minValueErrorMsg', {
          lengthValue: this.currencyFormatterService.format(min, currencyCode),
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          minValueErrorMessage = errorMsg;
        });

      const value = parseFloat(control.value);
      if (!isNaN(value) && value < min) {
        errors = {
          errorArray: [minValueErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  minDate(minDate: Moment, formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isEmptyInputValue(control.value) ||
        this.isEmptyInputValue(minDate)
      ) {
        return null;
      }
      let errors: ValidationErrors = {};

      let minDateErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.minDateErrorMsg', {
          lengthValue: this.dateFormatterService.format(minDate),
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          minDateErrorMessage = errorMsg;
        });

      const value = moment(control.value);
      // = parseFloat();
      if (value && value.isBefore(minDate)) {
        errors = {
          errorArray: [minDateErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }
  maxDate(maxDate: Moment, formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isEmptyInputValue(control.value) ||
        this.isEmptyInputValue(maxDate)
      ) {
        return null;
      }
      let errors: ValidationErrors = {};

      let maxDateErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.maxDateErrorMsg', {
          lengthValue: this.dateFormatterService.format(maxDate),
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          maxDateErrorMessage = errorMsg;
        });

      const value = moment(control.value);
      // = parseFloat();
      if (value && value.isAfter(maxDate)) {
        errors = {
          errorArray: [maxDateErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }
  max(max: number, formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isEmptyInputValue(control.value) ||
        this.isEmptyInputValue(max)
      ) {
        return null;
      }
      let errors: ValidationErrors = {};

      let maxValueErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.maxValueErrorMsg', {
          lengthValue: max,
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          maxValueErrorMessage = errorMsg;
        });

      const value = parseFloat(control.value);
      if (!isNaN(value) && value > max) {
        errors = {
          errorArray: [maxValueErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  eligibleCashMax(
    max: number,
    formControlName: string,
    currencyCode: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isEmptyInputValue(control.value) ||
        this.isEmptyInputValue(max)
      ) {
        return null;
      }
      let errors: ValidationErrors = {};

      let maxValueErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.eligibleCashMaxValueErrorMsg', {
          lengthValue: this.currencyFormatterService.format(max, currencyCode),
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          maxValueErrorMessage = errorMsg;
        });

      const value = parseFloat(control.value);
      if (!isNaN(value) && value > max) {
        errors = {
          errorArray: [maxValueErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  pmlaCashMax(
    max: number,
    formControlName: string,
    currencyCode: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isEmptyInputValue(control.value) ||
        this.isEmptyInputValue(max)
      ) {
        return null;
      }
      let errors: ValidationErrors = {};

      let maxValueErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.pmlaMaxValueErrorMsg', {
          lengthValue: this.currencyFormatterService.format(max, currencyCode),
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          maxValueErrorMessage = errorMsg;
        });

      const value = parseFloat(control.value);
      if (!isNaN(value) && value > max) {
        errors = {
          errorArray: [maxValueErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  maxAmount(
    max: number,
    formControlName: string,
    currencyCode: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isEmptyInputValue(control.value) ||
        this.isEmptyInputValue(max)
      ) {
        return null;
      }
      let errors: ValidationErrors = {};

      let maxValueErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.maxValueErrorMsg', {
          lengthValue: this.currencyFormatterService.format(max, currencyCode),
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          maxValueErrorMessage = errorMsg;
        });

      const value = parseFloat(control.value);
      if (!isNaN(value) && value > max) {
        errors = {
          errorArray: [maxValueErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  equalAmount(
    equal: number,
    formControlName: string,
    currencyCode: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isEmptyInputValue(control.value) ||
        this.isEmptyInputValue(equal)
      ) {
        return null;
      }
      let errors: ValidationErrors = {};

      let equalValueErrorMessage = '';
      this.traslateService
        .get('pw.fieldValidators.equalValueErrorMsg', {
          lengthValue: this.currencyFormatterService.format(
            equal,
            currencyCode
          ),
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          equalValueErrorMessage = errorMsg;
        });

      const value = parseFloat(control.value);
      if (!isNaN(value) && value !== equal) {
        errors = {
          errorArray: [equalValueErrorMessage]
        };
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  chequeDDNoField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.chequeDDNoField.pattern;
      let chequeDDNoErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.ChequeDDNoPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          chequeDDNoErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        chequeDDNoErrorMessage,
        formControlName
      );
    };
  }

  transactionIdField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.transactionIdField.pattern;
      let transactionIdErrorMessage = null;
      this.traslateService
        .get('pw.fieldValidators.transactionIdErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          transactionIdErrorMessage = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        transactionIdErrorMessage,
        formControlName
      );
    };
  }

  numberOfCardDigitsField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.numberOfCardDigitsField.pattern;
      let numberErrorMessage1 = '';
      let numberErrorMessage2 = '';
      let numberErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.numbersAllowedTypeErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeAErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          numberErrorMessage1 =
            errorMsg['pw.fieldValidators.numbersAllowedTypeErrorMsg'];
          numberErrorMessage2 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeAErrorMsg'];
          numberErrorMessage3 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'];
        });
      const numberErrorMessage = [
        numberErrorMessage1,
        numberErrorMessage2,
        numberErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        numberErrorMessage,
        formControlName
      );
    };
  }

  valueStartEndField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.valueStartEndField.pattern;
      let numberErrorMessage1 = '';
      let numberErrorMessage2 = '';
      let numberErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.numbersAllowedTypeErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeAErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          numberErrorMessage1 =
            errorMsg['pw.fieldValidators.numbersAllowedTypeErrorMsg'];
          numberErrorMessage2 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeAErrorMsg'];
          numberErrorMessage3 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'];
        });
      const numberErrorMessage = [
        numberErrorMessage1,
        numberErrorMessage2,
        numberErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        numberErrorMessage,
        formControlName
      );
    };
  }

  singleNumberField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.singleNumberField.pattern;
      let numberErrorMessage1 = '';
      let numberErrorMessage2 = '';
      let numberErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.numbersAllowedTypeErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeAErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          numberErrorMessage1 =
            errorMsg['pw.fieldValidators.numbersAllowedTypeErrorMsg'];
          numberErrorMessage2 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeAErrorMsg'];
          numberErrorMessage3 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'];
        });
      const numberErrorMessage = [
        numberErrorMessage1,
        numberErrorMessage2,
        numberErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        numberErrorMessage,
        formControlName
      );
    };
  }
  fitGlCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.fitGlCodeField.pattern;
      let fitGlCodeErrorMsg = null;
      this.traslateService
        .get('pw.fieldValidators.fitGlCodePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          fitGlCodeErrorMsg = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        fitGlCodeErrorMsg,
        formControlName
      );
    };
  }
  localeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.localeField.pattern;
      let localeErrorMsg = null;
      this.traslateService
        .get('pw.fieldValidators.localePatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          localeErrorMsg = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        localeErrorMsg,
        formControlName
      );
    };
  }

  maxNumberOfProducts(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.maxNumberOfProducts.pattern;
      let fitGlCodeErrorMsg = null;
      this.traslateService
        .get('pw.fieldValidators.maxNumberOfProductsPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          fitGlCodeErrorMsg = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        fitGlCodeErrorMsg,
        formControlName
      );
    };
  }

  noOfRequestPerMonth(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.noOfRequestPerMonth.pattern;
      let fitGlCodeErrorMsg = null;
      this.traslateService
        .get('pw.fieldValidators.noOfRequestPerMonthPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          fitGlCodeErrorMsg = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        fitGlCodeErrorMsg,
        formControlName
      );
    };
  }

  reqValidUpto(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.reqValidUpto.pattern;
      let fitGlCodeErrorMsg = null;
      this.traslateService
        .get('pw.fieldValidators.reqValidUptoPatternErrorMsg', {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          fitGlCodeErrorMsg = [errorMsg];
        });
      return this.returnErrorMessage(
        control,
        pattern,
        fitGlCodeErrorMsg,
        formControlName
      );
    };
  }

  cashbackNameField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.cashbackNameField.pattern;
      let cashbackNameErrorMsg1 = '';
      let cashbackNameErrorMsg2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.cashbackNameErrorMsg',
            'pw.fieldValidators.cashbackLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          cashbackNameErrorMsg1 =
            errorMsg['pw.fieldValidators.cashbackNameErrorMsg'];
          cashbackNameErrorMsg2 =
            errorMsg['pw.fieldValidators.cashbackLengthErrorMsg'];
        });
      const cashbackErrorMsgs = [cashbackNameErrorMsg1, cashbackNameErrorMsg2];
      return this.returnErrorMessage(
        control,
        pattern,
        cashbackErrorMsgs,
        formControlName
      );
    };
  }

  focSchemeNameField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.focSchemeNameField.pattern;
      let focSchemeNameErrorMsg1 = '';
      let focSchemeNameErrorMsg2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.focSchemeNameErrorMsg',
            'pw.fieldValidators.focSchemeNameLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          focSchemeNameErrorMsg1 =
            errorMsg['pw.fieldValidators.focSchemeNameErrorMsg'];
          focSchemeNameErrorMsg2 =
            errorMsg['pw.fieldValidators.focSchemeNameLengthErrorMsg'];
        });
      const focSchemeNameErrorMsgs = [
        focSchemeNameErrorMsg1,
        focSchemeNameErrorMsg2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        focSchemeNameErrorMsgs,
        formControlName
      );
    };
  }

  noOfTimesCardAllowedField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.noOfTimesCardAllowedField.pattern;
      let numberErrorMessage1 = '';
      let numberErrorMessage2 = '';
      let numberErrorMessage3 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.numbersAllowedTypeErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeAErrorMsg',
            'pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          numberErrorMessage1 =
            errorMsg['pw.fieldValidators.numbersAllowedTypeErrorMsg'];
          numberErrorMessage2 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeAErrorMsg'];
          numberErrorMessage3 =
            errorMsg['pw.fieldValidators.numbersNotAllowedTypeSErrorMsg'];
        });
      const numberErrorMessage = [
        numberErrorMessage1,
        numberErrorMessage2,
        numberErrorMessage3
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        numberErrorMessage,
        formControlName
      );
    };
  }

  fiscalYearField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.fiscalYearField.pattern;
      let fiscalYearErrorMessage1 = '';
      let fiscalYearErrorMessage2 = '';

      this.traslateService
        .get(
          [
            'pw.fieldValidators.fiscalYearAllowedTypeErrorMsg',
            'pw.fieldValidators.firstDigitErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          fiscalYearErrorMessage1 =
            errorMsg['pw.fieldValidators.fiscalYearAllowedTypeErrorMsg'];
          fiscalYearErrorMessage2 =
            errorMsg['pw.fieldValidators.firstDigitErrorMsg'];
        });
      const fiscalYearErrorMessage = [
        fiscalYearErrorMessage1,
        fiscalYearErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        fiscalYearErrorMessage,
        formControlName
      );
    };
  }

  timeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.timeField.pattern;
      let timeFieldErrorMsg1 = '';

      this.traslateService
        .get(['pw.fieldValidators.timeFieldErrorMsg'], {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          timeFieldErrorMsg1 = errorMsg['pw.fieldValidators.timeFieldErrorMsg'];
        });
      const timeFieldErrorMsg2 = [timeFieldErrorMsg1];
      return this.returnErrorMessage(
        control,
        pattern,
        timeFieldErrorMsg2,
        formControlName
      );
    };
  }

  timeInHoursField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.timeInHoursField.pattern;
      let timeInHoursFieldErrorMsg1 = '';

      this.traslateService
        .get(['pw.fieldValidators.timeInHoursFieldErrorMsg'], {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          timeInHoursFieldErrorMsg1 =
            errorMsg['pw.fieldValidators.timeInHoursFieldErrorMsg'];
        });
      const timeInHoursFieldErrorMsg2 = [timeInHoursFieldErrorMsg1];
      return this.returnErrorMessage(
        control,
        pattern,
        timeInHoursFieldErrorMsg2,
        formControlName
      );
    };
  }

  nonPeakTimeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.nonPeakTimeField.pattern;
      let timeInHoursFieldErrorMsg1 = '';

      this.traslateService
        .get(['pw.fieldValidators.nonPeakTimeFieldErrorMsg'], {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          timeInHoursFieldErrorMsg1 =
            errorMsg['pw.fieldValidators.nonPeakTimeFieldErrorMsg'];
        });
      const timeInHoursFieldErrorMsg2 = [timeInHoursFieldErrorMsg1];
      return this.returnErrorMessage(
        control,
        pattern,
        timeInHoursFieldErrorMsg2,
        formControlName
      );
    };
  }

  numberGreaterThanZeroPattern(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp =
        fieldValidation.numberGreaterThanZeroPattern.pattern;
      let errorMsg1 = '';

      this.traslateService
        .get(['pw.fieldValidators.numberGreaterThanZeroPatternErrorMsg'], {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          errorMsg1 =
            errorMsg['pw.fieldValidators.numberGreaterThanZeroPatternErrorMsg'];
        });
      const errorMsg2 = [errorMsg1];
      return this.returnErrorMessage(
        control,
        pattern,
        errorMsg2,
        formControlName
      );
    };
  }

  weightValueConfigName(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.weightValueConfigName.pattern;
      let namewithspaceErrorMessage1 = '';
      let namewithspaceErrorMessage2 = '';

      let weightValueConfigNameCharErrorMsg = '';
      let weightValueConfigNameNotAllowedCharMsg = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.namewithspaceLengthErrorMsg',
            'pw.fieldValidators.namewithspaceAllowedCharErrorMsg',
            'pw.fieldValidators.weightValueConfigNameNotAllowedCharErrorMsg',
            'pw.fieldValidators.weightValueConfigNameCharErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          namewithspaceErrorMessage1 =
            errorMsg['pw.fieldValidators.namewithspaceLengthErrorMsg'];
          namewithspaceErrorMessage2 =
            errorMsg['pw.fieldValidators.namewithspaceAllowedCharErrorMsg'];

          weightValueConfigNameCharErrorMsg =
            errorMsg['pw.fieldValidators.weightValueConfigNameCharErrorMsg'];

          weightValueConfigNameNotAllowedCharMsg =
            errorMsg[
              'pw.fieldValidators.weightValueConfigNameNotAllowedCharErrorMsg'
            ];
        });
      const namewithspaceErrorMessage = [
        namewithspaceErrorMessage1,
        namewithspaceErrorMessage2,

        weightValueConfigNameCharErrorMsg,
        weightValueConfigNameNotAllowedCharMsg
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        namewithspaceErrorMessage,
        formControlName
      );
    };
  }

  slabNameField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.slabNameField.pattern;
      let slabNameFieldErrorMessage1 = null;
      this.traslateService
        .get(['pw.fieldValidators.slabNameFieldErrorMsg'], {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          slabNameFieldErrorMessage1 =
            errorMsg['pw.fieldValidators.slabNameFieldErrorMsg'];
        });
      const slabNameFieldErrorMessage = [slabNameFieldErrorMessage1];
      return this.returnErrorMessage(
        control,
        pattern,
        slabNameFieldErrorMessage,
        formControlName
      );
    };
  }

  ifscCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.ifscCodeField.pattern;
      let ifscCodeFieldErrorMessage1 = '';
      let ifscCodeFieldErrorMessage2 = '';
      let ifscCodeFieldErrorMessage3 = '';
      let ifscCodeFieldErrorMessage4 = '';

      this.traslateService
        .get(
          [
            'pw.fieldValidators.ifscCodeFieldLengthErrorMsg',
            'pw.fieldValidators.ifscCodeFieldAllowedCharErrorMsg',
            'pw.fieldValidators.ifscCodeFieldAllowedCharErrorMsg1',
            'pw.fieldValidators.ifscCodeFieldAllowedCharErrorMsg2'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          ifscCodeFieldErrorMessage1 =
            errorMsg['pw.fieldValidators.ifscCodeFieldLengthErrorMsg'];
          ifscCodeFieldErrorMessage2 =
            errorMsg['pw.fieldValidators.ifscCodeFieldAllowedCharErrorMsg'];
          ifscCodeFieldErrorMessage3 =
            errorMsg['pw.fieldValidators.ifscCodeFieldAllowedCharErrorMsg1'];
          ifscCodeFieldErrorMessage4 =
            errorMsg['pw.fieldValidators.ifscCodeFieldAllowedCharErrorMsg2'];
        });
      const ifscCodeFieldErrorMessage = [
        ifscCodeFieldErrorMessage1,
        ifscCodeFieldErrorMessage2,
        ifscCodeFieldErrorMessage3,
        ifscCodeFieldErrorMessage4
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        ifscCodeFieldErrorMessage,
        formControlName
      );
    };
  }

  makingChargeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.makingChargeField.pattern;
      let makingChargeErrorMessage1 = '';
      let makingChargeErrorMessage2 = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.makingChargeRangeErrorMsg',
            'pw.fieldValidators.makingChargeLengthErrorMsg'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          makingChargeErrorMessage1 =
            errorMsg['pw.fieldValidators.makingChargeRangeErrorMsg'];
          makingChargeErrorMessage2 =
            errorMsg['pw.fieldValidators.makingChargeLengthErrorMsg'];
        });
      const makingChargeErrorMessage = [
        makingChargeErrorMessage1,
        makingChargeErrorMessage2
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        makingChargeErrorMessage,
        formControlName
      );
    };
  }

  noOfDaysForRazorPayPaymentExpiry(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp =
        fieldValidation.noOfDaysForRazorPayPaymentExpiry.pattern;
      let noOfDaysForRazorPayPaymentExpiryErrorMessage = '';
      this.traslateService
        .get(['pw.fieldValidators.noOfDaysForRazorPayPaymentExpiryErrorMsg'], {
          fieldName: formControlName
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          noOfDaysForRazorPayPaymentExpiryErrorMessage =
            errorMsg[
              'pw.fieldValidators.noOfDaysForRazorPayPaymentExpiryErrorMsg'
            ];
        });
      const makingChargeErrorMessage = [
        noOfDaysForRazorPayPaymentExpiryErrorMessage
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        makingChargeErrorMessage,
        formControlName
      );
    };
  }

  schemeCodeField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.schemeCodeField.pattern;
      let schemeCodeFieldErrorMessage = '';
      let schemeCodeFieldSpaceErrorMessage = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.schemeCodeFieldErrorMessage',
            'pw.fieldValidators.schemeCodeFiledSpaceErrorMessage'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          schemeCodeFieldErrorMessage =
            errorMsg['pw.fieldValidators.schemeCodeFieldErrorMessage'];
          schemeCodeFieldSpaceErrorMessage =
            errorMsg['pw.fieldValidators.schemeCodeFiledSpaceErrorMessage'];
        });
      const schemeCoderrorMessage = [
        schemeCodeFieldErrorMessage,
        schemeCodeFieldSpaceErrorMessage
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        schemeCoderrorMessage,
        formControlName
      );
    };
  }

  utrNumberField(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: RegExp = fieldValidation.utrNumberField.pattern;
      let utrNumberFieldErrorMessage = '';
      let utrNumberFieldLengthErrorMessage = '';
      this.traslateService
        .get(
          [
            'pw.fieldValidators.utrNumberFieldErrorMessage',
            'pw.fieldValidators.utrNumberFieldLengthErrorMessage'
          ],
          {
            fieldName: formControlName
          }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(errorMsg => {
          utrNumberFieldErrorMessage =
            errorMsg['pw.fieldValidators.utrNumberFieldErrorMessage'];
          utrNumberFieldLengthErrorMessage =
            errorMsg['pw.fieldValidators.utrNumberFieldLengthErrorMessage'];
        });
      const utrErrorMessage = [
        utrNumberFieldErrorMessage,
        utrNumberFieldLengthErrorMessage
      ];
      return this.returnErrorMessage(
        control,
        pattern,
        utrErrorMessage,
        formControlName
      );
    };
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
