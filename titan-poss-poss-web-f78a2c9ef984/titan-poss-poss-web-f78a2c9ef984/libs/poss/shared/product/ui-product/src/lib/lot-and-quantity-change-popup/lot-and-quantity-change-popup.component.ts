import {
  Component,
  EventEmitter,
  Inject,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-lot-and-quantity-change-popup',
  templateUrl: './lot-and-quantity-change-popup.component.html',
  styleUrls: ['./lot-and-quantity-change-popup.component.scss']
})
export class LotAndQuantityChangePopupComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  lotQtyForm: FormGroup;
  qtyLabel: string;
  lotLabel: string;
  @Output() lotNumChange = new EventEmitter<string>();
  valueForPopup: any;

  constructor(
    public dialogRef: MatDialogRef<LotAndQuantityChangePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<any>,
    private translate: TranslateService,
    private fieldValidatorService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.productGrid.qtyLabel',
        'pw.productGrid.lotNumberTableHeaderText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.qtyLabel = translatedMessages['pw.productGrid.qtyLabel'];
        this.lotLabel =
          translatedMessages['pw.productGrid.lotNumberTableHeaderText'];
      });
  }

  ngOnInit(): void {
    this.data.pipe(takeUntil(this.destroy$)).subscribe(valueForPopup => {
      this.valueForPopup = valueForPopup;
    });

    this.createForm();
  }

  onLotNumChange() {
    const selectedLotNumber = this.valueForPopup.lotNumberList.find(
      val => val.inventoryId === this.lotQtyForm.get('lotNumber').value
    );
    this.lotQtyForm.controls['quantity'].setValidators([
      this.fieldValidatorService.min(1, this.qtyLabel),
      this.fieldValidatorService.max(
        selectedLotNumber.totalQuantity,
        this.qtyLabel
      ),
      this.fieldValidatorService.quantityField(this.qtyLabel),
      this.fieldValidatorService.requiredField(this.qtyLabel)
    ]);
    this.lotQtyForm.controls['quantity'].updateValueAndValidity();
    // this.lotNumChange.emit(this.lotQtyForm.get('lotNumber').value);
  }

  createForm() {
    this.lotQtyForm = new FormGroup({
      lotNumber: new FormControl(this.valueForPopup.selectedLotNumber, [
        this.fieldValidatorService.requiredField(this.lotLabel)
      ]),
      quantity: new FormControl(this.valueForPopup.selectedQty, [
        this.fieldValidatorService.min(1, this.qtyLabel),
        this.fieldValidatorService.max(
          this.valueForPopup.totalQty,
          this.qtyLabel
        ),
        this.fieldValidatorService.quantityField(this.qtyLabel),
        this.fieldValidatorService.requiredField(this.qtyLabel)
      ])
    });
  }

  closeDialog(res: boolean) {
    this.dialogRef.close(false);
  }

  apply() {
    if (this.lotQtyForm.valid) {
      const payload = {
        selectedQty: this.lotQtyForm.get('quantity').value,
        selectedLot: this.lotQtyForm.get('lotNumber').value
      };
      this.dialogRef.close(payload);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
