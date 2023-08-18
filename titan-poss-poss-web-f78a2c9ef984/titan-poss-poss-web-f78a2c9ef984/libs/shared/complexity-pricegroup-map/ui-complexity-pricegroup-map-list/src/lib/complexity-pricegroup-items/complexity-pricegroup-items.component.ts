import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ComplexityPriceGroupDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-complexity-pricegroup-items',
  templateUrl: './complexity-pricegroup-items.component.html'
})
export class ComplexityPricegroupItemsComponent implements OnDestroy {
  @Input() complexityPricegroupDetailsList: ComplexityPriceGroupDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() id = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggle = new EventEmitter<{
    data: { isActive: boolean };
  }>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions;
  @Input() minPageSize;

  emitId(id) {
    this.id.emit(id);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  trackBy(index: number, item: ComplexityPriceGroupDetails) {
    return item.complexityCode;
  }
  emitToggleValue(obj) {
    this.emitToggle.emit(obj);
  }
}
