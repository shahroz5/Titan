import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PaymentConfiguration, PaymentMaster } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-payment-configuration-items',
  templateUrl: './payment-configuration-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentConfigurationItemsComponent implements OnInit {
  @Input() paymentConfigurationList: PaymentConfiguration[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() configId = new EventEmitter<PageEvent>();
  @Output() emitToggleEvent = new EventEmitter<PageEvent>();
  @Output() viewPage = new EventEmitter<string>();

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
  updateIsActive(event) {
    this.emitToggleEvent.emit(event);
  }
  edit(id) {
    this.configId.emit(id);
  }
  viewMode($event) {
    this.viewPage.emit($event);
  }
}
