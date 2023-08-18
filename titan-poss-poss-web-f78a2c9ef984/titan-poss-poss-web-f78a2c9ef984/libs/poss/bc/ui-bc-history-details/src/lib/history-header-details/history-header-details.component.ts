import {
  Component,
  Input,
  OnInit,
  OnDestroy,

} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { CashMemoDetailsResponse } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-history-header-details',
  templateUrl: './history-header-details.component.html',
  styleUrls: ['./history-header-details.component.scss']
})
export class HistoryHeaderDetailsComponent implements OnInit ,OnDestroy{

  weightCodeForGm = 'gm';
  @Input() cmHeaderDetails$: Observable<CashMemoDetailsResponse>;
  destroy$: Subject<null> = new Subject<null>();
  headerDetails: CashMemoDetailsResponse;


  ngOnInit(): void {
    this.cmHeaderDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          this.headerDetails = data;
        }
      });
  }

  getInvoicedTime(time) {
    return moment(time).format('LT');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
