import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import {
  DiscountProductGroupTabEnum,
  DiscountProductGroupTypeEnum
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-rivaah-ashirwaad-pgm-view',
  templateUrl: './rivaah-ashirwaad-pgm-view.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RivaahAshirwaadPgmViewComponent implements OnChanges {
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
  @Output() loadData = new EventEmitter<any>();
  @Output() productGroupType = new EventEmitter<any>();
  filterForm = new FormGroup({
    searchValue: new FormControl(),
    type: new FormControl()
  });
  removeProductGroups = [];
  disableRemove = true;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  destroy$ = new Subject<null>();
  discountProductGroupTabEnum = DiscountProductGroupTabEnum;
  discountProductGroupTypeEnum = DiscountProductGroupTypeEnum;
  selectedTab = this.discountProductGroupTabEnum.PRODUCT_GROUP_UCP;
  type: string;
  plainLabel: any;
  othersLabel: any;
  studedLabel: any;
  miaLabel: any;
  noneLabel: any;
  productTypeList: { value: string; description: any }[];
  expanded = true;
  productGroups: any[];
  appliedFilter = false;
  productType = this.discountProductGroupTypeEnum.PRODUCT_GROUP_UCP;
  defaultPageEvent = {
    pageIndex: 0,
    pageSize: 20,
    length: 20
  };
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


  ngOnChanges(changes: SimpleChanges) {
    if (changes['mappedProductGroups']) {
      this.productGroups = this.mappedProductGroups;
    }
  }
  changeTab(newTab) {
    this.selectedTab = newTab;
    this.pageEvent = this.defaultPageEvent;
    this.appliedFilter = false;
    if (
      this.selectedTab === this.discountProductGroupTabEnum.PRODUCT_GROUP_UCP
    ) {
      this.productType = this.discountProductGroupTypeEnum.PRODUCT_GROUP_UCP;
      this.loadMappedProductGroups();
    } else if (
      this.selectedTab === this.discountProductGroupTabEnum.PRODUCT_GROUP_MC
    ) {
      this.productType = this.discountProductGroupTypeEnum.PRODUCT_GROUP_MC;
      this.loadMappedProductGroups();
    }
  }
  loadMappedProductGroups() {
    this.loadData.emit({
      type: this.type,
      productType: this.productType,
      searchValue: null,
      pageEvent: this.pageEvent
    });
  }
  getValue(val: string) {
    if (val) {
      this.appliedFilter = true;
    } else {
      this.appliedFilter = false;
    }
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
