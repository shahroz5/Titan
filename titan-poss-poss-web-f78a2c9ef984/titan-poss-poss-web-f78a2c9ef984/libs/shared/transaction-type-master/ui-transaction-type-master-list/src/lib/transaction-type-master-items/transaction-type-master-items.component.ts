import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges, ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { TransactionTypeMasterDetails } from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-transaction-type-master-items',
  templateUrl: './transaction-type-master-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionTypeMasterItemsComponent
  implements OnDestroy, OnChanges {
  @Input() listItems: TransactionTypeMasterDetails[]; //: Observable<ProductCategoryDetails>;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() code = new EventEmitter<string>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<string>();
  @Input() pageSize: number[];

  destroy$ = new Subject<null>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;



  ngOnChanges(): void {
    this.pageSizeOptions = this.pageSize;

    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  emitCode(code: string) {
    this.code.emit(code);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emitToggle(event: string) {
    this.emitToggleValue.emit(event);
  }
}
