import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { takeUntil } from 'rxjs/operators';
import { getSalesHomePageUrl } from '@poss-web/shared/util-api-service';
import { CommomStateAttributeTypeEnum, SalesMenuKeyEnum, TransactionTypeEnum } from '@poss-web/shared/models';
import { Router } from '@angular/router';
import { ScrollService } from '@poss-web/shared/util-common';
import { getCustomerOrderIdUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-customer-order-shell',
  templateUrl: './customer-order-shell.component.html',
  styleUrls: ['./customer-order-shell.component.scss']
})
export class CustomerOrderShellComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean;
  hasNotification = true;
  transactionType = TransactionTypeEnum;

  commomStateAttributeTypeEnum = CommomStateAttributeTypeEnum;

  destroy$: Subject<null> = new Subject<null>();
  constructor(
    public authFacade: AuthFacade,
    public router: Router,
    public scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        console.log('CustomerOrderShell: isLoggedIn:', isLoggedIn);
        this.isLoggedIn = isLoggedIn;
      });
  }

  scrollUp() {
    document.getElementsByTagName('mat-sidenav-content')[0].scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  onSelected(eventId: string) {
    this.router.navigate([getCustomerOrderIdUrl(eventId)]);
  }

  possHomeUrl() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
