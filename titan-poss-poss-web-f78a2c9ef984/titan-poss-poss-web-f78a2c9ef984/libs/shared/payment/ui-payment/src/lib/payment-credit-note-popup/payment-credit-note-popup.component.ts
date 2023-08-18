import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CNListResponse,
  CreditNotePayment,
  CreditNoteStatusEnum,
  PaymentDetails,
  PaymentGroupEnum,
  ConfigTypeEnum,
  PaymentModeEnum,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-credit-note-popup',
  templateUrl: './payment-credit-note-popup.component.html',
  styleUrls: ['./payment-credit-note-popup.component.scss']
})
export class PaymentCreditNotePopupComponent implements OnInit, OnDestroy {
  totalElements: number;
  totalQty = 0;
  totalEvaluation = 0;
  creditNoteListForm: FormGroup;
  destroy$ = new Subject();
  creditNoteListValue = {
    cnList: [],
    totalElements: null
  };
  totalAmount = 0;
  totalAmountDue = 0;
  errorMeassge: string;
  redeemingamountLabel: string;
  exceedAmountErrorMsg: string;
  partialRedeemErrorMsg: string;
  priorityErrorMsg: string;
  initialDevAmount = 0;
  paymentAddedCN = [];
  thirdPartySelectedCN = [];
  invokeCNForm: FormGroup;
  @Output() getInvokedCN = new EventEmitter<any>();
  @Output() getThirdPartyCN = new EventEmitter<any>();
  @Output() tabChanged = new EventEmitter<boolean>();
  @Output() addCreditNotePayment = new EventEmitter<any>();
  @Output() removePaymentDetail = new EventEmitter<any>();
  @Output() generateOTPForCn = new EventEmitter<any>();
  @Output() uploadPhotoIDProof = new EventEmitter<FormData>();
  invokedCN: any;
  invokeCNErrorMsg: string;
  translatedMsg: any;
  currentlyAddedPayment: any;
  paymentAddSuccessMessage: string;
  public activeTab = 0;
  thirdPartyAddedPayment: any;
  isPartialRedemption: any;
  isThirdPartyCnAdd = false;
  isOtpGeneratedForCN = false;
  isAddCnBtnDisabled = false;
  isOTPAllowed = false;
  isOTPAllowedForMinimunCN = false;
  isOTPForMinimumAmount: any;
  isPartialyPaymentAdded = false;
  currentFiscalYear: string;
  validationErrorMsg: string;
  mcLabel: string;
  ucpLabel: string;
  enablePhotoIDProofUpload = false;
  uploadedPhotoIDProof = null;
  continueWithoutOTP = false;
  idProofUploadedForWithoutOTP = false;
  isPhotoIDProofCollected: FormControl;
  photoIDProofUrl$: Observable<string>;
  photoIDProofUrl: string;
  isPhotoIDProofUploadMandatory = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentCreditNotePopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      creditNoteList$: Observable<any>;
      totalAmountDue$: Subject<any>;
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      paymentDetails$: Observable<PaymentDetails[]>;
      invokedCreditNote$: Observable<CNListResponse>;
      thirdPartyCNList$: Observable<CNListResponse>;
      totalAmountDue: number;
      isOtpAllowedForCm$: Observable<any>;
      isOtpAllowedForAb$: Observable<any>;
      isOtpAllowedForAdvance$: Observable<any>;
      isOtpForMinimunCn$: Observable<any>;
      isOtpGeneratedForCn$: Observable<any>;
      cnpriorityError: string;
      businessDate: string;
      currentFiscalYear: string;
      isCNPartialRedeemAllowed: boolean;
      isUploadMandatoryforThirdPartyCNWithoutOTP: boolean;
    },
    private formBuilder: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translationService
      .get([
        'pw.cnPayment.redeemingAmtLabel',
        'pw.cnPayment.exceedAmountErrorMsg',
        'pw.cnPayment.partialRedeemErrorMsg',
        'pw.cnPayment.priorityErrorMsg',
        'pw.cnPayment.abcoErrorMsg',
        'pw.cnPayment.redeemErrorMsg',
        'pw.cnPayment.cancelledErrorMsg',
        'pw.cnPayment.suspendedErrorMsg',
        'pw.cnPayment.invalidErrorMsg',
        'pw.cnPayment.sucessPaymentMsg',
        'pw.cnPayment.selfCnErrorMsg',
        'pw.cnPayment.creditNoteStatusErrorMsg',
        'pw.cnPayment.frozenDetailsErrorMsg',
        'pw.cnPayment.mcLabel',
        'pw.cnPayment.ucpLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.partialRedeemErrorMsg =
          translatedMsg['pw.cnPayment.partialRedeemErrorMsg'];
        this.redeemingamountLabel =
          translatedMsg['pw.cnPayment.redeemingAmtLabel'];
        this.exceedAmountErrorMsg =
          translatedMsg['pw.cnPayment.exceedAmountErrorMsg'];
        this.priorityErrorMsg = translatedMsg['pw.cnPayment.priorityErrorMsg'];
        this.translatedMsg = translatedMsg;
        this.mcLabel = translatedMsg['pw.cnPayment.mcLabel'];
        this.ucpLabel = translatedMsg['pw.cnPayment.ucpLabel'];
      });
    this.creditNoteListForm = this.formBuilder.group({
      creditNoteDetails: this.formBuilder.array([])
    });
    this.currentFiscalYear = data.currentFiscalYear;
  }

  ngOnInit() {
    this.totalAmountDue = this.data.totalAmountDue;
    this.data.totalAmountDue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalAmount => {
        this.totalAmountDue = totalAmount.currentValue;
      });
    this.isPhotoIDProofCollected = new FormControl(false);
    this.isPhotoIDProofUploadMandatory = this.data.isUploadMandatoryforThirdPartyCNWithoutOTP;
    this.data.isOtpGeneratedForCn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOptGenerate => {
        this.isOtpGeneratedForCN = isOptGenerate;
        if (this.isOtpGeneratedForCN === true) {
          this.invokeCNForm?.get('otp')?.enable();
          this.invokeCNForm
            ?.get('otp')
            ?.setValidators([
              this.fieldValidatorsService.requiredField('otp'),
              this.fieldValidatorsService.alphaNumericField('otp'),
              this.fieldValidatorsService.maxLength(6, 'otp')
            ]);
        } else {
          this.invokeCNForm?.get('otp')?.reset();
          this.invokeCNForm?.get('otp')?.disable();
        }
      });

    if (this.data && this.data.creditNoteList$) {
      this.data.creditNoteList$
        .pipe(takeUntil(this.destroy$))
        .subscribe(cnList => {
          this.creditNoteListValue.totalElements = null;
          this.creditNoteListValue.cnList = [];
          this.paymentAddedCN = [];
          if (cnList) {
            this.creditNoteListValue.totalElements = cnList.totalElements;
            this.creditNoteListValue.cnList = cnList.cnList.filter(
              item =>
                item.status === 'OPEN' &&
                item.linkedTxnId === null &&
                item?.eghsDetails?.data?.isPaymentForEGHS !== true
            );
          }

          this.creditNoteListValue.cnList.map(value => {
            this.totalAmount = this.totalAmount + value.amount;
          });
          this.initialDevAmount = this.totalAmountDue;

          if (this.creditNoteListValue) {
            this.totalElements = this.creditNoteListValue.totalElements;
            this.creditNoteListForm = this.formBuilder.group({
              selectAll: [false],
              creditNoteDetails: this.formBuilder.array(
                this.creditNoteListValue.cnList.map(x =>
                  this.formBuilder.group({
                    creditNoteId: [x.id],
                    instrumentNo: [x.docNo],
                    instrumentType: [x.creditNoteType],
                    amount: [x.amount],
                    discount: [x.totalDiscount],
                    priority: [x.priority],
                    redeemingAmount: [
                      null,
                      x.totalDiscount !== 0 ||
                      x.amount + x.totalDiscount > this.totalAmountDue
                        ? [
                            this.fieldValidatorsService.max(
                              x.amount,
                              this.redeemingamountLabel
                            )
                          ]
                        : []
                    ],
                    isSelected: [false],
                    fiscalYear: [x.fiscalYear]
                  })
                )
              )
            });
          }
          this.mapPaymentDetails();
        });
    }

    if (this.data && this.data.invokedCreditNote$) {
      this.data.invokedCreditNote$
        .pipe(takeUntil(this.destroy$))
        .subscribe(invokedCN => {
          if (invokedCN && invokedCN.cnList.length > 0) {
            if (!invokedCN.cnList[0]?.frozenRateDetails?.type) {
              switch (invokedCN.cnList[0].status) {
                case CreditNoteStatusEnum.OPEN: {
                  const regularCNList = this.creditNoteListValue.cnList.find(
                    cn =>
                      cn.docNo.toString() ===
                        invokedCN.cnList[0].docNo.toString() &&
                      cn.creditNoteType === invokedCN.cnList[0].creditNoteType
                  );
                  if (invokedCN.cnList[0].linkedTxnId !== null) {
                    this.invokedCN = null;
                    this.invokeCNErrorMsg = this.translatedMsg[
                      'pw.cnPayment.abcoErrorMsg'
                    ];
                  } else if (regularCNList) {
                    this.invokedCN = null;

                    this.invokeCNErrorMsg = this.translatedMsg[
                      'pw.cnPayment.selfCnErrorMsg'
                    ];
                  } else {
                    if (this.invokeCNForm) {
                      this.invokedCN = invokedCN.cnList[0];
                      this.invokeCNErrorMsg = '';
                      this.invokeCNForm
                        .get('redeemingAmount')
                        .setValidators(
                          this.fieldValidatorsService.max(
                            this.invokedCN?.amount,
                            this.redeemingamountLabel
                          )
                        );
                      this.invokeCNForm
                        .get('redeemingAmount')
                        .updateValueAndValidity();
                    }
                    this.data.isOtpForMinimunCn$
                      .pipe(takeUntil(this.destroy$))
                      .subscribe(isOTPForMinimunCN => {
                        this.isOTPForMinimumAmount = Number(isOTPForMinimunCN);
                      });
                    if (
                      this.invokedCN.totalDiscount === 0 ||
                      this.invokedCN.amount + this.invokedCN.totalDiscount <
                        this.totalAmountDue
                    ) {
                      if (this.invokedCN.amount >= this.isOTPForMinimumAmount) {
                        this.isOTPAllowedForMinimunCN = true;
                      } else {
                        this.isOTPAllowedForMinimunCN = false;
                      }
                    } else if (
                      this.invokedCN.totalDiscount === 0 ||
                      this.invokedCN.amount + this.invokedCN.totalDiscount >
                        this.totalAmountDue
                    ) {
                      if (
                        this.invokeCNForm.get('redeemingAmount').value >=
                        this.isOTPForMinimumAmount
                      ) {
                        this.isOTPAllowedForMinimunCN = true;
                      } else {
                        this.isOTPAllowedForMinimunCN = false;
                      }
                    } else if (this.totalAmountDue < this.invokedCN.amount) {
                      if (this.totalAmountDue >= this.isOTPForMinimumAmount) {
                        this.isOTPAllowedForMinimunCN = true;
                      } else {
                        this.isOTPAllowedForMinimunCN = false;
                      }
                    }
                  }

                  break;
                }
                case CreditNoteStatusEnum.REDEEMED: {
                  this.invokedCN = null;
                  this.invokeCNErrorMsg = this.translatedMsg[
                    'pw.cnPayment.redeemErrorMsg'
                  ];
                  break;
                }
                case CreditNoteStatusEnum.CANCELLED: {
                  this.invokedCN = null;
                  this.invokeCNErrorMsg = this.translatedMsg[
                    'pw.cnPayment.cancelledErrorMsg'
                  ];

                  break;
                }
                case CreditNoteStatusEnum.SUSPENDED: {
                  this.invokedCN = null;
                  this.invokeCNErrorMsg = this.translatedMsg[
                    'pw.cnPayment.suspendedErrorMsg'
                  ];
                  break;
                }
                default: {
                  this.invokedCN = null;
                  this.invokeCNErrorMsg =
                    this.translatedMsg[
                      'pw.cnPayment.creditNoteStatusErrorMsg'
                    ] + invokedCN.cnList[0].status;
                }
              }
            } else {
              this.invokedCN = null;
              this.invokeCNErrorMsg = this.translatedMsg[
                'pw.cnPayment.frozenDetailsErrorMsg'
              ];
            }
          } else if (invokedCN && invokedCN.cnList.length === 0) {
            this.invokedCN = null;
            this.invokeCNErrorMsg = this.translatedMsg[
              'pw.cnPayment.invalidErrorMsg'
            ];
          }
        });
    }

    if (this.router.url.includes('advance-booking')) {
      this.data.isOtpAllowedForAb$
        .pipe(takeUntil(this.destroy$))
        .subscribe(isOTPAllowed => {
          if (isOTPAllowed === 'true') {
            this.isAddCnBtnDisabled = true;
            this.isOTPAllowed = true;
          } else {
            this.isOTPAllowed = false;
          }
        });
    } else if (this.router.url.includes('cash-memo')) {
      this.data.isOtpAllowedForCm$
        .pipe(takeUntil(this.destroy$))
        .subscribe(isOTPAllowed => {
          if (isOTPAllowed === 'true') {
            this.isAddCnBtnDisabled = true;
            this.isOTPAllowed = true;
          } else {
            this.isOTPAllowed = false;
          }
        });
    } else if (this.router.url.includes('accept-advance')) {
      this.data.isOtpAllowedForAdvance$
        .pipe(takeUntil(this.destroy$))
        .subscribe(isOTPAllowed => {
          if (isOTPAllowed === 'true') {
            this.isAddCnBtnDisabled = true;
            this.isOTPAllowed = true;
          } else {
            this.isOTPAllowed = false;
          }
        });
    }

    setTimeout(() => {});

    this.createInvokeForm();

    this.photoIDProofUrl$
      .pipe(takeUntil(this.destroy$))
      .subscribe(photoIDProofUrl => {
        this.photoIDProofUrl = photoIDProofUrl;
      });
  }

  mapPaymentDetails() {
    if (this.data && this.data.paymentDetails$) {
      this.data.paymentDetails$
        .pipe(takeUntil(this.destroy$))
        .subscribe(paymentDetails => {
          if (paymentDetails.length > 0) {
            if (
              this.isPartialRedemption !== undefined &&
              this.isPartialRedemption !== null
            ) {
              const isPartialRedemptionthr = paymentDetails.find(
                payment =>
                  payment.instrumentNo ===
                    this.isPartialRedemption.docNo.toString() &&
                  payment.instrumentType.toString() ===
                    this.isPartialRedemption.creditNoteType.toString()
              );

              if (
                isPartialRedemptionthr === undefined ||
                isPartialRedemptionthr === null
              ) {
                this.isPartialRedemption = null;
                this.isPartialyPaymentAdded = false;
              } else {
                this.isPartialyPaymentAdded = true;
              }
            }

            this.paymentAddedCN = this.creditNoteListValue.cnList.filter(cn =>
              paymentDetails.find(
                payment =>
                  payment.instrumentNo === cn.docNo.toString() &&
                  payment.instrumentType.toString() ===
                    cn.creditNoteType.toString() &&
                  payment.reference2.toString() === cn.fiscalYear.toString()
              )
            );

            this.thirdPartyAddedPayment = paymentDetails;
            if (this.thirdPartyAddedPayment.length > 0) {
              const thirpatyPayment = [];
              const creditNoteIds = this.creditNoteListValue.cnList.map(
                cn => cn.id
              );
              this.thirdPartyAddedPayment.filter(cn => {
                if (
                  cn.reference3 !== null &&
                  cn.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
                  !cn.otherDetails?.data?.isLinkedCn &&
                  !creditNoteIds.includes(cn.reference3)
                ) {
                  thirpatyPayment.push(cn.reference3);
                }
              });

              if (thirpatyPayment.length > 0) {
                const thirdpartyPayload = {
                  customerIds: thirpatyPayment,
                  isPageable: false,
                  locationCode: ''
                };

                this.getThirdPartyCN.emit(thirdpartyPayload);

                if (this.data && this.data.thirdPartyCNList$) {
                  this.data.thirdPartyCNList$
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(thirdParyCN => {
                      if (thirdParyCN && thirdParyCN.cnList.length > 0) {
                        thirdParyCN.cnList.forEach(element => {
                          const addedThirdPartyCN = this.creditNoteListValue.cnList.find(
                            cn =>
                              cn.docNo.toString() ===
                                element.docNo.toString() &&
                              cn.creditNoteType.toString() ===
                                element.creditNoteType.toString()
                          );

                          if (
                            addedThirdPartyCN === undefined &&
                            !addedThirdPartyCN
                          ) {
                            this.creditNoteListValue.cnList.push(element);
                            this.paymentAddedCN.push(element);
                          }
                        });

                        if (this.creditNoteListValue) {
                          this.totalElements = this.creditNoteListValue.totalElements;

                          this.creditNoteListForm = this.formBuilder.group({
                            selectAll: [false],
                            creditNoteDetails: this.formBuilder.array(
                              this.creditNoteListValue.cnList.map(x =>
                                this.formBuilder.group({
                                  creditNoteId: [x.id],
                                  instrumentNo: [x.docNo],
                                  instrumentType: [x.creditNoteType],
                                  amount: [x.amount],
                                  discount: [x.totalDiscount],
                                  priority: [x.priority],
                                  redeemingAmount: [
                                    null,
                                    x.totalDiscount !== 0 ||
                                    x.amount + x.totalDiscount >
                                      this.totalAmountDue
                                      ? [
                                          this.fieldValidatorsService.max(
                                            x.amount,
                                            this.redeemingamountLabel
                                          )
                                        ]
                                      : []
                                  ],
                                  isSelected: [false],
                                  fiscalYear: [x.fiscalYear]
                                })
                              )
                            )
                          });
                        }
                        this.creditNoteListValue.cnList.forEach((cn, i) =>
                          paymentDetails.forEach(payment => {
                            if (
                              cn.docNo.toString() === payment.instrumentNo &&
                              cn.creditNoteType.toString() ===
                                payment.instrumentType.toString() &&
                              cn.fiscalYear.toString() ===
                                payment.reference2.toString()
                            ) {
                              this.itemsArray.controls[i]
                                .get('redeemingAmount')
                                .setValue(payment.amount);
                              this.itemsArray.controls[i]
                                .get('isSelected')
                                .setValue(true);
                            }
                          })
                        );
                      }
                    });
                }
              }
            }

            this.creditNoteListValue.cnList.forEach((cn, i) =>
              paymentDetails.forEach(payment => {
                if (
                  cn.docNo.toString() === payment.instrumentNo &&
                  cn.creditNoteType.toString() ===
                    payment.instrumentType.toString() &&
                  cn.fiscalYear.toString() === payment.reference2.toString()
                ) {
                  this.itemsArray.controls[i]
                    .get('redeemingAmount')
                    .setValue(payment.amount);
                  this.itemsArray.controls[i].get('isSelected').setValue(true);
                }
              })
            );

            const toGetPaymentDetailLength = paymentDetails.filter(
              payment => payment.paymentCode === PaymentModeEnum.CREDIT_NOTE
            );
            if (toGetPaymentDetailLength.length > 0) {
              this.totalQty = toGetPaymentDetailLength.length;
              this.totalEvaluation = toGetPaymentDetailLength
                .map(item => item.amount)
                .reduce((prev, next) => prev + next);
            } else {
              this.totalQty = 0;
              this.totalEvaluation = 0;
              this.isPartialRedemption = null;
              this.isPartialyPaymentAdded = false;
            }
          } else {
            this.totalQty = 0;
            this.totalEvaluation = 0;
            this.isPartialRedemption = null;
            this.isPartialyPaymentAdded = false;
            this.paymentAddedCN = [];
          }
        });
    }
  }
  close() {
    this.dialogRef.close(null);
  }

  onInputValueChange(otpValue) {
    if (otpValue !== '' && this.isOtpGeneratedForCN === true) {
      this.isAddCnBtnDisabled = false;
    }
  }

  addThirdPartyCN(invokedCN) {
    if (this.totalAmountDue > 0) {
      if (
        Number(invokedCN.amount) + Number(invokedCN.totalDiscount) >
        this.totalAmountDue
      ) {
        if (this.paymentAddedCN.length > 0) {
          const lowerPriorityCN = this.paymentAddedCN.reduce(function (
            res,
            obj
          ) {
            if (obj.priority > res.priority) {
              return obj;
            } else if (obj.priority === res.priority) {
              if (obj.amount > res.amount) {
                return obj;
              } else {
                return res;
              }
            } else {
              return res;
            }
          });
          if (lowerPriorityCN.priority > invokedCN.priority) {
            this.invokeCNErrorMsg =
              invokedCN.docNo +
              ' ' +
              invokedCN.creditNoteType +
              ' ' +
              this.priorityErrorMsg;
          } else if (lowerPriorityCN.priority === invokedCN.priority) {
            if (lowerPriorityCN.amount > invokedCN.amount) {
              this.invokeCNErrorMsg =
                invokedCN.docNo +
                ' ' +
                invokedCN.creditNoteType +
                ' ' +
                this.priorityErrorMsg;
            } else {
              this.invokeCNErrorMsg = '';
              if (invokedCN.totalDiscount !== 0) {
                if (
                  this.invokeCNForm.get('redeemingAmount').value === '' ||
                  this.invokeCNForm.get('redeemingAmount').value === null
                ) {
                  this.validationErrorMsg =
                    'Please enter redeeming amount for CN Number ' +
                    invokedCN.creditNoteId;
                } else {
                  this.validationErrorMsg = '';
                  this.addThirdPartyCnPaylaod(
                    invokedCN,
                    this.invokeCNForm.get('redeemingAmount').value
                  );
                }
              } else {
                this.isPartialRedemption = invokedCN;
                this.addThirdPartyCnPaylaod(invokedCN, this.totalAmountDue);
              }
            }
          } else {
            this.invokeCNErrorMsg = '';
            if (invokedCN.totalDiscount !== 0) {
              if (
                this.invokeCNForm.get('redeemingAmount').value === '' ||
                this.invokeCNForm.get('redeemingAmount').value === null
              ) {
                this.validationErrorMsg =
                  'Please enter redeeming amount for CN Number ' +
                  invokedCN.creditNoteId;
              } else {
                this.validationErrorMsg = '';
                this.isPartialRedemption = invokedCN;
                this.addThirdPartyCnPaylaod(
                  invokedCN,
                  this.invokeCNForm.get('redeemingAmount').value
                );
              }
            } else {
              this.isPartialRedemption = invokedCN;
              this.addThirdPartyCnPaylaod(invokedCN, this.totalAmountDue);
            }
          }
        } else {
          this.invokeCNErrorMsg = '';
          if (invokedCN.totalDiscount !== 0) {
            if (
              this.invokeCNForm.get('redeemingAmount').value === '' ||
              this.invokeCNForm.get('redeemingAmount').value === null
            ) {
              this.validationErrorMsg =
                'Please enter redeeming amount for CN Number ' +
                invokedCN.creditNoteId;
            } else {
              this.validationErrorMsg = '';
              this.isPartialRedemption = invokedCN;
              this.addThirdPartyCnPaylaod(
                invokedCN,
                this.invokeCNForm.get('redeemingAmount').value
              );
            }
          } else {
            this.isPartialRedemption = invokedCN;
            this.addThirdPartyCnPaylaod(invokedCN, this.totalAmountDue);
          }
        }
      } else {
        this.invokeCNErrorMsg = '';

        this.addThirdPartyCnPaylaod(invokedCN, invokedCN.amount);
      }
    } else {
      if (this.totalAmountDue <= 0) {
        this.invokeCNErrorMsg = this.exceedAmountErrorMsg;
      } else {
        this.invokeCNErrorMsg = '';
      }
    }
  }

  invokeCN() {
    if (this.invokeCNForm.valid) {
      const invokeCnPayload = {
        cnNumber: this.invokeCNForm.get('cnNumber').value,
        fiscalYear: this.invokeCNForm.get('fiscalYear').value,
        locationCode: ''
      };

      this.isThirdPartyCnAdd = false;
      this.getInvokedCN.emit(invokeCnPayload);
      this.tabChanged.emit(true);
      this.invokeCNForm.get('otp').reset();
      this.invokeCNForm.get('otp').disable();
      if (this.isOTPAllowed === true) {
        this.isAddCnBtnDisabled = true;
      }
    }
  }

  createInvokeForm() {
    this.translationService
      .get(['pw.cnPayment.enterCNLabel', 'pw.cnPayment.fiscalYearLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.invokeCNForm = new FormGroup({
          cnNumber: new FormControl('', [
            this.fieldValidatorsService.requestNumberField(
              translatedMsg['pw.cnPayment.enterCNLabel']
            ),
            this.fieldValidatorsService.requiredField(
              translatedMsg['pw.cnPayment.enterCNLabel']
            )
          ]),
          fiscalYear: new FormControl('', [
            this.fieldValidatorsService.fiscalYearField(
              translatedMsg['pw.cnPayment.fiscalYearLabel']
            ),
            this.fieldValidatorsService.requiredField(
              translatedMsg['pw.cnPayment.fiscalYearLabel']
            )
          ]),
          otp: new FormControl('', [
            this.fieldValidatorsService.alphaNumericField('Otp')
          ]),
          redeemingAmount: new FormControl(null, [
            this.fieldValidatorsService.max(
              this.invokedCN?.amount,
              this.redeemingamountLabel
            )
          ])
        });
      });

    this.invokeCNForm.get('otp').disable();
  }

  onTabChange($event) {
    this.tabChanged.emit(true);
    this.invokedCN = null;
    this.invokeCNErrorMsg = '';
    this.invokeCNForm.reset();
    this.isThirdPartyCnAdd = false;
  }

  generateOTP(invokedCN) {
    if (invokedCN) {
      this.generateOTPForCn.emit({ id: invokedCN.id, type: 'CN' });
      this.invokeCNForm.get('otp').enable();
      this.continueWithoutOTP = false;
      this.enablePhotoIDProofUpload = false;
    }
  }

  addAll() {
    if (this.totalAmount <= this.initialDevAmount) {
      this.creditNoteListValue.cnList.forEach((element, i) => {
        this.itemsArray.controls[i]
          .get('redeemingAmount')
          .setValue(Number(element.amount));
        this.addCreditNotePaylaod(i, element.docNo);
      });
    }
  }

  removeAll() {
    this.creditNoteListForm.get('selectAll').setValue(false);
    this.creditNoteListValue.cnList.forEach((element, i) => {
      this.itemsArray.controls[i].get('redeemingAmount').setValue(null);
      this.itemsArray.controls[i].get('isSelected').setValue(false);
      this.removePaymentDetail.emit(element.docNo);
    });
  }

  get itemsArray(): FormArray {
    return this.creditNoteListForm.get('creditNoteDetails') as FormArray;
  }

  addThirdPartyCnPaylaod(invokedCN, redeemingAmount) {
    if (this.invokeCNForm.valid) {
      this.currentlyAddedPayment = null;
      const slectedCreditNote = {
        reference3: invokedCN.id,
        amount: redeemingAmount,
        instrumentNo: invokedCN.docNo,
        instrumentType: invokedCN.creditNoteType,
        instrumentDate: this.data.businessDate,
        priority: invokedCN.priority,
        fiscalYear: invokedCN.fiscalYear,
        reference1: this.invokeCNForm.get('otp').value,
        isWithoutOtp: this.continueWithoutOTP
      };
      this.dialogRef.close(
        new CreditNotePayment(this.data.paymentGroup, slectedCreditNote)
      );
      this.paymentAddSuccessMessage = '';
    }
  }

  addCreditNotePaylaod(index, creditNoteId) {
    this.currentlyAddedPayment = null;
    const slectedCreditNote = {
      reference3: this.itemsArray.controls[index].get('creditNoteId').value,
      amount: this.itemsArray.controls[index].get('redeemingAmount').value,
      instrumentNo: this.itemsArray.controls[index].get('instrumentNo').value,
      instrumentType: this.itemsArray.controls[index].get('instrumentType')
        .value,
      instrumentDate: this.data.businessDate,
      priority: this.itemsArray.controls[index].get('priority').value,
      fiscalYear: this.itemsArray.controls[index].get('fiscalYear').value
    };

    this.addCreditNotePayment.emit(
      new CreditNotePayment(this.data.paymentGroup, slectedCreditNote)
    );
    this.itemsArray.controls[index].get('redeemingAmount').setValue(null);
    if (this.creditNoteListValue.cnList[index].totalDiscount !== 0) {
      setTimeout(() => {
        this.dialogRef.close(null);
      }, 1000);
    }
  }

  addRegularCN(index, creditNoteId, priority) {
    if (
      this.totalAmountDue > 0 &&
      this.creditNoteListValue.cnList[index].amount !== 0
    ) {
      if (this.isPartialyPaymentAdded) {
        this.errorMeassge =
          'After partial redemption you can not add CN without removing partialy redeemed CN';
      } else if (
        Number(this.itemsArray.controls[index].get('amount').value) +
          Number(this.itemsArray.controls[index].get('discount').value) >
        this.totalAmountDue
      ) {
        if (
          !this.data.isCNPartialRedeemAllowed &&
          (this.creditNoteListValue.cnList[index].creditNoteType ===
            ConfigTypeEnum.DIGI_GOLD_TANISHQ ||
            this.creditNoteListValue.cnList[index].creditNoteType ===
              ConfigTypeEnum.DIGI_GOLD_NON_TANISHQ)
        ) {
          this.errorMeassge = this.partialRedeemErrorMsg;
        }
        if (
          this.paymentAddedCN.filter(x => !x.frozenRateDetails?.type).length > 0
        ) {
          const lowerPriorityCN = this.paymentAddedCN
            .filter(x => !x.frozenRateDetails?.type)
            ?.reduce(function (res, obj) {
              if (obj.priority > res.priority) {
                return obj;
              } else if (obj.priority === res.priority) {
                if (obj.amount > res.amount) {
                  return obj;
                } else {
                  return res;
                }
              } else {
                return res;
              }
            });
          if (lowerPriorityCN.priority > priority) {
            this.errorMeassge =
              this.creditNoteListValue.cnList[index].docNo +
              ' ' +
              this.creditNoteListValue.cnList[index].creditNoteType +
              ' ' +
              this.priorityErrorMsg;
          } else if (lowerPriorityCN.priority === priority) {
            if (
              lowerPriorityCN.amount >
              this.itemsArray.controls[index].get('amount').value
            ) {
              this.errorMeassge =
                this.creditNoteListValue.cnList[index].docNo +
                ' ' +
                this.creditNoteListValue.cnList[index].creditNoteType +
                ' ' +
                this.priorityErrorMsg;
            } else {
              this.errorMeassge = '';
              if (this.itemsArray.controls[index].get('discount').value !== 0) {
                if (
                  this.itemsArray.controls[index].get('redeemingAmount')
                    .value === '' ||
                  this.itemsArray.controls[index].get('redeemingAmount')
                    .value === null
                ) {
                  this.validationErrorMsg =
                    'Please enter redeeming amount for CN Number ' +
                    creditNoteId;
                } else {
                  this.validationErrorMsg = '';
                  this.addCreditNotePaylaod(index, creditNoteId);
                }
              } else {
                this.itemsArray.controls[index]
                  .get('redeemingAmount')
                  .setValue(Number(this.totalAmountDue.toFixed(2)));
                this.isPartialRedemption = this.creditNoteListValue.cnList[
                  index
                ];
                this.addCreditNotePaylaod(index, creditNoteId);
              }
            }
          } else {
            this.errorMeassge = '';
            if (this.itemsArray.controls[index].get('discount').value !== 0) {
              if (
                this.itemsArray.controls[index].get('redeemingAmount').value ===
                  '' ||
                this.itemsArray.controls[index].get('redeemingAmount').value ===
                  null
              ) {
                this.validationErrorMsg =
                  'Please enter redeeming amount for CN Number ' + creditNoteId;
              } else {
                this.validationErrorMsg = '';
                this.addCreditNotePaylaod(index, creditNoteId);
              }
            } else {
              this.itemsArray.controls[index]
                .get('redeemingAmount')
                .setValue(Number(this.totalAmountDue.toFixed(2)));
              this.isPartialRedemption = this.creditNoteListValue.cnList[index];
              this.addCreditNotePaylaod(index, creditNoteId);
            }
          }
        } else {
          this.errorMeassge = '';
          if (this.itemsArray.controls[index].get('discount').value !== 0) {
            if (
              this.itemsArray.controls[index].get('redeemingAmount').value ===
                '' ||
              this.itemsArray.controls[index].get('redeemingAmount').value ===
                null
            ) {
              this.validationErrorMsg =
                'Please enter redeeming amount for CN Number ' + creditNoteId;
            } else {
              this.validationErrorMsg = '';
              this.addCreditNotePaylaod(index, creditNoteId);
            }
          } else {
            this.itemsArray.controls[index]
              .get('redeemingAmount')
              .setValue(Number(this.totalAmountDue.toFixed(2)));
            this.isPartialRedemption = this.creditNoteListValue.cnList[index];
            this.addCreditNotePaylaod(index, creditNoteId);
          }
        }
      } else {
        this.errorMeassge = '';
        this.isPartialRedemption = null;

        this.itemsArray.controls[index]
          .get('redeemingAmount')
          .setValue(this.itemsArray.controls[index].get('amount').value);
        this.addCreditNotePaylaod(index, creditNoteId);
      }
    } else {
      if (this.totalAmountDue <= 0) {
        this.errorMeassge = this.exceedAmountErrorMsg;
        this.isPartialRedemption = null;
      } else {
        this.errorMeassge = '';
      }
    }
  }

  removePaymentDetails(i, creditNoteId) {
    this.removePaymentDetail.emit(creditNoteId);
    this.itemsArray.controls[i].get('redeemingAmount').setValue(null);
    this.itemsArray.controls[i].get('isSelected').setValue(false);
    this.errorMeassge = '';
  }

  getCNRivaahGHSDiscDetails(creditNote) {
    if (creditNote.rivaahGhsDiscountDetails) {
      return `${this.mcLabel}:${
        creditNote.rivaahGhsDiscountDetails.discountMcPct
          ? creditNote.rivaahGhsDiscountDetails.discountMcPct
          : 0
      }%, ${this.ucpLabel}:${
        creditNote.rivaahGhsDiscountDetails.discountUcpPct
          ? creditNote.rivaahGhsDiscountDetails.discountUcpPct
          : 0
      }%`;
    } else {
      return creditNote.totalDiscount;
    }
  }

  withoutOTP() {
    this.continueWithoutOTP = true;
    this.enablePhotoIDProofUpload = true;
    this.idProofUploadValidation();
    this.invokeCNForm.get('otp').reset();
    this.invokeCNForm.get('otp').disable();
  }

  idProofUploadValidation() {
    if (this.isPhotoIDProofUploadMandatory) {
      if (this.uploadedPhotoIDProof) {
        this.idProofUploadedForWithoutOTP = true;
      } else {
        this.idProofUploadedForWithoutOTP = false;
      }
    } else {
      this.idProofUploadedForWithoutOTP = true;
    }
  }

  uploadSuccess(event) {
    const fileList: FileList = event;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      formData.append('file', fileList.item(0));
      this.uploadedPhotoIDProof = formData;
      this.uploadPhotoIDProof.emit(formData);
      this.idProofUploadValidation();
    }
  }

  uploadError(event: string) {
    this.showNotifications(event);
  }

  showNotifications(key: string) {
    this.translationService
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }

  clear() {
    this.photoIDProofUrl = null;
    this.uploadedPhotoIDProof = null;
    this.idProofUploadValidation();
  }

  addCNButtonValidation() {
    if (this.isOTPAllowed === true && this.isOTPAllowedForMinimunCN === true) {
      if (this.isPhotoIDProofCollected.value) {
        if (this.continueWithoutOTP) {
          if (this.idProofUploadedForWithoutOTP) {
            return !(
              this.invokeCNForm.get('cnNumber').valid &&
              this.invokeCNForm.get('fiscalYear').valid &&
              this.invokeCNForm.get('redeemingAmount').valid
            );
          } else {
            return true;
          }
        } else {
          return this.isAddCnBtnDisabled || !this.invokeCNForm.valid;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
