import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { focSchemeBasedEnums, LoadProductGroupPayload, WeightBasedVariantDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-weight-other-slab-view',
  templateUrl: './weight-other-slab-view.component.html',
  styles: []
})
export class WeightOtherSlabViewComponent  {
  constructor(public translate: TranslateService) {}
  @Input() weightBasedVariantDetailsOthersSlab: WeightBasedVariantDetails[];
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();


  productGroupMapping() {
    this.loadProductGroups.emit({
      category: focSchemeBasedEnums.WEIGHT_BASED,
      itemType: focSchemeBasedEnums.OTHERS,
      masterId: null
    });
  }
}
