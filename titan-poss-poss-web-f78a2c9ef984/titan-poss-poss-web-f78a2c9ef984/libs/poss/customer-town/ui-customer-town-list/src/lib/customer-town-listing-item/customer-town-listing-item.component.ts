import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CustomerTown } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-customer-town-listing-item',
  templateUrl: './customer-town-listing-item.component.html',
  styleUrls: ['./customer-town-listing-item.component.scss']
})
export class CustomerTownListingItemComponent implements OnChanges {
  @Input() customerTownItem: CustomerTown;
  @Output() customerCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<any>();
  isActive: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.customerTownItem.isActive;
  }
  onEdit(townCode: string) {
    this.customerCode.emit(townCode);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      customerListItem: this.customerTownItem
    };

    this.emitToggle.emit(obj);
  }
}
