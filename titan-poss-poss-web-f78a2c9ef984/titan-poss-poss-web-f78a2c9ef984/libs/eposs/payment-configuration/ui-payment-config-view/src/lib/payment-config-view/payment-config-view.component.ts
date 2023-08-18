import {
  Component,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import {
  PaymentConfiguration,
  CheckBoxHeader
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-payment-config-view',
  templateUrl: './payment-config-view.component.html',
  styleUrls: ['./payment-config-view.component.scss']
})
export class PaymentConfigViewComponent
  implements OnDestroy, OnChanges {
  @Input() paymentConfiguration: PaymentConfiguration;
  @Input() rowHeaderTitle: string;
  @Input() columnHeaderTitle: string;
  @Input() columnHeaders: CheckBoxHeader[];
  @Input() rowHeaders: CheckBoxHeader[];
  @Input() selectedOptions;
  @Input() maxOptionsLimit;
  @Input() tcsPaymentModes;
  @Output() isOpenLocationPopup = new EventEmitter<boolean>();
  destroy$ = new Subject();
  expanded = true;
  selectAll = false;


  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.tcsPaymentModes.filter(ob => ob.checked).length ===
      this.tcsPaymentModes.length
    ) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }
  openViewLocationMapping() {
    this.isOpenLocationPopup.emit(true);
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
