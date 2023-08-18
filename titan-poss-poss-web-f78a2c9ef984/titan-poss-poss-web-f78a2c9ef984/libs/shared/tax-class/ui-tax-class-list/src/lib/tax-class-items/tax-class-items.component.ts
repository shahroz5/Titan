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
import { TaxClassDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tax-class-items',
  templateUrl: './tax-class-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxClassItemsComponent implements OnDestroy, OnChanges {
  @Input() taxClassList: TaxClassDetails[]; //: Observable<ProductCategoryDetails>;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() taxClassCode = new EventEmitter<any>();
  @Output() taxClassCodeView = new EventEmitter<any>();
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

  emitTaxClassCode(taxClassCode) {
    this.taxClassCode.emit(taxClassCode);
  }

  emitTaxClassCodeView(taxClassCode) {
    this.taxClassCodeView.emit(taxClassCode);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
}
