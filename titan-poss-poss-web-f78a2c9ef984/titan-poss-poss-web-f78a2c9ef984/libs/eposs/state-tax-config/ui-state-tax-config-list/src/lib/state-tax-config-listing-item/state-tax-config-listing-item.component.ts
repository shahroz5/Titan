import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  StateTaxConfigurationListingData,
  StateTaxConfigurationStateDetails
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-state-tax-config-listing-item',
  templateUrl: './state-tax-config-listing-item.component.html'
})
export class StateTaxConfigListingItemComponent implements OnInit, OnChanges {
  @Input() stateTaxConfigurationListItem: StateTaxConfigurationListingData;
  @Output() stateTaxConfigIdView = new EventEmitter<string>();
  @Output() stateTaxConfigId = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<any>();
  checked: boolean;



  ngOnInit() {
    this.checked = this.stateTaxConfigurationListItem.isActive;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.checked = this.stateTaxConfigurationListItem.isActive;
  }

  getStateTaxConfigIdView(id: string) {
    this.stateTaxConfigIdView.emit(id);
  }

  getStateTaxConfigId(id: string) {
    this.stateTaxConfigId.emit(id);
  }

  change(event) {
    this.checked = event.checked;
    const obj: StateTaxConfigurationStateDetails = {
      isActive: event.checked,
      stateCode: this.stateTaxConfigurationListItem.stateCode,
      stateId: this.stateTaxConfigurationListItem.stateId,
      stateName: this.stateTaxConfigurationListItem.stateName,
      stateTaxCode: this.stateTaxConfigurationListItem.stateTaxCode,
      taxComponent: this.stateTaxConfigurationListItem.taxComponent,
      id: this.stateTaxConfigurationListItem.id
    };
    this.emitToggle.emit(obj);
  }
}
