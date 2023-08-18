import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MaterialPriceList } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-material-price-list-items',
  templateUrl: './material-price-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialPriceListItemsComponent implements OnDestroy {
  @Input() materialPrice: MaterialPriceList[];
  @Output() id = new EventEmitter<{ id: number; priceType: string }>();
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Output() paginator = new EventEmitter<PageEvent>();

  destroy$ = new Subject<null>();

  emitId(itemDetails) {
    this.id.emit(itemDetails);
  }
  trackBy(index: number, item: MaterialPriceList) {
    return item.id;
  }

  emitPagination($event) {
    this.paginator.emit($event);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
