import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  OtherIssuesItem,
  OtherReceiptsIssuesEnum,
  ItemData
} from '@poss-web/shared/models';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-exhibition-issue-item',
  templateUrl: './exhibition-issue-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExhibitionIssueItemComponent implements OnInit, OnDestroy {
  @Input() item: OtherIssuesItem;
  @Input() issueType: string;
  itemForm: FormGroup;
  destroy$ = new Subject<null>();
  measuredWeight: number;
  itemWeight: number;
  showUpdateStatus = true;
  weight = 0;
  status: string;
  weightToDisplay: string;
  qty: number;
  disabled: boolean;
  itemData: ItemData;
  @Input() dateFormat: string;
  binCode: string;
  constructor(
    private weightFormatter: WeightFormatterService,
    private fieldValidatorsService: FieldValidatorsService
  ) {}

  ngOnInit() {
    this.itemData = {
      itemCode: this.item.itemCode,
      lotNumber: this.item.lotNumber,
      productGroup: this.item.productGroup,
      productCategory: this.item.productCategory,
      stdValue: this.item.stdValue,
      stdWeight: this.item.stdWeight,
      currencyCode: this.item.currencyCode,
      weightUnit: this.item.weightUnit,
      imageURL: this.item.imageURL,
      thumbnailURL: this.item.imageURL,
      mfgDate: this.item.mfgDate,
      orderType: this.item.orderType,
      isStudded: this.item.isStudded,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      isHallmarked:this.item.isHallmarked,
    };

    this.itemForm = this.createForm();
    if (this.item.availableQuantity === 0) {
      this.itemForm.disable();
      this.disabled = true;
    }
    this.itemWeight = this.item.itemWeight / this.item.totalQuantity;
    if (this.item.status === OtherReceiptsIssuesEnum.APVL_PENDING_STATUS) {
      this.itemForm.controls.isItemSelected.disable();
    }
  }

  createForm(): FormGroup {
    this.weight = this.item.availableQuantity * this.item.stdWeight;
    this.weightToDisplay = this.weightFormatter.format(this.weight);
    this.binCode = this.item.binCode;
    this.qty = this.item.availableQuantity;
    return new FormGroup({
      isItemSelected: new FormControl(false),
      issueQuantity: new FormControl(
        this.qty,
        Validators.compose([
          this.fieldValidatorsService.requiredField('Requested Qty'),
          this.fieldValidatorsService.quantityField('Requested Qty'),
          this.fieldValidatorsService.max(this.qty, 'Requested Qty'),
          this.fieldValidatorsService.min(1, 'Requested Qty')
        ])
      ),
      weight: new FormControl(this.weightToDisplay),
      binCode: new FormControl(this.binCode)
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
