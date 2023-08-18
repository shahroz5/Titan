import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { LovMaster } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-lovmaster-listing-item',
  templateUrl: './lovmaster-listing-item.component.html',
  styleUrls: ['./lovmaster-listing-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LovmasterListingItemComponent implements OnChanges {
  @Input() lovMasterItem: LovMaster;
  @Output() lovMasterCodeView = new EventEmitter<LovMaster>();
  @Output() lovMasterCode = new EventEmitter<LovMaster>();
  @Output() lovMasterSwitch = new EventEmitter<LovMaster>();
  isActive: any;
  refunPay: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.lovMasterItem.isActive;
    this.refunPay = this.lovMasterItem.lovType !== "REFUND_PAYMENT_MODE" && this.lovMasterItem.lovType !== "PRICINGGROUPTYPE";
  }
  getLovCodeView() {
    this.lovMasterCodeView.emit(this.lovMasterItem);
  }
  getLovCode() {
    this.lovMasterCode.emit(this.lovMasterItem);
  }

  toggleChange($event: LovMaster) {
    this.isActive = !$event.isActive;
    const lovmaster = { ...$event, isActive: !$event.isActive };
    this.lovMasterSwitch.emit(lovmaster);
  }
}
