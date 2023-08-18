import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { focSchemeBasedEnums, LoadProductGroupPayload, WeightBasedVariantDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-weight-gold-slab-view',
  templateUrl: './weight-gold-slab-view.component.html',
  styles: []
})
export class WeightGoldSlabViewComponent  {
  constructor(public translate: TranslateService) {}
  @Input() weightBasedVariantDetailsGoldSlab: WeightBasedVariantDetails[];
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();


  productGroupMapping() {
    this.loadProductGroups.emit({
      category: focSchemeBasedEnums.WEIGHT_BASED,
      itemType: focSchemeBasedEnums.GOLD_COIN,
      masterId: null
    });
  }

}
