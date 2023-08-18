import {
  Component,
  EventEmitter,
  Input,

  Output
} from '@angular/core';
import {
  LoadProductGroupPayload,
  SchemeDetails,
  ValueBasedVariantDetails,
  WeightBasedVariantDetails
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-scheme-details-view',
  templateUrl: './scheme-details-view.component.html',
  styles: []
})
export class SchemeDetailsViewComponent  {

  selectedTab = 0;

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



  productGroupMapping(event: LoadProductGroupPayload) {
    this.loadProductGroups.emit(event);
  }



  changeTab(tab: number) {
    this.selectedTab = tab;
    this.selectedTabEmit.emit(this.selectedTab);
  }
}
