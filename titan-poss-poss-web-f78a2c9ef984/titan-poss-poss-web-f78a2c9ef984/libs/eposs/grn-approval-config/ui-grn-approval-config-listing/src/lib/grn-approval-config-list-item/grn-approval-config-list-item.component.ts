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
  GrnApprovalConfig,
  GrnApprovalConfigResponse
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-grn-approval-config-list-item',
  templateUrl: './grn-approval-config-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrnApprovalConfigListItemComponent implements OnChanges {
  @Input() grnApprovalConfigListItem: GrnApprovalConfigResponse;
  @Input() permissions$: Observable<any[]>;

  @Output() ruleId = new EventEmitter<{ ruleId; ruleType; isActive }>();
  @Output() view = new EventEmitter<{ ruleId; ruleType; isActive }>();
  @Output() toggleValue = new EventEmitter<GrnApprovalConfig>();
  configTypeEnumRef = ConfigTypeEnum;
  isActive: any;
  ADD_EDIT_PERMISSION = 'grnConfigurations_GrnApprovalAccess_addEditPermission';
  VIEW_PERMISSION = 'grnConfigurations_GrnApprovalAccess_viewPermission';
  constructor(private elementPermission: ElementPermissionService) {}


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.grnApprovalConfigListItem.isActive;
  }
  edit(ruleId: string, ruleType: string, isActive: boolean) {
    this.ruleId.emit({ ruleId, ruleType, isActive });
  }

  viewMode(ruleId: string, ruleType: string, isActive: boolean) {
    this.view.emit({ ruleId, ruleType, isActive });
  }

  changeEvent(event) {
    this.isActive = event.checked;
    this.toggleValue.emit({
      ruleId: this.grnApprovalConfigListItem.ruleId,
      ruleType: this.grnApprovalConfigListItem.ruleType,
      isActive: event.checked,
      ruleDetails: {
        data: {
          config: this.grnApprovalConfigListItem.config
        },
        type: this.grnApprovalConfigListItem.ruleType
      }
    });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
