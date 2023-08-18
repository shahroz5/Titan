import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-header-view',
  templateUrl: './header-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderViewComponent implements OnInit, OnDestroy {
  @Input() cmHeaderDetails$: any;

  destroy$: Subject<null> = new Subject<null>();
  headerDetails: any;
  @Input() isCorpUser: boolean;
  @Input() imageUrl: string;
  weightCodeForGms = 'gms';
  weightCodeForGm = 'gm';
  enableClose = false;

  constructor(@Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode) {}

  ngOnInit() {
    console.log(this.cmHeaderDetails$);
  }

  dateFormat(date) {
    return moment(date);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
