import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { WeightValueConfigDetails } from '@poss-web/shared/models';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'poss-web-weight-value-config-listing-item',
  templateUrl: './weight-value-config-listing-item.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightValueConfigListingItemComponent
  implements OnChanges {
  @Input() weightValueConfigListItem: WeightValueConfigDetails;
  @Output() weightValueConfigRuleId = new EventEmitter<number>();
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    ruleId: number;
  }>();
  isActive: boolean;
  @Output() viewPage = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.weightValueConfigListItem.isActive;
  }



  getWeightValueConfigRuleId(id: number) {
    this.weightValueConfigRuleId.emit(id);
  }

  changeEvent(event: MatSlideToggleChange) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      ruleId: this.weightValueConfigListItem.ruleId
    };
    this.emitToggle.emit(obj);
  }
  openViewPage(ruleId) {
    this.viewPage.emit(ruleId);
  }
}
