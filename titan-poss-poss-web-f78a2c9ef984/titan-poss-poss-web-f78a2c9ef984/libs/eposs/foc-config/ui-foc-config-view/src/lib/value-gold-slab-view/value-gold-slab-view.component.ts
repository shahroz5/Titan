import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { focSchemeBasedEnums, LoadProductGroupPayload, ValueBasedVariantDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-value-gold-slab-view',
  templateUrl: './value-gold-slab-view.component.html',
  styles: []
})
export class ValueGoldSlabViewComponent  {
  constructor(public translate: TranslateService) {}
  @Input() valueBasedVariantDetailsGoldSlab: ValueBasedVariantDetails[];
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();


  productGroupMapping() {
    this.loadProductGroups.emit({
      category: focSchemeBasedEnums.VALUE_BASED,
      itemType: focSchemeBasedEnums.GOLD_COIN,
      masterId: null
    });
  }
}
