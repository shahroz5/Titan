import { Component, Input, OnInit } from '@angular/core';
import { OfferDetails, offerDetailsEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-offer-details-view',
  templateUrl: './offer-details-view.component.html'
})
export class OfferDetailsViewComponent implements OnInit {
  @Input() offerDetails: OfferDetails[];
  @Input() excludeCashBack: boolean;
  @Input() isCashAmount: boolean;
  @Input() isCleared: boolean;
  radioOptions: string;

  ngOnInit(): void {
    this.radioOptions = this.isCashAmount
      ? offerDetailsEnum.amount
      : offerDetailsEnum.percentage;
  }
  radioChange(event) {
    if (event) {
      this.isCleared = false;
    }
  }
}
