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
  PaymentMaster,
  UpdatePaymentMasterPayload
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-payment-master-list-items',
  templateUrl: './payment-master-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMasterListItemsComponent implements OnInit {
  @Input() paymentMasterList: PaymentMaster[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() paymentCode = new EventEmitter<{
    paymentCode: string;
    isEditable: boolean;
  }>();
  @Output() emitToggleEvent = new EventEmitter<UpdatePaymentMasterPayload>();
  minPageSize: number;


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  trackBy(index: number, item: PaymentMaster) {
    return item.paymentCode;
  }
  upadteisActive(event) {
    this.emitToggleEvent.emit(event);
  }
  edit(event) {
    this.paymentCode.emit(event);
  }
}
