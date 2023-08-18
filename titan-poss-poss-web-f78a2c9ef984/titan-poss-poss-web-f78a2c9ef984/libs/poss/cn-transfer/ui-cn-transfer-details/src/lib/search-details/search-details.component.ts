import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { CNDetailsInfo } from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
@Component({
  selector: 'poss-web-search-details',
  templateUrl: './search-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() cnDetails: CNDetailsInfo;
  @Input() locationDescription: string = null;
  details: CNDetailsInfo;
  statusColor: string;
  destroy$ = new Subject<null>();
  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cnDetails']) {
      this.details = this.cnDetails;
    }
  }
  ngOnInit(): void {
    this.cdr.markForCheck();
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
