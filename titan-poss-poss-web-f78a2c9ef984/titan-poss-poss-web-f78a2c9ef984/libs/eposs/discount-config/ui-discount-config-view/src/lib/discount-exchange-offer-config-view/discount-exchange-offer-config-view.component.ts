import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'poss-web-discount-exchange-offer-config-view',
  templateUrl: './discount-exchange-offer-config-view.component.html'
})
export class DiscountExchangeOfferConfigViewComponent
  implements OnChanges {
  @Input() discountDetails;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['discountDetails']) {
      console.log('abc', this.discountDetails);
    }
  }
}
