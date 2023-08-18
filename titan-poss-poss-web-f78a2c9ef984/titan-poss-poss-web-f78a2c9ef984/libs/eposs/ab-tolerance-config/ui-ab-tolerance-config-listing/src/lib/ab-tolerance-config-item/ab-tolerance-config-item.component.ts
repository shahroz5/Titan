import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { AbToleranceConfigResponse } from '@poss-web/shared/models';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-ab-tolerance-config-item',
  templateUrl: './ab-tolerance-config-item.component.html'
})
export class AbToleranceConfigItemComponent implements OnChanges {
  @Input() abTolerancConfigItem: any;

  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<AbToleranceConfigResponse>();
  isActive: boolean;
  @Output() viewPage = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.abTolerancConfigItem.isActive;
  }

  dateFormat(date) {
    return moment(date);
  }
  edit(configId: string) {
    this.configId.emit(configId);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    this.toggleValue.emit({
      ruleType: null,
      ruleId: this.abTolerancConfigItem.ruleId,
      isActive: event.checked,
      ruleDetails: {
        data: this.abTolerancConfigItem?.ruleDetails?.data,
        type: this.abTolerancConfigItem?.ruleType
      },
      createdDate: moment(this.abTolerancConfigItem.createdDate),
      lastModifiedDate: moment(this.abTolerancConfigItem.lastModifiedDate)
    });
  }
  openViewPage(ruleId) {
    this.viewPage.emit(ruleId);
  }
}
