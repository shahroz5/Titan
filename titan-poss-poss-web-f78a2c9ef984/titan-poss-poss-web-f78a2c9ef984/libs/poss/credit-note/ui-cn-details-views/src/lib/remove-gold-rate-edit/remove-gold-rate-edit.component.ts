import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CNSearchEnum, CreditNoteDetails } from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-remove-gold-rate-edit',
  templateUrl: './remove-gold-rate-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoveGoldRateEditComponent implements OnDestroy {
  @Input() creditNoteDetails: CreditNoteDetails;
  CNSearchEnumRef = CNSearchEnum;
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
