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
  CnPriorityConfig,
  CnPriorityConfigResponse,
  ConfigTypeEnum
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-cn-priority-config-item',
  templateUrl: './cn-priority-config-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnPriorityConfigItemComponent implements OnChanges {
  @Input() cnPriorityConfigListItem: CnPriorityConfigResponse;
  @Input() permissions$: Observable<any[]>;

  @Output() configId = new EventEmitter<{ configId; isActive }>();
  @Output() viewMode = new EventEmitter<{ configId; isActive }>();
  @Output() toggleValue = new EventEmitter<CnPriorityConfig>();
  isActive: any;

  ADD_EDIT_PERMISSION = 'CNConfigurations_CreditNotePriority_addEditPermission';
  VIEW_PERMISSION = 'CNConfigurations_CreditNotePriority_viewPermission';
  constructor(private elementPermission: ElementPermissionService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.cnPriorityConfigListItem.isActive;
  }
  edit(configId: string, isActive: boolean) {
    this.configId.emit({ configId, isActive });
  }

  view(configId: string, isActive: boolean) {
    this.viewMode.emit({ configId, isActive });
  }
  changeEvent(event) {
    this.isActive = event.checked;
    this.toggleValue.emit({
      configId: this.cnPriorityConfigListItem.configId,
      isActive: event.checked,
      ruleDetails: {
        data: {
          priorityDetails: this.cnPriorityConfigListItem.priorityDetails
        },
        type: ConfigTypeEnum.CN_PRIORITY_CONFIG
      }
    });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
