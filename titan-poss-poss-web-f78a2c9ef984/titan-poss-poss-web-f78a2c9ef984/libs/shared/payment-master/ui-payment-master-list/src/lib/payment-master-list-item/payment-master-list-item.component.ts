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
  PaymentMaster,
  UpdatePaymentMasterPayload
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-payment-master-list-item',
  templateUrl: './payment-master-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMasterListItemComponent implements OnChanges {
  @Input() paymentMasterItem: PaymentMaster;

  @Output() paymentCode = new EventEmitter<{
    paymentCode: string;
    isEditable: boolean;
  }>();
  @Output() emitToggleEvent = new EventEmitter<UpdatePaymentMasterPayload>();
  isActive: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.paymentMasterItem.isActive;
  }

  edit() {
    this.paymentCode.emit({
      paymentCode: this.paymentMasterItem.paymentCode,
      isEditable: true
    });
  }
  view() {
    this.paymentCode.emit({
      paymentCode: this.paymentMasterItem.paymentCode,
      isEditable: false
    });
  }
  changeEvent(event) {
    this.isActive = event.checked;
    this.emitToggleEvent.emit({
      paymentCode: this.paymentMasterItem.paymentCode.toUpperCase(),
      paymentGroup: this.paymentMasterItem.type,
      data: { isActive: event.checked }
    });
  }
}
