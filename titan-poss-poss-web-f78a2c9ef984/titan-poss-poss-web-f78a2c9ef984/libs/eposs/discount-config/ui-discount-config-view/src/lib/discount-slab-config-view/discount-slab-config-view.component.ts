import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import {
  TableViewDialogConfig,
  TableViewDialogService
} from '@poss-web/shared/components/ui-table-view-dialog';
import {
  AbCoData,
  DiscountBasedOnEnum,
  DiscountBasedOnTypesEnum,
  DiscountCompEnum,
  SlabConfig,
  SlabConfigItem
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbCoDiscountViewComponent } from './ab-co-discount-view/ab-co-discount-view.component';

@Component({
  selector: 'poss-web-discount-slab-config-view',
  templateUrl: './discount-slab-config-view.component.html'
})
export class DiscountSlabConfigViewComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() slabConfigsItems: SlabConfigItem[];

  @Input() currencyCode;

  @Input() slabConfig: SlabConfig;
  @Input() abCoData: AbCoData;

  @Input() isABOfferApplicable: boolean;
  @Input() isCOOfferApplicable: boolean;
  @Input() isPreviewApplicable: boolean;
  @Input() isRivaah: boolean;
  DiscountBasedOnTypesEnumRef = DiscountBasedOnTypesEnum;
  DiscountCompEnumRef = DiscountCompEnum;
  DiscountBasedOnEnumRef = DiscountBasedOnEnum;
  tabType = 'Regular';
  form: FormGroup;
  discountBasedOnOptions = [];
  weightBasedDesc: string;
  valueBasedDesc: string;
  caratBasedDesc: string;
  slabNameHeaderTxt: string;
  destroy$ = new Subject<null>();

  constructor(
    private translate: TranslateService,
    private currencySymbolService: CurrencySymbolService,
    private dialog: MatDialog,
    private tableViewDialogService: TableViewDialogService
  ) {
    this.translate
      .get([
        'pw.discountSlabConfig.weightBasedDesc',
        'pw.discountSlabConfig.valueBasedDesc',
        'pw.discountSlabConfig.caratBasedDesc',
        'pw.discountSlabConfig.slabNameHeaderTXt'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.weightBasedDesc =
          translatedMessages['pw.discountSlabConfig.weightBasedDesc'];
        this.valueBasedDesc =
          translatedMessages['pw.discountSlabConfig.valueBasedDesc'];
        this.caratBasedDesc =
          translatedMessages['pw.discountSlabConfig.caratBasedDesc'];
      });

    this.discountBasedOnOptions = [
      {
        description: this.weightBasedDesc,
        value: DiscountBasedOnEnum.WEIGHT_BASED
      },
      {
        description: this.caratBasedDesc,
        value: DiscountBasedOnEnum.CARAT_BASED
      },
      {
        description: this.valueBasedDesc,
        value: DiscountBasedOnEnum.VALUE_BASED
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isABOfferApplicable'] ||
      changes['isCOOfferApplicable'] ||
      changes['isPreviewApplicable'] ||
      changes['isRivaah']
    ) {
      this.tabType = 'Regular';
    }
    if (changes['slabConfigsItems']) {
      if (this.slabConfigsItems.length) this.form?.disable();
    }
  }

  ngOnInit(): void {
    console.log('component loading', this.slabConfigsItems);
    this.createForm();
  }
  changeTab(newTab) {
    this.tabType = newTab;
  }
  createForm() {
    this.form = new FormGroup({
      discountBasedOn: new FormControl(this.slabConfig?.discountBasedOn),
      discountBasedOnType: new FormControl(
        this.slabConfig?.discountBasedOnType
      ),
      valuePerWeightType: new FormControl(this.slabConfig?.valuePerWeightType),
      isSingle: new FormControl(this.slabConfig?.isSingle)
    });
  }
  valueSymbol(param, field) {
    const isPercent = param[this.getFieldFromTabType()][field].isPercent;
    if (isPercent) {
      return '%';
    } else {
      return this.currencySymbolService.get(this.currencyCode);
    }
  }
  getFieldFromTabType() {
    let field;
    if (this.tabType === 'Regular') {
      field = 'regular';
    } else if (this.tabType === 'Preview') {
      field = 'preview';
    }
    if (this.tabType === 'CO') {
      field = 'co';
    }
    if (this.tabType === 'AB') {
      field = 'ab';
    }
    if (this.tabType === 'RIVAAH') {
      field = 'riva';
    }
    return field;
  }
  openPreviewPopup() {
    this.tabType = 'Preview';
    this.dialog.closeAll();
    const tableValues: string[][] = [];
    this.slabConfigsItems.forEach(item => {
      tableValues.push([
        item.slabName,
        item.min.toString(),
        item.max.toString(),
        item.preview.goldCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'goldCharges'),
        item.preview.mcCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'mcCharges'),
        item.preview.stoneCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'stoneCharges'),
        item.preview.ucp.value.toString() + '' + this.valueSymbol(item, 'ucp'),
        item.preview.rsPerGram.value.toString() +
          '' +
          this.valueSymbol(item, 'rsPerGram')
      ]);
    });
    const config: TableViewDialogConfig = {
      title: 'PREVIEW',
      placeholder: 'Placeholder',
      headerLabels: [
        'Slab Name',
        'Min Wt.',
        'Max Wt',
        'Metal Charges',
        'Making Charges',
        'Stone Charges',
        'UCP',
        'Value per gms'
      ],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }
  openCoPopup() {
    this.tabType = 'CO';
    this.dialog.closeAll();
    const tableValues: string[][] = [];
    this.slabConfigsItems.forEach(item => {
      tableValues.push([
        item.slabName,
        item.min.toString(),
        item.max.toString(),
        item.co.goldCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'goldCharges'),
        item.co.mcCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'mcCharges'),
        item.co.stoneCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'stoneCharges'),
        item.co.ucp.value.toString() + '' + this.valueSymbol(item, 'ucp'),
        item.co.rsPerGram.value.toString() +
          '' +
          this.valueSymbol(item, 'rsPerGram')
      ]);
    });
    const config: TableViewDialogConfig = {
      title: 'CO',
      placeholder: 'Placeholder',
      headerLabels: [
        'Slab Name',
        'Min Wt.',
        'Max Wt',
        'Metal Charges',
        'Making Charges',
        'Stone Charges',
        'UCP',
        'Value per gms'
      ],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }
  openAbPopup() {
    this.tabType = 'AB';
    this.dialog.closeAll();
    const tableValues: string[][] = [];
    this.slabConfigsItems.forEach(item => {
      tableValues.push([
        item.slabName,
        item.min.toString(),
        item.max.toString(),
        item.ab.goldCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'goldCharges'),
        item.ab.mcCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'mcCharges'),
        item.ab.stoneCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'stoneCharges'),
        item.ab.ucp.value.toString() + '' + this.valueSymbol(item, 'ucp'),
        item.ab.rsPerGram.value.toString() +
          '' +
          this.valueSymbol(item, 'rsPerGram')
      ]);
    });
    const config: TableViewDialogConfig = {
      title: 'AB',
      placeholder: 'Placeholder',
      headerLabels: [
        'Slab Name',
        'Min Wt.',
        'Max Wt',
        'Metal Charges',
        'Making Charges',
        'Stone Charges',
        'UCP',
        'Value per gms'
      ],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }

  openRivaahPopup() {
    this.tabType = 'RIVAAH';
    this.dialog.closeAll();
    const tableValues: string[][] = [];
    this.slabConfigsItems.forEach(item => {
      tableValues.push([
        item.slabName,
        item.min.toString(),
        item.max.toString(),
        item.riva.goldCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'goldCharges'),
        item.riva.mcCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'mcCharges'),
        item.riva.stoneCharges.value.toString() +
          '' +
          this.valueSymbol(item, 'stoneCharges'),
        item.riva.ucp.value.toString() + '' + this.valueSymbol(item, 'ucp'),
        item.riva.rsPerGram.value.toString() +
          '' +
          this.valueSymbol(item, 'rsPerGram')
      ]);
    });
    const config: TableViewDialogConfig = {
      title: 'RIVAAH',
      placeholder: 'Placeholder',
      headerLabels: [
        'Slab Name',
        'Min Wt.',
        'Max Wt',
        'Metal Charges',
        'Making Charges',
        'Stone Charges',
        'UCP',
        'Value per gms'
      ],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }

  openABCOConfigPopup() {
    const abCoConfig = this.abCoData;
    this.dialog
      .open(AbCoDiscountViewComponent, {
        autoFocus: false,
        disableClose: true,
        width:
          this.isCOOfferApplicable && this.isABOfferApplicable
            ? '720px'
            : '360px',
        data: {
          isABOfferApplicable: this.isABOfferApplicable,
          isCOOfferApplicable: this.isCOOfferApplicable,
          isPreviewApplicable: this.isPreviewApplicable,
          config: abCoConfig
        }
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
