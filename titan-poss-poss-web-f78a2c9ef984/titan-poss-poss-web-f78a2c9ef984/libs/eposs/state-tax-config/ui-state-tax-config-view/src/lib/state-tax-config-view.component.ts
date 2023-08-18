import { Component, Input } from '@angular/core';
import {
  StateTaxConfigurationStateDetails,
  TaxDetailsConfig
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-state-tax-config-view',
  templateUrl: './state-tax-config-view.component.html',
  styleUrls: ['./state-tax-config-view.component.scss']
})
export class StateTaxConfigViewComponent {

  @Input() stateTaxConfigurationStateDetails: StateTaxConfigurationStateDetails;
  @Input() stateTaxDetailsList$: Observable<TaxDetailsConfig[]>;
  @Input() taxComponentDetails$: Observable<string[]>;


  getTaxComponentValue(data: { [x: string]: number }, item: string) {
    return data ? (data[item] === undefined ? '' : data[item]) : '';
  }
}
