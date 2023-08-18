import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  CashbackOffer,
  UpdateBankDetailsPayload
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-cashback-offer-config-list-items',
  templateUrl: './cashback-offer-config-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashbackOfferConfigListItemsComponent implements OnInit {
  @Input() cashBackOfferList: CashbackOffer[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  minPageSize: number;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<UpdateBankDetailsPayload>();
  @Output() viewMode = new EventEmitter<string>();

  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  edit(event) {
    this.configId.emit(event);
  }
  change(event) {
    this.toggleValue.emit(event);
  }
  openViewPage($event) {
    this.viewMode.emit($event);
  }
  trackBy(_: number, item: CashbackOffer) {
    return item.id;
  }
}
