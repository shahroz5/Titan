import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  ConfigTypeEnum,
  FtepApprovalConfigResponse,
  FtepApprovalConfig
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-ftep-approval-config-list-item',
  templateUrl: './ftep-approval-config-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FtepApprovalConfigListItemComponent implements OnChanges {
  @Input() ftepApprovalConfigListItem: FtepApprovalConfigResponse;

  @Output() ruleId = new EventEmitter<{ ruleId; ruleType; isActive }>();
  @Output() toggleValue = new EventEmitter<FtepApprovalConfig>();
  configTypeEnumRef = ConfigTypeEnum;
  isActive: any;
  @Output() openView = new EventEmitter<{ ruleId; ruleType; isActive }>();

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.ftepApprovalConfigListItem.isActive;
  }
  edit(ruleId: string, ruleType: string, isActive: boolean) {
    this.ruleId.emit({ ruleId, ruleType, isActive });
  }
  changeEvent(event) {
    this.isActive = event.checked;
    this.toggleValue.emit({
      ruleId: this.ftepApprovalConfigListItem.ruleId,
      ruleType: this.ftepApprovalConfigListItem.ruleType,
      isActive: event.checked,
      ruleDetails: {
        data: {
          config: this.ftepApprovalConfigListItem.config
        },
        type: this.ftepApprovalConfigListItem.ruleType
      }
    });
  }
  openViewPage(ruleId: string, ruleType: string, isActive: boolean) {
    this.openView.emit({ ruleId, ruleType, isActive });
  }
}
