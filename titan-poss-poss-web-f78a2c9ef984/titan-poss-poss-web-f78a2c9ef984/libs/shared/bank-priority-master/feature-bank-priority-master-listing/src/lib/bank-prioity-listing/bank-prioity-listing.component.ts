import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  CustomErrors,
  BankPriority,
  OverlayNotificationServiceAbstraction,
  SaveBankPriorityFormDetailsPayload,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationType
} from '@poss-web/shared/models';

import { BankPriorityFacade } from '@poss-web/shared/bank-priority-master/data-access-bank-priority-master';

import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-bank-prioity-listing',
  templateUrl: './bank-prioity-listing.component.html',
  styleUrls: ['./bank-prioity-listing.component.scss']
})
export class BankPrioityListingComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  bankPriorityListing: BankPriority[] = [];
  error$: Observable<CustomErrors>;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private bankPriorityFacade: BankPriorityFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.bankPriorityFacade.resetBankPriorityDialogData();
    this.isLoading$ = this.bankPriorityFacade.getisLoading();
    this.loadBankPriorityDetails();

    this.bankPriorityFacade.getBankPriorityDetailsListing().subscribe(data => {
      let newArray = [];
      newArray = data;
      this.bankPriorityListing = [];
      for (const item of newArray) {
        this.bankPriorityListing.push({
          bankName: item.bankName
        });
      }
    });

    this.bankPriorityFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.bankPriorityFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasUpdated: boolean) => {
        if (hasUpdated === true) {
          this.loadBankPriorityDetails();
          this.showSuccessMessageNotification('pw.bankPriority.saveMsg');
        }
      });
  }
  loadBankPriorityDetails() {
    this.bankPriorityFacade.loadBankPriorityDetailsListing();
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
  savePriority(
    saveBankPriorityFormDetailsPayload: SaveBankPriorityFormDetailsPayload
  ) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.bankPriorityFacade.saveBankPriorityFormDetails(
            saveBankPriorityFormDetailsPayload
          );
        }
      });
  }

  backArrow() {
    this.bankPriorityFacade.resetBankPriorityDialogData();
    // this.router.navigate([getBankPriorityDashboardRouteUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.COMPANY_MENU_KEY
      }
    });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.subscribe();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
