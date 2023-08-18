import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CoToleranceConfigResponse } from '@poss-web/shared/models';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-co-tolerance-config-item',
  templateUrl: './co-tolerance-config-item.component.html'
})
export class CoToleranceConfigItemComponent implements OnChanges {
  @Input() coTolerancConfigItem: any;

  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<CoToleranceConfigResponse>();
  isActive: boolean;
  @Output() viewPage = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.coTolerancConfigItem.isActive;
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
      ruleId: this.coTolerancConfigItem.ruleId,
      isActive: event.checked,
      ruleDetails: {
        data: this.coTolerancConfigItem?.ruleDetails?.data,
        type: this.coTolerancConfigItem?.ruleType
      },
      createdDate: moment(this.coTolerancConfigItem.createdDate),
      lastModifiedDate: moment(this.coTolerancConfigItem.lastModifiedDate)
    });
  }
  openViewPage(ruleId) {
    this.viewPage.emit(ruleId);
  }
}
