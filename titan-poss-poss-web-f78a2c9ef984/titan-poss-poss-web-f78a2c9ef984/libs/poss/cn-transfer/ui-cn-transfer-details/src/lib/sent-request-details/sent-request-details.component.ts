import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { CNDetailsInfo } from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
@Component({
  selector: 'poss-web-sent-request-details',
  templateUrl: './sent-request-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SentRequestDetailsComponent
  implements OnChanges, OnDestroy {
  @Input() cnDetails: CNDetailsInfo;
  @Input() locationDescription: string = null;

  details: CNDetailsInfo;
  statusColor: string;
  destroy$ = new Subject<null>();
  constructor(private translate: TranslateService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cnDetails']) {
      this.details = this.cnDetails;
    }
  }

  getStatusColor(status: string): string {
    if (this.details) {
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
