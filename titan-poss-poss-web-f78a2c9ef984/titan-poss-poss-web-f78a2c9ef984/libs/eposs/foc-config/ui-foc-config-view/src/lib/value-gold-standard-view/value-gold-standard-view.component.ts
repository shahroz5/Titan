import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  focSchemeBasedEnums,
  LoadProductGroupPayload,
  ValueBasedVariantDetails
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-value-gold-standard-view',
  templateUrl: './value-gold-standard-view.component.html',
  styles: []
})
export class ValueGoldStandardViewComponent  {
  constructor(public translate: TranslateService) {}
  @Input() valueBasedVariantDetailsGoldStandard: ValueBasedVariantDetails[];
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();



  productGroupMapping(schemeDetailsId: string) {
    this.loadProductGroups.emit({
      category: focSchemeBasedEnums.VALUE_BASED,
      schemeDetailsId,
      masterId: null
    });
  }
}
