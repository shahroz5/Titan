import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy, Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {
  TableViewDialogConfig,
  TableViewDialogService
} from '@poss-web/shared/components/ui-table-view-dialog';
import { ExcludeItemCodes, ExcludeThemeCodes } from '@poss-web/shared/models';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-theme-itemcode-view',
  templateUrl: './theme-itemcode-view.component.html'
})
export class ThemeItemcodeViewComponent
  implements AfterViewInit, OnDestroy {
  @Input() excludeThemeCodes: ExcludeThemeCodes[];
  @Input() excludeItemCodes: ExcludeItemCodes[];
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() excludeItemCodesCount: number;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitItemCode = new EventEmitter<string>();
  @Output() clearGridSearch = new EventEmitter<boolean>();
  @Output() openLocationMapping = new EventEmitter<boolean>();
  @ViewChild('itemCodeSearch', { static: true })
  itemCodeSearch: ElementRef;
  itemSearchForm = new FormGroup({
    itemSearch: new FormControl()
  });

  destroy$ = new Subject<null>();
  constructor(
    private dialog: MatDialog,
    private tableViewDialogService: TableViewDialogService
  ) {}


  ngAfterViewInit(): void {
    fromEvent(this.itemCodeSearch.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.itemSearchForm.value.itemSearch;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue: string) {
    this.emitItemCode.emit(searchValue);
  }
  clearSearch() {
    this.itemSearchForm.reset();
    this.clearGridSearch.emit(true);
  }
  openViewLocationMapping() {
    this.openLocationMapping.emit(true);
  }
  themeCodesPopup() {
    this.dialog.closeAll();
    const tableValues: string[][] = [];
    this.excludeThemeCodes.forEach(item => {
      tableValues.push([item.themeCode]);
    });
    const config: TableViewDialogConfig = {
      title: 'THEME CODES',
      placeholder: 'Placeholder',
      headerLabels: ['Theme Code'],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
