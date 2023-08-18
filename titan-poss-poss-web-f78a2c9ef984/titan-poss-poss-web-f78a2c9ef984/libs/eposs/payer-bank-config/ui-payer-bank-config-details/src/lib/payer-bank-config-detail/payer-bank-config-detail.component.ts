import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import { PayerBankMaster, SelectedBanks } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-payer-bank-config-detail',
  templateUrl: './payer-bank-config-detail.component.html',
  styleUrls: ['./payer-bank-config-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayerBankConfigDetailComponent
  implements OnDestroy, OnChanges, AfterViewInit {
  @Input() banksList: PayerBankMaster[];
  @Input() selectedBanks: SelectedBanks[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Output() addedBank = new EventEmitter<string>();
  @Output() removedBank = new EventEmitter<{ bankName: string; id: string }>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() selectionChange = new EventEmitter<boolean>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() loadDetails = new EventEmitter();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  addedBanks: string[] = [];
  animateRows = true;
  rowHeight = 50;
  destroy$ = new Subject();
  api: GridApi;
  domLayout = 'autoHeight';
  rowSelection = 'multiple';
  defaultColDef = {
    suppressMovable: true
  };
  columnDefs = [];
  invalidSearch = false;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(private transalte: TranslateService) {
    this.transalte
      .get(['pw.payerBankConfiguration.bankNameLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 40,
            pinned: 'left',
            lockPinned: true,
            cellRenderer: params => {
              this.addedBanks.forEach(bankName => {
                if (bankName === params.data.bankName) {
                  params.node.setSelected(true);
                } else return false;
              });
            }
          },
          {
            headerName:
              translatedMsg['pw.payerBankConfiguration.bankNameLabel'],
            field: 'bankName',
            width: 980.5
          }
        ];
      });
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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['banksList'] ||
      changes['selectedBanks'] ||
      changes['columnHeaders'] ||
      changes['banks']
    ) {
      if (this.selectedBanks.length > 0) {
        this.api.forEachNode(node => {
          this.selectedBanks.forEach(banks => {
            if (node.data.bankName === banks.bankName) {
              node.setSelected(true);
            }
          });
        });
      }
    }
  }

  search(searchValue) {
    if (
      fieldValidation.alphaNumericField.pattern.test(searchValue) ||
      fieldValidation.nameWithSpaceField.pattern.test(searchValue)
    ) {
      this.emitSearchValue.emit(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = false;
      this.api.setRowData([]);
    }
  }

  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadDetails.emit();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  onRowSelected($event) {
    if ($event.node.selected) {
      this.addedBank.emit($event.node.data.bankName);
      this.addedBanks.push($event.node.data.bankName);
    } else {
      this.addedBanks = this.addedBanks.filter(
        bankName => bankName !== $event.node.data.bankName
      );
      this.removedBank.emit({
        bankName: $event.node.data.bankName,
        id: null
      });
      this.selectedBanks.forEach(banks => {
        if (banks.bankName === $event.node.data.bankName) {
          this.removedBank.emit({
            bankName: banks.bankName,
            id: banks.id
          });
        }
      });
    }
  }
  onSelectionChanged($event) {
    this.selectionChange.emit(true);
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
