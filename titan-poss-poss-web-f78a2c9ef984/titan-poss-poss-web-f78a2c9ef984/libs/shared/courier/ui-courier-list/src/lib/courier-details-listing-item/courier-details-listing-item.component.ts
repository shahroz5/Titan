import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CourierMaster } from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable } from 'rxjs';
@Component({
  selector: 'poss-web-courier-details-listing-item',
  templateUrl: './courier-details-listing-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourierDetailsListingItemComponent implements OnInit, OnChanges {
  active: boolean;
  @Input() courierDetailsList: CourierMaster;
  @Output() courierName = new EventEmitter<any>();
  @Output() isActive = new EventEmitter<{
    isActive: boolean;
    courierName: string;
  }>();
  @Input() permissions$: Observable<any[]>;

  @Output() viewPage = new EventEmitter<string>();
  VIEW_COURIER_PERMISSIONS = 'Courier Master - View Courier Master';
  ADD_EDIT_COURIER_PERMISSIONS = 'Courier Master - Add/Edit Courier Master';

  constructor(private elementPermission: ElementPermissionService) {}

  ngOnInit() {
    this.permissions$.subscribe(val => {
      console.log('val', val);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.active = this.courierDetailsList.isActive;
  }
  getCourierName(courierName: string) {
    this.courierName.emit(courierName);
  }
  openViewPage() {
    this.viewPage.emit(this.courierDetailsList.courierName);
  }
  changeEvent($event) {
    this.active = $event.checked;
    this.isActive.emit({
      isActive: $event.checked,
      courierName: this.courierDetailsList.courierName
    });
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
