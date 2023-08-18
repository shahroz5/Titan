import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges
} from '@angular/core';

import { BgrConfigDetails } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-bgr-config-listing-item',
  templateUrl: './bgr-config-listing-item.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgrConfigListingItemComponent implements OnInit, OnChanges {
  @Input() bgrConfigListItem: BgrConfigDetails;
  @Output() bgrConfigRuleId = new EventEmitter<number>();
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    ruleId: number;
    ruleType: string;
  }>();
  @Output() viewPage = new EventEmitter<string>();
  @Input() permissions$: Observable<any[]>;

  ADD_EDIT_PERMISSION = 'Configurations_bestGoldRateConfig_addEditPermission';
  VIEW_PERMISSION = 'Configurations_bestGoldRateConfig_viewPermission';

  isActive = false;
  constructor(private elementPermission: ElementPermissionService) {}

  ngOnInit() {
    this.isActive = this.bgrConfigListItem.isActive;
  }

  ngOnChanges() {
    this.isActive = this.bgrConfigListItem.isActive;
  }

  getBgrConfigRuleId(id: number) {
    this.bgrConfigRuleId.emit(id);
  }
  openViewPage(ruelId) {
    this.viewPage.emit(ruelId);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      ruleId: this.bgrConfigListItem.ruleId,
      ruleType: this.bgrConfigListItem.ruleType
    };
    this.emitToggle.emit(obj);
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
