import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { TranslateService } from '@ngx-translate/core';
import {
  CmRequestDetails,
  ManualBillDetails,
  RequestStatusTypesEnum
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-header-view',
  templateUrl: './header-view.component.html',
})
export class HeaderViewComponent implements OnInit, OnDestroy {
  @Input() cmHeaderDetails$: Observable<ManualBillDetails>;
  @Input() cmRequestDetails$: Observable<CmRequestDetails>;
  destroy$: Subject<null> = new Subject<null>();
  headerDetails: ManualBillDetails;
  @Input() isCorpUser: boolean;
  @Input() imageUrl: string;
  weightCodeForGms = 'gms';
  weightCodeForGm = 'gm';
  status: string;
  statusColor: string;
  RequestStatusTypesEnumRef = RequestStatusTypesEnum;
  enableClose = false;

  constructor(
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.cmHeaderDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.headerDetails = data;
        }
      });
  }

  dateFormat(date) {
    return moment(date);
  }

  getStatus(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
