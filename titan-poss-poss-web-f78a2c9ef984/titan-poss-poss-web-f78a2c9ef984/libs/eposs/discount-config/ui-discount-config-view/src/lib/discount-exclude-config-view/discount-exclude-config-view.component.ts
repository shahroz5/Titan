import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {
  TableViewDialogConfig,
  TableViewDialogService
} from '@poss-web/shared/components/ui-table-view-dialog';
import {
  DiscountExcludeConfig,
  DiscountExcludeConfigTabEnum,
  DiscountExcludeItemCodes,
  DiscountExcludeThemeCode
} from '@poss-web/shared/models';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-exclude-config-view',
  templateUrl: './discount-exclude-config-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountExcludeConfigViewComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() excludeItemCodes: DiscountExcludeItemCodes[] = [];
  @Input() excludeThemeCodes: DiscountExcludeThemeCode[] = [];
  @Input() currencyCode: string;

  @Input() excludeItemCodesCount: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize = 0;

  @Input() excludeComplexity: DiscountExcludeConfig[] = [];
  @Input() excludeMC: DiscountExcludeConfig[] = [];
  @Output() excludeType = new EventEmitter<string>();
  @Output() loadItemCodes = new EventEmitter<{
    searchItemCode: string;
    pageEvent: PageEvent;
  }>();
  complexitySubject = new Subject();
  destroy$ = new Subject();
  searchItemCode: string;
  expanded = true;
  @ViewChild('itemCodeSearch', { static: true })
  itemCodeSearch: ElementRef;
  form = new FormGroup({
    itemCode: new FormControl()
  });
  type = null;
  constructor(
    private tableViewDialogService: TableViewDialogService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dialog.closeAll();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['excludeComplexity']) {
      if (
        this.excludeComplexity !== undefined &&
        this.excludeComplexity !== null &&
        this.type === DiscountExcludeConfigTabEnum.COMPLEXITY
      )
        this.openComplexityPopup();
    }
    if (changes['excludeMC']) {
      if (
        this.excludeMC.length !== undefined &&
        this.excludeMC.length !== null &&
        this.type === DiscountExcludeConfigTabEnum.PER_GRAM_MC
      )
        this.perGramPopup();
    }
    if (changes['excludeThemeCodes']) {
      if (
        this.excludeThemeCodes.length !== undefined &&
        this.excludeThemeCodes.length !== null &&
        this.type === DiscountExcludeConfigTabEnum.THEME_CODE
      ) {
        this.themeCodesPopup();
      }
    }
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }

  openComplexityPopup() {
    this.dialog.closeAll();
    const tableValues: any = [];
    this.excludeComplexity.forEach(item => {
      tableValues.push([item.fromValue, item.toValue, item.isActive]);
    });
    const config: TableViewDialogConfig = {
      title: 'Exclude Complexity %',
      placeholder: 'Placeholder',
      headerLabels: ['From(%)', 'To(%)', 'Is Active'],
      tableValues
    };
    console.log('111', tableValues);
    this.tableViewDialogService.open(config);
  }
  themeCodesPopup() {
    this.dialog.closeAll();
    const tableValues: any = [];
    this.excludeThemeCodes.forEach(item => {
      tableValues.push([item.themeCode, item.isActive]);
    });
    const config: TableViewDialogConfig = {
      title: 'THEME CODES',
      placeholder: 'Placeholder',
      headerLabels: ['Theme Code', 'Is Active'],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }
  perGramPopup() {
    this.dialog.closeAll();
    const tableValues: any = [];
    this.excludeMC.forEach(item => {
      tableValues.push([item.fromValue, item.toValue, item?.isActive]);
    });
    const config: TableViewDialogConfig = {
      title: 'Exclude making charges per gram',
      placeholder: 'Placeholder',
      headerLabels: ['From(%)', 'To(%)', 'Is Active'],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }
  ngAfterViewInit(): void {
    fromEvent(this.itemCodeSearch.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.form.value.itemCode;
        if (searchValue) {
          this.search(searchValue);
        } else this.clearExcludeItemCode();
      });
  }
  search(searchValue: string) {
    this.searchItemCode = searchValue;
    this.loadItemCodesFn();
  }
  clearExcludeItemCode() {
    this.form.get('itemCode').reset();
    this.searchItemCode = null;
    this.loadItemCodesFn();
  }

  perGram() {
    this.type = DiscountExcludeConfigTabEnum.PER_GRAM_MC;
    this.excludeType.emit(this.type);
  }
  themecodes() {
    this.type = DiscountExcludeConfigTabEnum.THEME_CODE;
    this.excludeType.emit(this.type);
  }
  complexity() {
    this.type = DiscountExcludeConfigTabEnum.COMPLEXITY;
    this.excludeType.emit(this.type);
  }

  paginatorFn(event) {
    this.pageEvent = event;
    this.loadItemCodesFn();
  }
  loadItemCodesFn() {
    this.loadItemCodes.emit({
      searchItemCode: this.searchItemCode,
      pageEvent: this.pageEvent
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
