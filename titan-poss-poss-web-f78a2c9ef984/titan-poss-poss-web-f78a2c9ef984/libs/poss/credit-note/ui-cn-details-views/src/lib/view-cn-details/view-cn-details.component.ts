import { Component, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CreditNoteDetails } from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-view-cn-details',
  templateUrl: './view-cn-details.component.html',
  styleUrls: []
})
export class ViewCnDetailsComponent implements OnDestroy {
  @Input() creditNoteDetails: CreditNoteDetails;
  statusColor: string;
  destroy$ = new Subject<null>();

  constructor(public translate: TranslateService) {}

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatusColor(status?: string) {
    let key = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
