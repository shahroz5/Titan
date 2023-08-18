import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { UcpMarketCode } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-ucp-market-code-list-items',
  templateUrl: './ucp-market-code-list-items.component.html'
})
export class UcpMarketCodeListItemsComponent implements OnInit, OnDestroy {
  @Input() ucpMarketCodeFactorList: UcpMarketCode[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions;

  @Output() id = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() viewDetails = new EventEmitter<any>();
  minPageSize;
  destroy$ = new Subject<null>();

  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  emitId(id) {
    this.id.emit(id);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  trackBy(index: number, item: any) {
    return item.marketCode;
  }
  viewDetailsFn(id) {
    this.viewDetails.emit(id);
  }
}
