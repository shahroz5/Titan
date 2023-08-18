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
  PaymentConfiguration,
  UpdatePaymentConfigurationPayload
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-payment-configuration-item',
  templateUrl: './payment-configuration-item.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentConfigurationItemComponent implements OnChanges {
  @Input() paymentConfigurationListItem: PaymentConfiguration;

  @Output() configId = new EventEmitter<string>();
  @Output() toggleEvent = new EventEmitter<UpdatePaymentConfigurationPayload>();
  @Output() viewPage = new EventEmitter<string>();
  isActive: boolean;


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.paymentConfigurationListItem.isActive;
  }
  edit() {
    this.configId.emit(this.paymentConfigurationListItem.configId);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    this.toggleEvent.emit({
      configId: this.paymentConfigurationListItem.configId,
      data: { isActive: event.checked }
    });
  }
  openViewPage() {
    this.viewPage.emit(this.paymentConfigurationListItem.configId);
  }
}
