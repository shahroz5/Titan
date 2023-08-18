import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  BankDetailsPayload,
  CardDetails,
  OfferDetails,
  PayerBankList
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-cashback-offer-config-view',
  templateUrl: './cashback-offer-config-view.component.html'
})
export class CashbackOfferConfigViewComponent implements OnChanges {
  @Input() bankDetails: BankDetailsPayload;
  @Input() payerBankList$: Observable<PayerBankList[]>;
  @Input() dateFormat: string;
  @Input() cardDetails: CardDetails[];
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() count: number;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() offerDetails: OfferDetails[];
  @Input() excludeCashBack: boolean;
  @Input() isCashAmount: boolean;
  @Input() isCleared: boolean;
  expanded = true;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['offerDetails']) {
    }
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }
  getDate(date) {
    return moment(date).format(this.dateFormat);
  }
}
