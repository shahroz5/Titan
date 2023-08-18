import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  UpdateCoOrderPaymentConfigPayload,
  CoOrderPaymentConfigPayload
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-co-order-payments-listing-item',
  templateUrl: './co-order-payments-listing-item.component.html'
})
export class CoOrderPaymentsListingItemComponent implements OnChanges {
  @Input() configDetailsItem: CoOrderPaymentConfigPayload;

  @Output() loadSelectedWeightTolerance = new EventEmitter<string>();
  @Output() emittoggle = new EventEmitter<UpdateCoOrderPaymentConfigPayload>();
  isActive: boolean;
  @Output() viewPage = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.configDetailsItem.isActive;
  }
  editWeightTolerance() {
    this.loadSelectedWeightTolerance.emit(
      this.configDetailsItem.ruleId.toString()
    );
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      id: this.configDetailsItem.ruleId.toString(),
      data: { isActive: event.checked }
    };
    this.emittoggle.emit(obj);
  }
  openViewPage() {
    this.viewPage.emit(this.configDetailsItem.ruleId.toString());
  }
}
