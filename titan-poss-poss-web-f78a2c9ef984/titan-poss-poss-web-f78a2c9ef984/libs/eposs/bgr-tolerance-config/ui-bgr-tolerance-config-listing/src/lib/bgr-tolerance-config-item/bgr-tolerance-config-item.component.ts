import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { AbToleranceConfigResponse } from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-bgr-tolerance-config-item',
  templateUrl: './bgr-tolerance-config-item.component.html',
  styleUrls: []
})
export class BgrToleranceConfigItemComponent implements OnChanges {
  @Input() bgrTolerancConfigItem: any;

  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<AbToleranceConfigResponse>();
  @Output() viewPage = new EventEmitter<string>();
  isActive: boolean;
  @Input() permissions$: Observable<any[]>;
  ADD_EDIT_PERMISSION =
    'Configurations_bestGoldRateToleranceConfig_addEditPermission';
  VIEW_PERMISSION = 'Configurations_bestGoldRateToleranceConfig_viewPermission';

  constructor(private elementPermission: ElementPermissionService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.bgrTolerancConfigItem.isActive;
  }
  edit(configId: string) {
    this.configId.emit(configId);
  }
  changeEvent(event) {
    this.isActive = !this.isActive;
    this.toggleValue.emit({
      ruleType: this.bgrTolerancConfigItem.ruleType,
      ruleId: this.bgrTolerancConfigItem.ruleId,
      isActive: event.checked
      // ruleDetails: {
      //   data: this.bgrTolerancConfigItem.ruleDetails.data,
      //   type: 'BGR_TOLERANCE_CONFIG'
      // }
    });
  }
  openViewPage(ruleId) {
    this.viewPage.emit(ruleId);
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
