import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { PayerBankMaster, SelectedBanks } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payer-bank-config-view',
  templateUrl: './payer-bank-config-view.component.html'
})
export class PayerBankConfigViewComponent
  implements  OnDestroy, OnChanges {
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

  constructor(private transalte: TranslateService) {
    this.transalte
      .get(['pw.payerBankConfiguration.bankNameLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.columnDefs = [
          {
            headerCheckboxSelection: false,
            checkboxSelection: false,
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
