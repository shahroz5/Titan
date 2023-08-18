import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { SalesMenuKeyEnum } from '@poss-web/shared/models';
import { getSalesHomePageUrl } from '@poss-web/shared/util-site-routes';
import { Router } from '@angular/router';

@Component({
  selector: 'poss-web-foc-transaction',
  templateUrl: './foc-transaction.component.html',
  styleUrls: ['./foc-transaction.component.scss']
})
export class FocTransactionComponent implements OnInit, OnDestroy {
  @Input() clearEvent: any;

  destroy$: Subject<null> = new Subject<null>();
  isCustomerSelected: false;
  constructor(public router: Router) {}

  ngOnInit(): void {
    // this.customerFacade
    //   .getIsCustomerSelected()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any) => (this.isCustomerSelected = data));
  }
  possHomeUrl() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
