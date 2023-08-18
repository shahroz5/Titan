import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { focSchemeBasedEnums, LoadProductGroupPayload, ValueBasedVariantDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-value-other-slab-view',
  templateUrl: './value-other-slab-view.component.html',
  styles: []
})
export class ValueOtherSlabViewComponent  {
  constructor(public translate: TranslateService) {}
  @Input() valueBasedVariantDetailsOthersSlab: ValueBasedVariantDetails[];
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();


  productGroupMapping() {
    this.loadProductGroups.emit({
      category: focSchemeBasedEnums.VALUE_BASED,
      itemType: focSchemeBasedEnums.OTHERS,
      masterId: null
    });
  }

}
