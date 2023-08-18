import {
  Component,
  OnChanges,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { ResidualWeightConfigResponse } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-redidual-weight-item',
  templateUrl: './redidual-weight-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedidualWeightItemComponent implements OnChanges {
  @Input() residualWeightItem: any;

  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<ResidualWeightConfigResponse>();
  @Output() viewPage = new EventEmitter<string>();
  isActive: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.residualWeightItem.isActive;
  }
  edit(configId: string) {
    this.configId.emit(configId);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    this.toggleValue.emit({
      ruleId: this.residualWeightItem.ruleId,
      isActive: event.checked,
      ruleDetails: {
        data: this.residualWeightItem?.ruleDetails?.data,
        type: 'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG'
      }
    });
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
}
