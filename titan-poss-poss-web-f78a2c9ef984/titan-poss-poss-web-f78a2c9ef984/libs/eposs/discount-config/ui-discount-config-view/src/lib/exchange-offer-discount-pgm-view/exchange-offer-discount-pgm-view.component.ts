import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DiscountProductGroupTabEnum } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-exchange-offer-discount-pgm-view',
  templateUrl: './exchange-offer-discount-pgm-view.component.html'
})
export class ExchangeOfferDiscountPgmViewComponent
  implements OnInit, OnChanges {
  discountProductGroupTabRef = DiscountProductGroupTabEnum;

  filterForm = new FormGroup({
    searchValue: new FormControl(),
    type: new FormControl()
  });
  removeProductGroups = [];
  disableRemove = true;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  destroy$ = new Subject<null>();
  @Input() selectedDiscount;

  @Input() totalElements = 100;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 20,
    length: 20
  };
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() mappedProductGroups = [];
  @Input() productGroupTypes;
  @Input() selectedProductGroups;
  @Output() loadItems = new EventEmitter<any>();
  @Output() productGroupType = new EventEmitter<any>();
  selectedTab = DiscountProductGroupTabEnum.PRODUCT_GROUP_TEP;
  karatType = null;
  type: string;
  plainLabel: any;
  othersLabel: any;
  studedLabel: any;
  miaLabel: any;
  noneLabel: any;
  productTypeList: { value: string; description: any }[];
  OneKtProductGroups = [];
  TwoKtProductGroups = [];
  expanded = true;
  productGroups: any[];
  appliedFilter = false;
  constructor(private translate: TranslateService) {
    this.filterForm
      .get('type')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.type = data;
        this.pageEvent.pageIndex = 0;
        this.loadMappedProductGroups();
      });
    this.translate
      .get([
        'pw.prooductGroupMapping.plainLabel',
        'pw.prooductGroupMapping.othersLabel',
        'pw.prooductGroupMapping.studedLabel',
        'pw.prooductGroupMapping.miaLabel',
        'pw.prooductGroupMapping.noneLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.plainLabel =
          translatedMessages['pw.prooductGroupMapping.plainLabel'];
        this.othersLabel =
          translatedMessages['pw.prooductGroupMapping.othersLabel'];

        this.studedLabel =
          translatedMessages['pw.prooductGroupMapping.studedLabel'];

        this.miaLabel = translatedMessages['pw.prooductGroupMapping.miaLabel'];
        this.noneLabel =
          translatedMessages['pw.prooductGroupMapping.noneLabel'];
        this.productTypeList = [
          { value: null, description: this.noneLabel },
          { value: 'P', description: this.plainLabel },
          { value: 'M', description: this.miaLabel },
          { value: 'O', description: this.othersLabel },
          { value: 'S', description: this.studedLabel }
        ];
      });
  }

  ngOnInit() {
    this.mappedProductGroups?.forEach(data => {
      if (data.karatType === '1') {
        this.OneKtProductGroups.push({
          productGroupCode: data.productGroupCode,
          descriprion: data.description
        });
      } else if (data.karatType === '2') {
        this.TwoKtProductGroups.push({
          productGroupCode: data.productGroupCode,
          descriprion: data.description
        });
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['mappedProductGroups']) {
      this.productGroups = this.mappedProductGroups;
    }

  }
  changeTab(newTab) {
    this.selectedTab = newTab;
    if (
      this.selectedTab === this.discountProductGroupTabRef.PRODUCT_GROUP_1KT
    ) {
      this.karatType = '1';
      this.loadMappedProductGroups();
    } else if (
      this.selectedTab === this.discountProductGroupTabRef.PRODUCT_GROUP_2KT
    ) {
      this.karatType = '2';
      this.loadMappedProductGroups();
    } else {
      this.karatType = null;
      this.loadMappedProductGroups();
    }
  }
  loadMappedProductGroups() {
    this.loadItems.emit({
      type: this.type,
      karatType: this.karatType,
      searchValue: null,
      pageEvent: this.pageEvent
    });
  }
  getValue(val: string) {
    this.productGroupType.emit(val);
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
  }
  paginate(data) {
    this.pageEvent = data;
    this.loadMappedProductGroups();
  }
}
