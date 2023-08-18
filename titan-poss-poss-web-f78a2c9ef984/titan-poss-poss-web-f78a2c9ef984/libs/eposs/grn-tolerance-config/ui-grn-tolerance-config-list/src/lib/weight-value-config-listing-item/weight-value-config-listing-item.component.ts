import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import { WeightValueConfigDetails } from '@poss-web/shared/models';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-weight-value-config-listing-item',
  templateUrl: './weight-value-config-listing-item.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightValueConfigListingItemComponent implements OnChanges {
  @Input() weightValueConfigListItem: WeightValueConfigDetails;
  @Output() weightValueConfigRuleId = new EventEmitter<number>();
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    ruleId: number;
  }>();
  isActive: any;
  @Output() viewPage = new EventEmitter<string>();

  @Input() permissions$: Observable<any[]>;
  ADD_EDIT_PERMISSION = 'Configurations_grnToleranceConfig_addEditPermission';
  VIEW_PERMISSION = 'Configurations_grnToleranceConfig_viewPermission';

  constructor(private elementPermission: ElementPermissionService) {}

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

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
