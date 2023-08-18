import {
  Component,
  Output,
  Input,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { TaxMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tax-master-listing-item',
  templateUrl: './tax-master-listing-item.component.html'
})
export class TaxMasterListingItemComponent implements OnChanges {
  @Input() taxMasterListItem: TaxMasterDetails;
  @Output() taxMasterCode = new EventEmitter<any>();
  @Output() taxMasterCodeView = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  isActive: any;




  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.taxMasterListItem.isActive;
  }
  getTaxMasterCode(taxMasterCode: string) {
    this.taxMasterCode.emit(taxMasterCode);
  }
  getViewTaxMasterCode(taxMasterCode: string) {
    this.taxMasterCodeView.emit(taxMasterCode);
  }

  change(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      taxCode: this.taxMasterListItem.taxCode
    };
    this.emitToggle.emit(obj);
  }
}
