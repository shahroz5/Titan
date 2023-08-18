import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  IbtConfigurationResponse,
  IbtConfiguration,
  ibtConfigEnums
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-ibt-configuration-item',
  templateUrl: './ibt-configuration-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IbtConfigurationItemComponent implements OnChanges {
  @Input() ibtConfigListItem: IbtConfigurationResponse;

  @Output() viewConfigId = new EventEmitter<string>();
  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<IbtConfiguration>();

  destroy$ = new Subject<any>();
  isActive: boolean;



  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.ibtConfigListItem.isActive;
  }
  view(configId: string) {
    this.viewConfigId.emit(configId);
  }
  edit(configId: string) {
    this.configId.emit(configId);
  }
  changeEvent(event) {
    this.isActive = event.checked;

    this.toggleValue.emit({
      configId: this.ibtConfigListItem.configId,
      isActive: event.checked,
      ruleDetails: {
        data: {
          maxProductsPerStn: this.ibtConfigListItem.maxProductsPerStn,
          maxReqPerMonth: this.ibtConfigListItem.maxReqPerMonth,
          maxValPerStn: this.ibtConfigListItem.maxValPerStn,
          validRequestTime: this.ibtConfigListItem.validRequestTime
        },
        type: ibtConfigEnums.IBT_CONFIGURATIONS
      }
    });
  }
}
