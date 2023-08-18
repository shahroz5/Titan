import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditNoteMasterFacade } from '@poss-web/eposs/cn-master/data-access-cn-master';
import {
  CnMasterDetail,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getCreditNoteMasterListRouteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-cn-master-view-detail',
  templateUrl: './cn-master-view-detail.component.html'
})
export class CnMasterViewDetailComponent implements OnInit, OnDestroy {
  cnType: string;
  cnMasterDetail$: Observable<CnMasterDetail>;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  noConfigValueMapErrorCode: string;
  constructor(
    public creditNoteMasterFacade: CreditNoteMasterFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit() {
    this.creditNoteMasterFacade.loadReset();
    this.isLoading$ = this.creditNoteMasterFacade.getIsloading();

    this.cnType = this.activatedRoute.snapshot.params['_cnType'];

    this.cnMasterDetail$ = this.creditNoteMasterFacade.getCreditNoteMasterDetailByCnType();

    this.creditNoteMasterFacade.loadCreditNoterMasterDetailByCnType(
      this.cnType
    );

    this.creditNoteMasterFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  back() {
    this.creditNoteMasterFacade.loadReset();
    this.router.navigate([getCreditNoteMasterListRouteUrl()]);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
