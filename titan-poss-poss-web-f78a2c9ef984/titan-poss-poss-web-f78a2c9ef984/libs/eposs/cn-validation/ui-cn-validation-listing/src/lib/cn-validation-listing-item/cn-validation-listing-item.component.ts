import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CnValidation, CnValidationResponse } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-cn-validation-listing-item',
  templateUrl: './cn-validation-listing-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnValidationListingItemComponent implements OnChanges {
  @Input() cnValidationListItem: CnValidationResponse;
  @Input() permissions$: Observable<any[]>;
  @Output() ruleId = new EventEmitter<{ ruleId; ruleType; isActive }>();
  @Output() view = new EventEmitter<{ ruleId; ruleType; isActive }>();
  @Output() toggleValue = new EventEmitter<CnValidation>();

  isActive: any;

  ADD_EDIT_PERMISSION =
    'CNConfigurations_CreditNoteValidation_addEditPermission';
  VIEW_PERMISSION = 'CNConfigurations_CreditNoteValidation_viewPermission';
  constructor(private elementPermission: ElementPermissionService) {}


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.cnValidationListItem.isActive;
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
      ruleId: this.cnValidationListItem.ruleId,
      ruleType: this.cnValidationListItem.ruleType,
      isActive: event.checked,
      ruleDetails: {
        data: {
          isCancellationAllowed: this.cnValidationListItem
            .isCancellationAllowed,
          deductionRate: this.cnValidationListItem.deductionRate,
          criteriaRateForDeduction: this.cnValidationListItem
            .criteriaRateForDeduction,
          residentialValueAmount: this.cnValidationListItem
            .residentialValueAmount,
          isBrandWiseTransferAllowed: this.cnValidationListItem
            .isBrandWiseTransferAllowed,
          isBoutiqueWiseTransferAllowed: this.cnValidationListItem
            .isBoutiqueWiseTransferAllowed,
          gHSUtilizationTransferPercent: this.cnValidationListItem
            .GHSUtilizationTransferPercent,
          gHSMaxAmountTransfer: this.cnValidationListItem.GHSMaxAmountTransfer,
          isMergingGRFCNAllowed: this.cnValidationListItem
            .isMergingGRFCNAllowed,
          gRFResidualValueAmount: this.cnValidationListItem
            .gRFResidualValueAmount,
          isPercent: this.cnValidationListItem.isPercent,
          gRFResidentialClosure: this.cnValidationListItem.gRFResidentialClosure
        },
        type: this.cnValidationListItem.ruleType
      }
    });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
