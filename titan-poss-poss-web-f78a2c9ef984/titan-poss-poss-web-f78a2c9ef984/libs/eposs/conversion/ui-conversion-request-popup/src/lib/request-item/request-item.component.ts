import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import {
  BinCode,
  ConversionItemDetailsEnum,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-request-item',
  styleUrls: ['./request-item.component.scss'],
  templateUrl: './request-item.component.html'
})
export class RequestItemComponent implements OnInit, OnDestroy {
  @Input() item: any;

  @Input() parentForm: FormArray;
  @Input() binCodes: BinCode[] = [];
  @Input() isSelectedItemHasChildItems = true;
  @Input() showCloseIcon = false;
  @Input() studded: boolean;

  @Output() removeChildItem: EventEmitter<any> = new EventEmitter<any>();

  itemForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  searchBinCodeLable: string;
  selectBinCodeLable: string;
  weightLabel: string;
  binCodeLabel: string;
  binsForSelection: SelectionDailogOption[] = [];
  selectedBinCode = '';
  soldOptionsArray: SelectDropDownOption[] = [
    {
      value: ConversionItemDetailsEnum.SOLD_Y,
      description: ConversionItemDetailsEnum.SOLD_Yes
    },
    {
      value: ConversionItemDetailsEnum.SOLD_N,
      description: ConversionItemDetailsEnum.SOLD_No
    }
  ];

  constructor(
    private selectionDialog: SelectionDialogService,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.stockReceive.searchBinCodeLable',
        'pw.stockReceive.selectBinCodeLable',
        'pw.conversion.itemWeightText',
        'pw.conversion.binCodeLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.searchBinCodeLable =
          translatedMessages['pw.stockReceive.searchBinCodeLable'];
        this.selectBinCodeLable =
          translatedMessages['pw.stockReceive.selectBinCodeLable'];
        this.weightLabel = translatedMessages['pw.conversion.itemWeightText'];
        this.binCodeLabel = translatedMessages['pw.conversion.binCodeLable'];
      });
  }

  ngOnInit() {
    this.binsForSelection = this.binCodes.map(bincode => ({
      id: bincode.binCode,
      description: bincode.binCode
    }));
    this.itemForm = this.createForm(this.item);
    this.parentForm.push(this.itemForm);
  }

  createForm(item: any): FormGroup {
    return new FormGroup({
      childItems: new FormControl(item.childItems),
      product: new FormControl(item.productCategoryDesc),
      inventoryId: new FormControl(item.inventoryId),
      itemCode: new FormControl(item.itemCode),
      lotNumber: new FormControl(item.lotNumber),
      netWeight: new FormControl(item.stdWeight ? item.stdWeight : '', [
        this.fieldValidatorsService.requiredField(this.weightLabel),
        this.fieldValidatorsService.weightField(this.weightLabel),
        this.fieldValidatorsService.min(0.001, this.weightLabel)
      ]),
      stonePrice: new FormControl(item.stoneValue),
      complexityCode: new FormControl(item.complexityCode),
      sold: new FormControl('N'),
      itemType: new FormControl('Child'),
      binCode: new FormControl('')
    });
  }
  removeItem() {
    this.removeChildItem.emit();
  }

  openBinSelectionPopup(event = null) {
    if (event) {
      event.stopPropagation();
    }
    this.selectionDialog
      .open({
        title: this.selectBinCodeLable,
        placeholder: this.searchBinCodeLable,
        options: this.binsForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          if (this.selectedBinCode !== selectedOption.id) {
            this.selectedBinCode = selectedOption.id;

            this.itemForm.patchValue({
              binCode: this.selectedBinCode
            });
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
