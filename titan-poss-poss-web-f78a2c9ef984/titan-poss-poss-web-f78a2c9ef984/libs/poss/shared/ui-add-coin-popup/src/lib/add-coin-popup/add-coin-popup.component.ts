import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import {
  CashMemoTaxDetails,
  CoinDetails,
  MetalPrice,
  ProductDetailsInGrid,
  ProductPriceDetails,
  ProductTypesEnum
} from '@poss-web/shared/models';
import { Observable, Subject, combineLatest } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CommonBaseComponent } from '@poss-web/shared/util-common';
import { POSS_WEB_TIME_TRACKING_LOG } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-add-coin-popup',
  templateUrl: './add-coin-popup.component.html',
  styleUrls: ['./add-coin-popup.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCoinPopupComponent
  extends CommonBaseComponent
  implements OnInit, OnDestroy {
  karatageArray = [];
  weightArray = [];
  themeArray = [];
  karatageGroup: {};
  weightGroup: {};
  themeGroup: {};
  selectedKaratageData = null;
  selectedThemeData = null;
  selectedWeightData = null;
  coinDetails: CoinDetails[];
  itemCodeArray: CoinDetails[];
  itemCodeOptions = [];
  coinForm: FormGroup = new FormGroup({});
  onAdd = new EventEmitter();
  onUpdate = new EventEmitter();
  onReset = new EventEmitter();
  onLoadCoinDetails = new EventEmitter();
  @Input() priceDetails: Observable<ProductPriceDetails>;
  @Input() taxDetails: Observable<CashMemoTaxDetails>;
  @Input() metalPrice: Observable<MetalPrice[]>;
  @Input() currencyCode: string;
  @Input() validCoinDetails$: Observable<{
    itemCode: string;
    coinDetails: CoinDetails[];
  }>;
  selectedCoinItems = [];
  selectedItem: any;
  selectedQuantity = 0;
  item$: Subject<ProductDetailsInGrid> = new Subject<ProductDetailsInGrid>();
  tax$: Subject<{
    itemCode: string;
    taxDetails: CashMemoTaxDetails;
  }> = new Subject<{ itemCode: string; taxDetails: CashMemoTaxDetails }>();
  destroy$: Subject<null> = new Subject<null>();
  isFormValid: boolean;
  isAddEnable: boolean;
  isUpdate: boolean;
  weightCode = 'gms';
  ktLabel: string;
  weightLabel: string;

  constructor(
    public dialogRef: MatDialogRef<AddCoinPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private translate: TranslateService,
    private weightFormatterService: WeightFormatterService,
    @Inject(POSS_WEB_TIME_TRACKING_LOG) public timeTrackingLog: boolean
  ) {
    super(timeTrackingLog);
    this.translate
      .get(['pw.coinPopup.ktLabel', 'pw.coinPopup.weightPlaceHolder'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.ktLabel = translatedMessages['pw.coinPopup.ktLabel'];
        this.weightLabel =
          translatedMessages['pw.coinPopup.weightPlaceHolder'] +
          `(${this.weightCode})`;
      });
    this.coinDetails = data.coinDetails;
    this.karatageGroup = data.coinDetails.reduce((data1, data2) => {
      data1[data2.karatage] = [...(data1[data2.karatage] || []), data2];
      return data1;
    }, {});
    this.karatageArray = [];
    Object.keys(this.karatageGroup).forEach(element => {
      this.karatageArray.push({
        value: Number(element),
        description: Number(element) + this.ktLabel
      });
    });
    this.coinForm = this.createForm();
  }

  ngOnInit(): void {
    combineLatest([
      this.priceDetails.pipe(takeUntil(this.destroy$)),
      this.taxDetails.pipe(takeUntil(this.destroy$))
    ]).subscribe(([priceDetails, taxDetails]) => {
      if (this.selectedItem !== null && priceDetails && taxDetails) {
        if (this.isUpdate === true) {
          this.isUpdate = false;
          this.item$.next({
            itemCode: this.selectedItem?.itemCode,
            binCode: null,
            description: this.selectedItem?.itemDescription,
            selectedLotNumber: this.selectedItem?.totalQuantity,
            availableLotNumbers: [],
            unitWeight: this.selectedItem?.unitWeight,
            actualWeight:
              this.selectedItem?.unitWeight * this.selectedItem?.quantity,
            selectedRso: null,
            availableRso: [],
            pricePerUnit: priceDetails.finalValue / this.selectedItem?.quantity,
            discount: 0,
            finalPrice: priceDetails.finalValue,
            priceBreakUp: null,
            productDetails: this.selectedItem,
            inventoryId: null,
            itemId: null,
            productType: ProductTypesEnum.COINS,
            isAdd: false,
            remarks: null,
            priceDetails: priceDetails.priceDetails,
            quantity: this.selectedItem?.quantity,
            taxDetails: this.selectedItem?.taxDetails,
            karatage: this.selectedItem?.karatage,
            stdWeight: this.selectedItem?.stdWeight,
            productCatergory: this.selectedItem?.productCategoryCode,
            productGroup: this.selectedItem?.productGroupCode,
            status: null,
            totalQuantity: this.selectedItem?.totalQuantity,
            subTxnType: null,
            selectedReason: null,
            availableReasons: [],
            rowId: this.selectedItem?.rowId
          });
          this.addStopTracking('pw.instrumentationMessges.editQtyForCoinMsg');
        } else {
          this.item$.next({
            itemCode: this.selectedItem?.itemCode,
            binCode: null,
            description: this.selectedItem?.itemDescription,
            selectedLotNumber: this.selectedItem?.totalQuantity,
            availableLotNumbers: [],
            unitWeight: this.selectedItem?.unitWeight,
            actualWeight: this.selectedItem?.unitWeight,
            selectedRso: null,
            availableRso: [],
            pricePerUnit: priceDetails.finalValue,
            discount: 0,
            finalPrice: priceDetails.finalValue,
            priceBreakUp: null,
            productDetails: this.selectedItem,
            inventoryId: null,
            itemId: null,
            productType: ProductTypesEnum.COINS,
            isAdd: true,
            remarks: null,
            priceDetails: priceDetails.priceDetails,
            quantity: this.selectedItem?.totalQuantity,
            taxDetails: taxDetails,
            karatage: this.selectedItem?.karatage,
            stdWeight: this.selectedItem?.stdWeight,
            productCatergory: this.selectedItem?.productCategoryCode,
            productGroup: this.selectedItem?.productGroupCode,
            status: null,
            totalQuantity: this.selectedItem?.totalQuantity,
            subTxnType: null,
            selectedReason: null,
            availableReasons: [],
            rowId: this.selectedItem?.rowId
          });
        }
        this.isAddEnable = false;
        this.addStopTracking('pw.instrumentationMessges.addingCoinMsg');
      }
    });

    this.validCoinDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe(validCoinDetails => {
        if (validCoinDetails?.coinDetails?.length !== 0) {
          this.selectedQuantity =
            validCoinDetails?.coinDetails[0]?.totalQuantity;
          this.selectedItem = {
            ...this.selectedItem,
            totalQuantity: validCoinDetails?.coinDetails[0]?.totalQuantity
          };
        }
      });
  }

  onKaratageChange(data) {
    this.addStartTracking('pw.instrumentationMessges.combinationCoinMsg');
    this.selectedKaratageData = data.value;
    // field resetting
    this.selectedWeightData = null;
    this.selectedThemeData = null;
    this.themeArray = [];
    this.weightArray = [];
    this.itemCodeArray = [];
    this.itemCodeOptions = [];
    this.coinForm.get('weight').reset();
    this.coinForm.get('theme').reset();
    this.coinForm.get('itemCode').reset();
    this.selectedQuantity = 0;
    // Data Filtering
    this.weightGroup = this.karatageGroup[data.value].reduce((data1, data2) => {
      data1[data2.unitWeight] = [...(data1[data2.unitWeight] || []), data2];
      return data1;
    }, {});
    // this.weightArray = [];
    Object.keys(this.weightGroup).forEach(element => {
      this.weightArray.push({
        value: Number(element),
        description: this.weightFormatterService.format(Number(element))
      });
    });
    // this.themeGroup = this.karatageGroup[data.value].reduce((data1, data2) => {
    //   data1[data2.itemDescription] = [
    //     ...(data1[data2.itemDescription] || []),
    //     data2
    //   ];
    //   return data1;
    // }, {});
    // this.themeArray = [];
    // Object.keys(this.themeGroup).forEach(element => {
    //   this.themeArray.push({
    //     value: element,
    //     description: element
    //   });
    // });
  }

  onWeightChange(data) {
    this.selectedWeightData = data.value;
    // field resetting
    this.selectedThemeData = null;
    this.themeArray = [];
    this.itemCodeArray = [];
    this.itemCodeOptions = [];
    this.coinForm.get('theme').reset();
    this.coinForm.get('itemCode').reset();
    console.log('coin form', this.coinForm);
    this.selectedQuantity = 0;
    // if (this.selectedKaratageData !== null && this.selectedThemeData !== null) {
    //   this.itemCodeArray = this.coinDetails.filter(e => {
    //     return (
    //       e.karatage === this.selectedKaratageData &&
    //       e.unitWeight === this.selectedWeightData &&
    //       e.itemDescription === this.selectedThemeData
    //     );
    //   });
    //   this.itemCodeOptions = [];
    //   this.itemCodeArray.forEach(element => {
    //     this.itemCodeOptions.push({
    //       value: element,
    //       description: element.itemCode
    //     });
    //   });
    // } else {
    // this.selectedThemeData = null;
    // this.themeArray = [];
    // Data Filtering
    this.themeGroup = this.weightGroup[data.value].reduce((data1, data2) => {
      data1[data2.itemDescription] = [
        ...(data1[data2.itemDescription] || []),
        data2
      ];
      return data1;
    }, {});
    Object.keys(this.themeGroup).forEach(element => {
      this.themeArray.push({
        value: element,
        description: element
      });
    });
    // }
  }

  onThemeChange(data) {
    this.selectedThemeData = data.value;
    // field resetting
    this.itemCodeArray = [];
    this.itemCodeOptions = [];
    this.coinForm.get('itemCode').reset();
    this.selectedQuantity = 0;
    //  Data Filtering
    if (
      this.selectedKaratageData !== null &&
      this.selectedWeightData !== null
    ) {
      this.itemCodeArray = this.coinDetails.filter(e => {
        return (
          e.karatage === this.selectedKaratageData &&
          e.unitWeight === this.selectedWeightData &&
          e.itemDescription === this.selectedThemeData
        );
      });
      // this.itemCodeOptions = [];
      this.itemCodeArray.forEach(element => {
        this.itemCodeOptions.push({
          value: element,
          description: element.itemCode
        });
      });
    }
    // else {
    //   this.selectedWeightData = null;
    //   this.weightGroup = this.themeGroup[data.value].reduce((data1, data2) => {
    //     data1[data2.unitWeight] = [...(data1[data2.unitWeight] || []), data2];
    //     return data1;
    //   }, {});
    //   this.weightArray = [];
    //   Object.keys(this.weightGroup).forEach(element => {
    //     this.weightArray.push({
    //       value: Number(element),
    //       description: this.weightFormatterService.format(Number(element))
    //     });
    //   });
    // }
  }

  onItemCodeChange(data) {
    this.selectedItem = data.value;
    this.onLoadCoinDetails.emit(this.selectedItem.itemCode);
    this.isAddEnable = true;
    this.addStopTracking('pw.instrumentationMessges.combinationCoinMsg');
  }

  closePopup(): void {
    this.dialogRef.close(null);
  }

  createForm() {
    return new FormGroup({
      karatage: new FormControl(),
      weight: new FormControl(),
      theme: new FormControl(),
      itemCode: new FormControl()
    });
  }

  onAddButtonClick() {
    this.addStartTracking('pw.instrumentationMessges.addingCoinMsg');
    this.onAdd.emit(this.selectedItem);
  }

  addToOrder(): void {
    this.dialogRef.close(this.selectedCoinItems);
  }

  resetData() {
    this.coinForm.reset();
    this.weightArray = [];
    this.themeArray = [];
    this.itemCodeArray = [];
    this.selectedQuantity = 0;
    this.onReset.emit();
  }

  formDataChange(event) {
    this.isFormValid = event.form.valid;
    if (event.form.valid) this.selectedCoinItems = event.formData.items;
  }

  quantityChange(event) {
    this.addStartTracking('pw.instrumentationMessges.editQtyForCoinMsg');
    this.selectedItem = event.value;
    this.isUpdate = true;
    this.onUpdate.emit(event.value);
  }

  // Instrmentation
  addStartTracking(actionName) {
    this.translate
      .get(actionName)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.startTracking(translatedMsg);
      });
  }

  addStopTracking(actionName) {
    this.translate
      .get(actionName)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.stopTracking(translatedMsg);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resetData();
  }
}
