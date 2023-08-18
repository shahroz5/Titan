import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SentRequestResponse } from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-activate-cn-view',
  templateUrl: './activate-cn-view.component.html'
})
export class ActivateCnViewComponent  {
  @Input() requestDetails: SentRequestResponse;
  statusColor: string;
  destroy$ = new Subject<null>();
  constructor(private translate: TranslateService) {}


  getStatusColor(status: string) {
    let key;
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
}
