import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-tax-master-items',
  templateUrl: './tax-master-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxMasterItemsComponent implements OnDestroy, OnChanges {
  @Input() taxMasterList; //: Observable<ProductCategoryDetails>;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() taxMasterCode = new EventEmitter<any>();
  @Output() taxMasterCodeView = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<any>();
  @Input() pageSize;

  destroy$ = new Subject<null>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;



  ngOnChanges(): void {
    this.pageSizeOptions = this.pageSize;

    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  emitTaxMasterCode(taxMasterCode) {
    this.taxMasterCode.emit(taxMasterCode);
  }
  emitTaxMasterCodeView(taxMasterCode) {
    this.taxMasterCodeView.emit(taxMasterCode);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
}
