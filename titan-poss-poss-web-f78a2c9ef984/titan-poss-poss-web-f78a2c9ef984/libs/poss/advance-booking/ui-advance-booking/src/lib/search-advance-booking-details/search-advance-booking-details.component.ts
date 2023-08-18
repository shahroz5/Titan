import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  MetalTypeEnum
} from '@poss-web/shared/models';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { getAdvanceBookingReguestStatusUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-search-advance-booking-details',
  templateUrl: './search-advance-booking-details.component.html'
})
export class SearchAdvanceBookingDetailsComponent implements OnChanges {
  @Input() advanceBookingDetailsResponse: any;
  @Input() currencyCode: string;
  metalTypeEnum = MetalTypeEnum;
  statusColor: string;
  destroy$: Subject<null> = new Subject<null>();
  constructor(private router: Router, private translate: TranslateService) {}

  dateFormat(date) {
    return moment(date);
  }
  ngOnChanges(changes: SimpleChanges): void {}
  searchRequest() {
    this.router.navigate([getAdvanceBookingReguestStatusUrl()], {
      state: { clearFilter: false }
    });
  }
  getStatusColor(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }
}
