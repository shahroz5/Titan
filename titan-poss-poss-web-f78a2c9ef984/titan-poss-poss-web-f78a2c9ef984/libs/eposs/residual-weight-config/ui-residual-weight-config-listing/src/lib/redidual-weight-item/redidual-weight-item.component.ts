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
import { Observable } from 'rxjs';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-redidual-weight-item',
  templateUrl: './redidual-weight-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedidualWeightItemComponent implements OnChanges {
  @Input() residualWeightItem: any;
  @Input() permissions$: Observable<any[]>;

  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<ResidualWeightConfigResponse>();
  @Output() viewPage = new EventEmitter<string>();
  isActive: boolean;
  ADD_EDIT_PERMISSION =
    'ABConfigurations_residualWeightToleranceConfig_addEditPermission';
  VIEW_PERMISSION =
    'ABConfigurations_residualWeightToleranceConfig_viewPermission';
  constructor(private elementPermission: ElementPermissionService) {}

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
        type: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
      }
    });
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
