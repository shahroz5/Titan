import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
@Component({
  selector: 'poss-web-item-master-search-form',
  templateUrl: './item-master-search-form.component.html'
})
export class ItemMasterSearchFormComponent implements OnInit, OnChanges {
  @Input() filterItemData;
  @Input() currencyCode;
  @Input() pricingTypes;
  @Output() formData = new EventEmitter<any>();
  @Output() clearFormData = new EventEmitter<any>();
  @Input() proguctGroupSelection: SelectionDailogOption[] = [];
  filterForm: FormGroup;
  destroy$ = new Subject<null>();

  selectedproguctGroup: SelectionDailogOption;
  standardPriceFromLabel: string;
  standardPriceToLabel: string;
  standardWeightFromLabel: string;
  standardWeightToLabel: string;
  stoneChargesFromLabel: string;
  stoneChargesToLabel: string;
  itemCodeLabel: string;
  filterLoaded: boolean;
  cfaProductCode: string;
  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private selectionDialog: SelectionDialogService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get(
        [
          'pw.itemMaster.itemPriceFrom',
          'pw.itemMaster.itemPriceTo',
          'pw.itemMaster.itemWeightFrom',
          'pw.itemMaster.itemWeightTo',
          'pw.itemMaster.itemStoneChargesFrom',
          'pw.itemMaster.itemStoneChargesTo',
          'pw.itemMaster.itemMasterCode',
          'pw.global.noDataFoundMessage'
        ],
        {
          entityName: 'Items'
        }
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.standardPriceFromLabel =
          translatedMessages['pw.itemMaster.itemPriceFrom'];
        this.standardPriceToLabel =
          translatedMessages['pw.itemMaster.itemPriceTo'];
        this.standardWeightFromLabel =
          translatedMessages['pw.itemMaster.itemWeightFrom'];
        this.standardWeightToLabel =
          translatedMessages['pw.itemMaster.itemWeightTo'];
        this.stoneChargesFromLabel =
          translatedMessages['pw.itemMaster.itemStoneChargesFrom'];
        this.stoneChargesToLabel =
          translatedMessages['pw.itemMaster.itemStoneChargesTo'];
        this.itemCodeLabel = translatedMessages['pw.itemMaster.itemMasterCode'];
      });
  }

  ngOnInit() {
    this.filterForm = new FormGroup({
      priceFrom: new FormControl(
        this.filterItemData?.fromStdValue
          ? this.filterItemData?.fromStdValue
          : null,
        [
          this.fieldValidatorsService.amountField(this.standardPriceFromLabel),
          this.fieldValidatorsService.minAmount(
            1,
            this.standardPriceFromLabel,
            this.currencyCode
          )
        ]
      ),
      priceTo: new FormControl(
        this.filterItemData?.toStdValue
          ? this.filterItemData?.toStdValue
          : null,
        [
          this.fieldValidatorsService.amountField(this.standardPriceToLabel),
          this.fieldValidatorsService.minAmount(
            1,
            this.standardPriceToLabel,
            this.currencyCode
          )
        ]
      ),
      stonePriceFrom: new FormControl(
        this.filterItemData?.fromStoneCharges
          ? this.filterItemData?.fromStoneCharges
          : null,
        [
          this.fieldValidatorsService.amountField(this.stoneChargesFromLabel),
          this.fieldValidatorsService.minAmount(
            1,
            this.stoneChargesFromLabel,
            this.currencyCode
          )
        ]
      ),
      stonePriceTo: new FormControl(
        this.filterItemData?.toStoneCharges
          ? this.filterItemData?.toStoneCharges
          : null,
        [
          this.fieldValidatorsService.amountField(this.stoneChargesToLabel),
          this.fieldValidatorsService.minAmount(
            1,
            this.stoneChargesToLabel,
            this.currencyCode
          )
        ]
      ),
      weightFrom: new FormControl(
        this.filterItemData?.fromStdWeight
          ? this.filterItemData?.fromStdWeight
          : null,
        this.fieldValidatorsService.weightField(this.standardWeightFromLabel)
      ),
      weightTo: new FormControl(
        this.filterItemData?.toStdWeight
          ? this.filterItemData?.toStdWeight
          : null,
        this.fieldValidatorsService.weightField(this.standardWeightToLabel)
      ),
      pricingType: new FormControl(
        this.filterItemData?.pricingType
          ? this.filterItemData?.pricingType
          : null
      ),
      cfaProductCode: new FormControl(
        this.filterItemData?.productGroupCode
          ? this.filterItemData?.productGroupCode
          : null
      ),
      itemCode: new FormControl(
        this.filterItemData?.itemCode ? this.filterItemData?.itemCode : null,
        this.fieldValidatorsService.itemCodeField(this.itemCodeLabel)
      )
    });
    this.setValidation();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterItemData']) this.filterItemData = this.filterItemData;
  }
  // componentOnInit() {

  // }

  setValidation() {
    const toPrice = this.filterForm.get('priceTo');
    this.filterForm.get('priceFrom').valueChanges.subscribe(startPrice => {
      this.filterForm.get('priceTo').markAsTouched();
      if (
        !(startPrice === '' || startPrice === null) &&
        this.filterForm.get('priceFrom').errors === null
      ) {
        toPrice.setValidators([
          this.fieldValidatorsService.requiredField(this.standardPriceToLabel),
          this.fieldValidatorsService.amountField(this.standardPriceToLabel),
          this.fieldValidatorsService.minAmount(
            startPrice,
            this.standardPriceToLabel,
            this.currencyCode
          )
        ]);
      } else {
        toPrice.setValidators([
          this.fieldValidatorsService.amountField(this.standardPriceToLabel),
          this.fieldValidatorsService.minAmount(
            startPrice,
            this.standardPriceToLabel,
            this.currencyCode
          )
        ]);
      }
      toPrice.updateValueAndValidity();
    });
    const toStonePrice = this.filterForm.get('stonePriceTo');
    this.filterForm.get('stonePriceFrom').valueChanges.subscribe(startPrice => {
      this.filterForm.get('stonePriceTo').markAsTouched();
      if (
        !(startPrice === '' || startPrice === null) &&
        this.filterForm.get('stonePriceFrom').errors === null
      ) {
        toStonePrice.setValidators([
          this.fieldValidatorsService.requiredField(this.stoneChargesToLabel),
          this.fieldValidatorsService.amountField(this.stoneChargesToLabel),
          this.fieldValidatorsService.minAmount(
            startPrice,
            this.stoneChargesToLabel,
            this.currencyCode
          )
        ]);
      } else {
        toStonePrice.setValidators([
          this.fieldValidatorsService.amountField(this.stoneChargesToLabel),
          this.fieldValidatorsService.minAmount(
            startPrice,
            this.stoneChargesToLabel,
            this.currencyCode
          )
        ]);
      }
      toStonePrice.updateValueAndValidity();
    });
    const toWeight = this.filterForm.get('weightTo');
    this.filterForm.get('weightFrom').valueChanges.subscribe(startWeight => {
      this.filterForm.get('weightTo').markAsTouched();
      if (
        !(startWeight === '' || startWeight === null) &&
        this.filterForm.get('weightFrom').errors === null
      ) {
        toWeight.setValidators([
          this.fieldValidatorsService.requiredField(this.standardWeightToLabel),
          this.fieldValidatorsService.weightField(this.standardWeightToLabel),
          this.fieldValidatorsService.min(
            startWeight,
            this.standardWeightToLabel
          )
        ]);
      } else {
        toWeight.setValidators([
          this.fieldValidatorsService.weightField(this.standardWeightToLabel),
          this.fieldValidatorsService.min(
            startWeight,
            this.standardWeightToLabel
          )
        ]);
      }
      toWeight.updateValueAndValidity();
    });
  }
  openProductGroupSelectionPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: 'Select Product Group',
        placeholder: 'Select Product Group',
        options: this.proguctGroupSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedproguctGroup = selectedOption;
          this.cfaProductCode = this.selectedproguctGroup.id;
        }
      });
  }

  clearProductGroup() {
    this.cfaProductCode = null;
  }
  applyFilter() {
    const values = this.filterForm.getRawValue();
    const filterPayload = {
      itemCode: values.itemCode ? values.itemCode : null,
      productCategoryCode: null,
      fromStdValue: values.priceFrom ? values.priceFrom : null,
      fromStdWeight: values.weightFrom ? values.weightFrom : null,
      fromStoneCharges: values.stonePriceFrom ? values.stonePriceFrom : null,
      pricingType: values.pricingType ? values.pricingType : null,
      productGroupCode: this.cfaProductCode ? this.cfaProductCode : null,
      toStdValue: values.priceTo ? values.priceTo : null,
      toStdWeight: values.weightTo ? values.weightTo : null,
      toStoneCharges: values.stonePriceTo ? values.stonePriceTo : null
    };

    this.filterItemData = filterPayload;
    this.formData.emit(filterPayload);
  }
  clear() {
    this.filterForm.patchValue({
      priceFrom: null,
      priceTo: null,
      stonePriceFrom: null,
      stonePriceTo: null,
      weightFrom: null,
      weightTo: null,
      pricingType: null,
      cfaProductCode: null,
      itemCode: null
    });
    this.cfaProductCode = null;
    this.clearFormData.emit(true);
  }
}
