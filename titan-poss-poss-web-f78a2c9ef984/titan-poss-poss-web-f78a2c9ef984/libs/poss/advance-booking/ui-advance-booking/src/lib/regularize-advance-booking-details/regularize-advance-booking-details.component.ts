import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MetalTypeEnum } from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { getAdvanceBookingReguestStatusUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-regularize-advance-booking-details',
  templateUrl: './regularize-advance-booking-details.component.html'
})
export class RegularizeAdvanceBookingDetailsComponent {
  @Input() advanceBookingDetailsResponse: any;
  @Input() currencyCode: string;
  metalTypeEnum = MetalTypeEnum;
  statusColor: string;
  destroy$: Subject<null> = new Subject<null>();
  enableClose = false;
  @Input() imageUrl: string;
  constructor(private router: Router, private translate: TranslateService) {}

  dateFormat(date) {
    return moment(date);
  }

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
