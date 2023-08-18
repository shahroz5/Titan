import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CreditNoteMasterFacade } from '@poss-web/eposs/cn-master/data-access-cn-master';
import {
  CnMasterDetail,
  CnMasterDetails,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  getCreditNoteMasterListRouteUrl
} from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-cn-master-detail',
  templateUrl: './cn-master-detail.component.html'
})
export class CnMasterDetailComponent implements OnInit, OnDestroy {
  cnType: string;
  cnMasterDetail$: Observable<CnMasterDetail>;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  noConfigValueMapErrorCode: string;
  formGroup: FormGroup;
  constructor(
    public creditNoteMasterFacade: CreditNoteMasterFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private translate: TranslateService,
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
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.showSuccessMessageNotification('pw.cnMaster.updatedMsg');
        } else this.overlayNotification.close();
      });

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

  saveCnMasterDetail(cnMasterDetail: CnMasterDetails) {
    const cnType = this.activatedRoute.snapshot.params['_cnType'];
    const cnDetails = {
      cnType: cnType,
      cnDetail: cnMasterDetail
    };
    this.creditNoteMasterFacade.updateCreditNoteMasterDetail(cnDetails);
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.TIMER,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
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
