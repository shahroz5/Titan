import {
  Component,
  OnInit,
  Inject,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  EnteredGHSDetails,
  GHSAccount,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PaymentGroupEnum,
  PaymentModeEnum
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { take, takeUntil } from 'rxjs/operators';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  DeleteAllRowsComponent,
  DeleteRowComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-payment-eghs-popup',
  templateUrl: './payment-eghs-popup.component.html',
  styleUrls: ['./payment-eghs-popup.component.scss']
})
export class PaymentEghsPopupComponent implements OnInit, OnDestroy {
  @Output() getGHSDetails = new EventEmitter<string>();
  @Output() getAttachments = new EventEmitter<any>();

  @Output() checkclick = new EventEmitter<EnteredGHSDetails>();
  @Output() addGHS = new EventEmitter<GHSAccount>();
  @Output() generateGhsOtp = new EventEmitter<any>();
  @Output() emitCustomerIds = new EventEmitter<any>();
  @Output() uploadPhotoIDProof = new EventEmitter<FormData>();

  gridApi: GridApi;
  columnApi: ColumnApi;
  columnDefs = [];
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true
  };
  rowSelection = 'multiple';
  animateRows = true;
  domLayout = 'autoHeight';
  rowHeight = 50;
  rowData = [];

  destroy$ = new Subject();
  searchAccountFormControl: FormControl;
  GHSpassBookNumber: FormControl;
  OTPFiledFormControl: FormControl;
  isPhotoIDProofCollected: FormControl;

  public activeTab = 0;
  attachments = [];
  accountNumber = '';
  accountDetails: any;
  redeemedAmt: number;
  component: PaymentEghsPopupComponent = this;
  errorMsg = '';
  warningMsg = '';
  boutiqueCode: string;
  isOtpGenerated: any;
  ghsResponse;
  ghsCustomer: any;
  attachmenterrorMsg: string;
  lostPassBook = false;
  paymentModeEnumRef = PaymentModeEnum;
  mcLabel: string;
  ucpLabel: string;
  enablePhotoIDProofUpload = false;
  uploadedPhotoIDProof = null;
  continueWithoutOTP = false;
  idProofUploadedForWithoutOTP = false;
  photoIDProofUrl$: Observable<string>;
  photoIDProofUrl: string;
  isPhotoIDProofUploadMandatory = false;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public dialogRef: MatDialogRef<PaymentEghsPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      EGHS$: Subject<any>;
      accDetails;
      tempDocs;
      temp;
      enteredGHSDetails: EnteredGHSDetails;
      paymentMode: PaymentModeEnum;
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      businessDate: string;
      totalAmountDue;
      attachments$: Subject<any>;
      paymentsAdded$: Subject<any>;
      ghsCustomerSearch$: Observable<any>;
      isOtpGenerated$: Observable<any>;
      isOtpRequired: boolean;
      isGhsAllowed: boolean;
      locationCode: string;
      prevCustId: string;
      isUploadMandatoryforGHSWithoutOTP: boolean;
    }
  ) {
    this.translate
      .get(['pw.GHRedemption.mcLabel', 'pw.GHRedemption.ucpLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.mcLabel = translatedMessages['pw.GHRedemption.mcLabel'];
        this.ucpLabel = translatedMessages['pw.GHRedemption.ucpLabel'];
      });
    // console.log(data.isOtpRequired, 'isOtpRequired');
    //alert(this.data.enteredGhSDetails?.accountNumber)
    this.searchAccountFormControl = new FormControl(
      this.data.enteredGHSDetails?.accountNumber
        ? this.data.enteredGHSDetails.accountNumber
        : '',
      [
        this.fieldValidatorsService.numbersField('Account Number'),
        this.fieldValidatorsService.requiredField('Account Number')
      ]
    );

    this.GHSpassBookNumber = new FormControl(
      this.data.enteredGHSDetails?.passbookNumber
        ? this.data.enteredGHSDetails.passbookNumber
        : '',
      [this.fieldValidatorsService.requiredField('Pass book No.')]
    );
    this.OTPFiledFormControl = new FormControl(
      this.data.enteredGHSDetails?.otp ? this.data.enteredGHSDetails.otp : '',
      this.data.isOtpRequired
        ? [this.fieldValidatorsService.requiredField('OTP')]
        : []
    );
    this.isPhotoIDProofCollected = new FormControl(false);
    this.isPhotoIDProofUploadMandatory = this.data.isUploadMandatoryforGHSWithoutOTP;
    this.data.EGHS$.pipe(takeUntil(this.destroy$)).subscribe(x => {
      console.log(x, 'check');

      this.accountDetails = x;

      if (this.accountDetails) {
        this.GHSpassBookNumber.enable();
        this.redeemedAmt = this.accountDetails.totalGhsAdvance;
      }
      if (this.accountDetails.passbookNo.startsWith('LP_')) {
        this.lostPassBook = true;
        this.GHSpassBookNumber.patchValue(this.accountDetails.passbookNo);
        this.GHSpassBookNumber.disable();
      } else this.lostPassBook = false;
      // if (this.accountDetails.isProofsAvailable) {
      this.getAttachments.emit({
        accNo: this.accountNumber,
        custId: this.accountDetails.accountCustomerId
      });
      // }
    });
    this.data.attachments$.pipe(takeUntil(this.destroy$)).subscribe(x => {
      this.attachments = x;
      console.log(this.attachments, 'attachments');
    });
    this.attachments = [];
    this.data.paymentsAdded$.pipe(takeUntil(this.destroy$)).subscribe(x => {
      this.ghsResponse = x;

      this.rowData.push({
        id: this.ghsResponse.id,
        accountNo: this.ghsResponse.instrumentNo,
        scheme: this.ghsResponse.otherDetails?.data?.schemeCode,
        discount:
          this.ghsResponse.reference3 === PaymentModeEnum.RIVAAH_SCHEME
            ? `${this.mcLabel} : ${this.ghsResponse.otherDetails?.data?.discountMcPct} % , ${this.ucpLabel} : ${this.ghsResponse.otherDetails?.data?.discountUcpPct} % `
            : this.ghsResponse.otherDetails?.data?.bonus,
        amount: this.ghsResponse.amount
      });

      this.gridApi.setRowData(this.rowData);
      if (this.ghsResponse.instrumentNo === this.accountNumber) {
        this.resetForm();
      }
    });

    this.data.ghsCustomerSearch$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ghsCustomer => {
        if (ghsCustomer) this.ghsCustomer = ghsCustomer;
      });
    this.data.isOtpGenerated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOptGenerated => {
        this.isOtpGenerated = isOptGenerated;
        if (this.isOtpGenerated === true) {
          this.OTPFiledFormControl.enable();
          this.OTPFiledFormControl.setValidators([
            this.fieldValidatorsService.requiredField('OTP'),
            this.fieldValidatorsService.alphaNumericField('OTP'),
            this.fieldValidatorsService.maxLength(6, 'OTP')
          ]);
        }
      });
    this.columnDefs = [
      {
        headerName: 'GH A/C No.',
        field: 'accountNo'
      },
      {
        headerName: 'GH Scheme',
        field: 'scheme'
      },
      {
        headerName: 'Estimated Disc.',
        field: 'discount'
      },
      {
        headerName: 'Redeemed Amt.',
        field: 'amount'
      }
    ];
  }

  ngOnInit() {
    this.data.enteredGHSDetails?.passbookNumber
      ? this.GHSpassBookNumber.enable()
      : this.GHSpassBookNumber.disable();

    this.data.enteredGHSDetails?.accountNumber
      ? (this.accountNumber = this.data.enteredGHSDetails.accountNumber)
      : (this.accountNumber = '');
    this.OTPFiledFormControl.disable();
    this.accountDetails = this.data.temp
      ? this.data.accDetails
      : this.accountDetails;
    this.attachments = this.data.temp ? this.data.tempDocs : this.attachments;
    this.rowData = this.data.temp ? this.rowData : [];
    this.photoIDProofUrl$
      .pipe(takeUntil(this.destroy$))
      .subscribe(photoIDProofUrl => {
        this.photoIDProofUrl = photoIDProofUrl;
      });
  }
  close() {
    this.dialogRef.close(null);
  }
  getAccountDetails() {
    this.searchAccountFormControl.markAsTouched();
    this.accountNumber = this.searchAccountFormControl.value;
    this.getGHSDetails.emit(this.accountNumber);
  }
  onTabChange($event) {
    // this.productList = [];
  }
  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.rowData);
  }
  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent,
      deleteAllRowsRenderer: DeleteAllRowsComponent
    };
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }
  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (keyPressed === 'Enter' && event.colDef.celId === 'delete') {
      this.deleteRow();
    }
  }
  onCellClicked(event) {
    if (event.colDef.celId === 'delete') {
      this.deleteRow();
    }
  }
  deleteRow() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.gridApi.applyTransaction({ remove: selectedRows });
  }
  generateOTP() {
    this.OTPFiledFormControl.enable();
    if (this.accountDetails) {
      this.generateGhsOtp.emit({
        id: this.accountDetails.id,
        type: 'GHS'
      });
    }
    this.continueWithoutOTP = false;
    this.enablePhotoIDProofUpload = false;
  }

  checkErrors() {
    if (!this.data.isGhsAllowed) {
      this.errorMsg = 'GHS Account is not allowed for redemption';
      return true;
    }
    if (!this.accountDetails.isRedeemable) {
      this.errorMsg = 'GHS Account is not redeemable';
      return true;
    } else if (
      this.accountDetails.maturityLocationCode &&
      this.data.locationCode !== this.accountDetails.maturityLocationCode
    ) {
      this.errorMsg =
        'GHS account cannot be used as payment at current location.';
      return true;
    } else if (
      this.accountDetails.maturityLocationCode === null &&
      this.data.locationCode !== this.accountDetails.enrolledLocationCode
    ) {
      this.errorMsg =
        'GHS account cannot be used as payment at current location.';
      return true;
    }
    //  else if (!this.accountDetails.isProofsAvailable) {
    //   this.activeTab = 1;
    //   this.attachmenterrorMsg =
    //     'ID proof is not available as attachment. Please upload ID proof in EGHS portal';
    //   return true;
    // }
    else return false;
  }

  checkWarnings() {
    if (this.accountDetails.totalGhsAdvance > this.accountDetails.balance) {
      this.warningMsg = 'pw.GHRedemption.installMentWarningMsg';
      return true;
    } else {
      this.warningMsg = '';
      return false;
    }
  }
  AddPayment() {
    if (this.accountDetails) {
      const errors = this.checkErrors();
      this.checkWarnings();
      if (!errors) {
        this.addGHS.emit(
          new GHSAccount(this.data.paymentGroup, {
            amount: this.accountDetails.balance,
            instrumentNo: this.accountNumber,
            instrumentType: this.data.paymentMode,
            instrumentDate: this.data.businessDate,
            reference2: this.GHSpassBookNumber.value,
            reference1: this.OTPFiledFormControl.value
              ? this.OTPFiledFormControl.value
              : null,
            isWithoutOtp: this.continueWithoutOTP
          })
        );
        this.emitCustomerIds.emit({
          oldCustId: this.data.prevCustId,
          ghsCustId: this.accountDetails.customerId
        });
        this.enablePhotoIDProofUpload = false;
      }
    }
  }

  resetForm() {
    this.searchAccountFormControl.reset();
    this.OTPFiledFormControl.reset();
    this.OTPFiledFormControl.disable();
    this.GHSpassBookNumber.reset();
    this.GHSpassBookNumber.disable();
    this.accountDetails = null;
    this.isOtpGenerated = false;
  }
  onSelected(data?) {
    this.activeTab = 1;
  }
  openPopup(url) {
    this.dialogRef.close(false);
    const GHSDetails: EnteredGHSDetails = {
      accountNumber: this.accountNumber,
      passbookNumber: this.GHSpassBookNumber.value,
      otp: null,
      imageUrl: url
    };
    this.checkclick.emit(GHSDetails);
  }

  withoutOTP() {
    this.continueWithoutOTP = true;
    this.enablePhotoIDProofUpload = true;
    this.idProofUploadValidation();
    this.OTPFiledFormControl.reset();
    this.OTPFiledFormControl.disable();
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
    this.translate
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

  addAccountValidation() {
    if (this.data.isOtpRequired) {
      if (this.isPhotoIDProofCollected.value) {
        if (this.continueWithoutOTP) {
          if (this.idProofUploadedForWithoutOTP) {
            return this.passbookValidation();
          } else {
            return true;
          }
        } else {
          if (this.OTPFiledFormControl.valid) {
            return this.passbookValidation();
          } else {
            return !this.OTPFiledFormControl.valid;
          }
        }
      } else {
        return true;
      }
    } else {
      return this.passbookValidation();
    }
  }

  passbookValidation() {
    if (this.lostPassBook) {
      return !this.lostPassBook;
    } else {
      return !this.GHSpassBookNumber.valid;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.dialogRef.close(true);
  }
}
