import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ItemDetailsPopupHeaderData } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-item-details-header',
  templateUrl: './item-details-header.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailsHeaderComponent {
  @Input() headerDetails: ItemDetailsPopupHeaderData;
  @Input() currencyCode: string;
  @Input() weightUnit: string;
  @Input() isLoading: boolean;
  @Input() prodCategoryDesc: string;
  @Input() prodGroupDesc: string;
}
