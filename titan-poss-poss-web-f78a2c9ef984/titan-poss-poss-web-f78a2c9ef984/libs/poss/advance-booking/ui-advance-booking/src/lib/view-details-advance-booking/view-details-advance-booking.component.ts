import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AdvanceBookingDetailsResponse,
  MetalTypeEnum
} from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { getAdvanceBookingSearchUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-view-details-advance-booking',
  templateUrl: './view-details-advance-booking.component.html'
})
export class ViewDetailsAdvanceBookingComponent {
  @Input() advanceBookingDetails: AdvanceBookingDetailsResponse;
  @Input() currencyCode: string;
  metalTypeEnum = MetalTypeEnum;
  statusColor: string;
  destroy$: Subject<null> = new Subject<null>();
  constructor(private router: Router, private translate: TranslateService) {}

  dateFormat(date) {
    return moment(date);
  }

  searchAbUrl() {
    this.router.navigate(
      [getAdvanceBookingSearchUrl()],

      {
        state: { clearFilter: false }
      }
    );
  }


  getStatusColor(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }

    if (key) {
      this.translate
        .get([key.statusColor])
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessages: string) => {
          this.statusColor = translatedMessages[key.statusColor];
        });
      return this.statusColor;
    }
  }
}
