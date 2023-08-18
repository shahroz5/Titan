import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { PayerBankDetails } from '@poss-web/shared/models';
import { FormControl, FormGroup } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-payer-banks',
  templateUrl: './payer-banks.component.html',
  styleUrls: ['./payer-banks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayerBanksComponent
  implements OnChanges, OnDestroy, AfterViewInit {
  @Input() bankDetails: PayerBankDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() loadBankDetails = new EventEmitter<string>();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  columnDefs = [];
  defaultColDef = {
    suppressMovable: true
  };
  invalidSearch = false;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(private translateService: TranslateService) {
    this.translateService
      .get([
        'pw.payerBankMaster.bankNameLabel',
        'pw.payerBankMaster.isActiveLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.columnDefs = [
          {
            headerName: translatedMsg['pw.payerBankMaster.bankNameLabel'],
            field: 'id',
            width: 820.5,
            resizable: true
          },
          {
            headerName: translatedMsg['pw.payerBankMaster.isActiveLabel'],
            field: 'isActive',
            resizable: true,
            suppressSizeToFit: true,
            cellRenderer: params => {
              if (params.value) {
                return 'Active';
              } else {
                return 'In-Active';
              }
            }
          }
        ];
      });
  }
  banksStatus: PayerBankDetails[] = [];
  addingBanks: string[] = [];
  removingBanks: string[] = [];
  api: GridApi;
  context = this;
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  animateRows = true;
  rowData = [];
  rowHeight = 50;
  destroy$ = new Subject();
  isActiveFormGroup: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bankDetails']) {
      this.rowData = [];
      this.bankDetails.forEach(bankDetails => {
        this.rowData.push({
          id: bankDetails.bankName,
          isActive: bankDetails.isActive
        });
      });
    }
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else this.clearSearch();
      });
  }
  search(searchValue) {
    this.emitSearchValue.emit(searchValue.toUpperCase());
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadBankDetails.emit();
  }


  callRowData() {
    this.rowData = [];
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }
  emitPagination($event) {
    this.searchForm.reset();
    this.paginator.emit($event);
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
