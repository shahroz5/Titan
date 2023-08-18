import {
  Component,
  Input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';

@Component({
  selector: 'poss-web-gep-view-details',
  templateUrl: './gep-view-details.component.html',
})

export class GepViewDetailsComponent  {
  statusColor: string;
  @Input() selectedHistoryItem: any;
  @Input() subTxnType: any;
  @Input() rsoNames: any;

  moment= moment;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private translate: TranslateService,
    ) {}



  dateFormat(date) {
    return moment(date);
  }

  getRequestStatusColor(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    else{
      key = commonTranslateKeyMap.get("CANCELLED")
    }
    this.translate
      .get([key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

   // display rso name from rso code
   getRsoNameFromCode(code: string) {
    if (this.rsoNames.length !== 0) {
      for (const rso of this.rsoNames) {
        if (rso.value === code) return rso.description;
      }
    }
    return code;
  }

}
