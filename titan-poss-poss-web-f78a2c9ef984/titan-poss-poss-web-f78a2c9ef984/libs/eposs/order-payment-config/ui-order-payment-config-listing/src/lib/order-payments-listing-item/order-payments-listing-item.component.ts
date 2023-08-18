import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  UpdateOrderPaymentConfigPayload,
  OrderPaymentConfigPayload
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-order-payments-listing-item',
  templateUrl: './order-payments-listing-item.component.html'
})
export class OrderPaymentsListingItemComponent implements OnChanges {
  @Input() configDetailsItem: OrderPaymentConfigPayload;
  @Input() permissions$: Observable<any[]>;

  @Output() loadSelectedWeightTolerance = new EventEmitter<string>();
  @Output() emittoggle = new EventEmitter<UpdateOrderPaymentConfigPayload>();
  isActive: boolean;
  @Output() viewPage = new EventEmitter<string>();
  ADD_EDIT_PERMISSION = 'ABConfigurations_OrderPaymentConfig_addEditPermission';
  VIEW_PERMISSION = 'ABConfigurations_OrderPaymentConfig_viewPermission';
  constructor(private elementPermission: ElementPermissionService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.configDetailsItem.isActive;
  }
  editWeightTolerance() {
    this.loadSelectedWeightTolerance.emit(
      this.configDetailsItem.ruleId.toString()
    );
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      id: this.configDetailsItem.ruleId.toString(),
      data: { isActive: event.checked }
    };
    this.emittoggle.emit(obj);
  }
  openViewPage() {
    this.viewPage.emit(this.configDetailsItem.ruleId.toString());
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
