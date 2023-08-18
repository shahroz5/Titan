import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LoadProductGroupPayload,
  SchemeDetails,
  ValueBasedVariantDetails,
  WeightBasedVariantDetails
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-foc-config-view',
  templateUrl: './foc-config-view.component.html',
})
export class FocConfigViewComponent  {

  @Input() schemeDetails: SchemeDetails;

  @Input() valueBasedVariantDetailsGoldStandard: ValueBasedVariantDetails[];
  @Input() valueBasedVariantDetailsGoldSlab: ValueBasedVariantDetails[];
  @Input() valueBasedVariantDetailsOthersStandard: ValueBasedVariantDetails[];
  @Input() valueBasedVariantDetailsOthersSlab: ValueBasedVariantDetails[];

  @Input() weightBasedVariantDetailsGoldStandard: WeightBasedVariantDetails[];
  @Input() weightBasedVariantDetailsGoldSlab: WeightBasedVariantDetails[];
  @Input() weightBasedVariantDetailsOthersStandard: WeightBasedVariantDetails[];
  @Input() weightBasedVariantDetailsOthersSlab: WeightBasedVariantDetails[];

  @Output() selectedTabEmit = new EventEmitter<number>();
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();

  expanded = true;



  productGroupMapping(event: LoadProductGroupPayload) {
    this.loadProductGroups.emit(event);
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }

  selectedTab(tab: number) {
    this.selectedTabEmit.emit(tab);
  }
}
