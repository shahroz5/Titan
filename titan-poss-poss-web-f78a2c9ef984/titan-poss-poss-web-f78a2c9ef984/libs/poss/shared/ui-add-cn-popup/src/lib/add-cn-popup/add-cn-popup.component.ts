import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CNDetailsResponsePayload,
  CreditNoteType,
  PaymentModeEnum,
  ProductTypesEnum,
  SubTransactionTypeEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-add-cn-popup',
  templateUrl: './add-cn-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCnPopupComponent implements OnInit, OnDestroy {
  cnForm: FormGroup;
  cnTypeChange = new EventEmitter();
  cnAdd = new EventEmitter();
  cnUpdate = new EventEmitter();
  cnTypesList = [];
  cnNumbersList = [];
  cnDetailsList: CNDetailsResponsePayload[] = [];
  selectedCnDetails: CNDetailsResponsePayload;
  productTypesRef = ProductTypesEnum;
  transactionTypeEnum = TransactionTypeEnum;
  destroy$: Subject<null> = new Subject<null>();
  goldRateFixLabel: string;
  grnGoldRateLabel: string;

  constructor(
    public dialogRef: MatDialogRef<AddCnPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isGRFAllowedCM: boolean;
      isGRNAllowedCM: boolean;
      isGrnAllowedInAdvanceBooking: boolean;
      isGRFAllowedAB: boolean;
      subTransactionType: SubTransactionTypeEnum;
    },
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.productGrid.goldRateFixLabel',
        'pw.productGrid.grnGoldRateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.goldRateFixLabel =
          translatedMessages['pw.productGrid.goldRateFixLabel'];
        this.grnGoldRateLabel =
          translatedMessages['pw.productGrid.grnGoldRateLabel'];
      });

    if (
      (data.isGRFAllowedCM &&
        data.subTransactionType === SubTransactionTypeEnum.NEW_CM) ||
      (data.isGRFAllowedAB &&
        data.subTransactionType === SubTransactionTypeEnum.NEW_AB)
    ) {
      this.cnTypesList.push({
        value: CreditNoteType.ADV,
        description: this.goldRateFixLabel
      });
    }
    if (
      (data.isGRNAllowedCM || data.isGrnAllowedInAdvanceBooking) &&
      (data.subTransactionType === SubTransactionTypeEnum.NEW_CM ||
        data.subTransactionType === SubTransactionTypeEnum.NEW_AB)
    ) {
      this.cnTypesList.push({
        value: CreditNoteType.GRN,
        description: this.grnGoldRateLabel
      });
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.cnForm = new FormGroup({
      cnType: new FormControl(),
      cnNumber: new FormControl(),
      billingType: new FormControl(ProductTypesEnum.PLAIN)
    });
  }

  onCNTypeChange() {
    this.cnDetailsList = [];
    this.cnNumbersList = [];
    this.selectedCnDetails = null;
    this.cnForm.get('cnNumber').patchValue(null);
    this.cnTypeChange.emit(this.cnForm.get('cnType').value);
  }
  onCNNumChange() {
    this.selectedCnDetails = this.cnDetailsList?.find(
      x => x.docNo === this.cnForm.get('cnNumber').value
    );
    this.selectedCnDetails = {
      ...this.selectedCnDetails,
      productType: this.cnForm.get('billingType').value
    };
    this.cnForm
      .get('billingType')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        this.selectedCnDetails = { ...this.selectedCnDetails, productType: x };
        this.cnUpdate.emit(this.selectedCnDetails);
      });
    this.cnUpdate.emit(this.selectedCnDetails);
  }

  closePopup(): void {
    this.dialogRef.close(null);
  }

  addCNData() {
    const slectedCreditNote = {
      reference3: this.selectedCnDetails.id,
      amount: this.selectedCnDetails.amount,
      instrumentNo: this.selectedCnDetails.docNo,
      instrumentType: this.selectedCnDetails.creditNoteType,
      instrumentDate: this.selectedCnDetails.docDate,
      fiscalYear: this.selectedCnDetails.fiscalYear,
      otherDetails: {
        type: PaymentModeEnum.CREDIT_NOTE,
        data: {
          isRateProtectedCN: true,
          allowedCategory: this.cnForm.get('billingType').value
        }
      }
    };
    this.cnAdd.emit(slectedCreditNote);
    setTimeout(() => {
      this.dialogRef.close(null);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
