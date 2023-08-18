import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  CashbackOffer,
  UpdateBankDetailsPayload
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cashback-offer-config-list-item',
  templateUrl: './cashback-offer-config-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashbackOfferConfigListItemComponent implements OnChanges {
  @Input() cashBackOfferListItem: CashbackOffer;

  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<UpdateBankDetailsPayload>();
  isActive: boolean;
  @Output() viewMode = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.cashBackOfferListItem.isActive;
  }
  edit(configId: string) {
    this.configId.emit(configId);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    this.toggleValue.emit({
      id: this.cashBackOfferListItem.id,
      data: {
        isActive: event.checked,
        bankName: this.cashBackOfferListItem.cardBankName
      }
    });
  }
  openViewPage(configId) {
    this.viewMode.emit(configId);
  }
}
