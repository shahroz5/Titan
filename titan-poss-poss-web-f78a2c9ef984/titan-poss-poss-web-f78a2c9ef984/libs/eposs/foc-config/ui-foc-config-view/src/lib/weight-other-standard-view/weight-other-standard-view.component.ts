import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  focSchemeBasedEnums,
  LoadProductGroupPayload,
  WeightBasedVariantDetails
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-weight-other-standard-view',
  templateUrl: './weight-other-standard-view.component.html',
  styles: []
})
export class WeightOtherStandardViewComponent  {
  constructor(public translate: TranslateService) {}
  @Input() weightBasedVariantDetailsOthersStandard: WeightBasedVariantDetails[];
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();



  productGroupMapping(schemeDetailsId: string) {
    this.loadProductGroups.emit({
      category: focSchemeBasedEnums.WEIGHT_BASED,
      schemeDetailsId,
      masterId: null
    });
  }
}
