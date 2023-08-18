import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CNSearchEnum, PermissionData } from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-cn-search',
  templateUrl: './cn-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnSearchComponent {
  @Input() searchFormGroup: FormGroup;
  @Input() selectedLocationDetails = null;
  @Input() selectedDestiLocationDetails = null;
  @Input() currentFiscalYear: string;
  @Input() loadPermission$: Observable<any[]>;

  @Output() selectTransferMode = new EventEmitter();
  @Output() openSrcLocationPopup = new EventEmitter();
  @Output() openDestiLocationPopup = new EventEmitter();
  @Output() searchForm = new EventEmitter();

  LEGACY_OUTWARD_PERMISSION = 'CNTransfer_CNSearch_legacyOutwardPermission';
  INWARD_PERMISSION = 'CNTransfer_CNSearch_inwardPermission';
  cnSearchEnumRef = CNSearchEnum;
  constructor(private elementPermission: ElementPermissionService) {}

  onSelectTransferMode() {
    this.selectTransferMode.emit();
  }

  openLocationSelectionPopup() {
    this.openSrcLocationPopup.emit();
  }

  openDestiLocationSelectionPopup() {
    this.openDestiLocationPopup.emit();
  }

  search() {
    this.searchForm.emit();
  }

  loadPermission = (element: string): Observable<PermissionData> =>
    this.elementPermission.loadPermission(element, this.loadPermission$);
}
