import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CutPieceTotFacade } from '@poss-web/eposs/cut-piece-tot/data-access-cut-piece-tot';
import { Subject, Observable } from 'rxjs';

import {
  getConfigurationHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  CutPieceTot,
  CutPieceTotEnum,
  CutPieceTotFormData,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cut-piece-tot-detail',
  templateUrl: './cut-piece-tot-detail.component.html',
  styles: []
})
export class CutPieceTotDetailComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private cutPieceTotFacade: CutPieceTotFacade
  ) {}

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  cutPieceTot$: Observable<CutPieceTot[]>;

  ngOnInit(): void {
    this.cutPieceTotFacade.loadCutPieceTotDetails();
    this.isLoading$ = this.cutPieceTotFacade.getIsLoading();
    this.cutPieceTot$ = this.cutPieceTotFacade.getCutPieceTotDetails();

    this.cutPieceTotFacade
      .editUpdateCutPieceTotResponses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification('pw.cutPieceTot.saveSuccessMsg');
        }
      });
  }

  formData(event: CutPieceTotFormData[]) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(take(1))
      .subscribe((res: boolean) => {
        if (res) {
          event.forEach(details => {
            this.cutPieceTotFacade.updateCutPieceTotDetails(details.configId, {
              configDetails: {
                type: CutPieceTotEnum.TEP_CUT_PIECE_TOT_CONFIG,
                data: {
                  l3DeductionPercent: +details.l3DeductionPercent
                }
              }
            });
          });
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

  showNotification(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.subscribe(() => {
            this.overlayNotification.close();
          });
      });
  }
  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.TEP_CONFIGURATIONS_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
