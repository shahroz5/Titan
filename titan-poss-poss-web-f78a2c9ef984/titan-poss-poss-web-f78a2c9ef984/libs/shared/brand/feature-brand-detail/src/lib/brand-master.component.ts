import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BrandMasterFacade } from '@poss-web/shared/brand/data-access-brand';
import {
  BrandEnum,
  BrandMasterDetails,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import {
  getBrandDetailsRouteUrl,
  getProductMasterBrandListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take, takeUntil } from 'rxjs/operators';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-brand-master',
  templateUrl: './brand-master.component.html',
  styles: []
})
export class BrandMasterComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private brandMasterFacade: BrandMasterFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private profileDataFacade: ProfileDataFacade,
    private permissionfacade: PermissionFacade
  ) {}

  tabIndex = 0;
  isNew: boolean;
  isLoading = true;

  isLoading$: Observable<boolean>;
  brandDetails$: Observable<BrandMasterDetails>;
  newLocCode$: Subject<null> = new Subject<null>();
  destroy$: Subject<null> = new Subject<null>();
  permissions$: Observable<any[]>;

  brandCode: string;
  orgCode: string;

  showViewOnly: boolean;

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly ? true : false;
      });

    this.permissions$ = this.permissionfacade.getPermissionforURL();

    this.isLoading$ = this.brandMasterFacade.getIsloading();

    this.profileDataFacade
      .getOrgCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgCode => {
        this.orgCode = orgCode;
      });

    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['params']['_brand-code'] === BrandEnum.NEW) {
          this.isNew = true;
        } else {
          this.isNew = false;
        }
      });

    this.brandCode = this.activatedRoute.snapshot.params['_brand-code'];

    this.brandMasterFacade.loadBrandDetails(this.brandCode);

    this.brandDetails$ = this.brandMasterFacade.getBrandMasterDetails();

    this.brandDetails$.pipe(takeUntil(this.newLocCode$)).subscribe(data => {
      if (data) {
        if (
          this.brandCode === BrandEnum.NEW &&
          data.brandCode !== BrandEnum.NEW &&
          data.brandCode !== '' &&
          data.brandCode
        ) {
          this.newLocCode$.next();
          this.newLocCode$.complete();
          this.isNew = false;
          setTimeout(() => {
            this.router.navigate([getBrandDetailsRouteUrl(data.brandCode)]);
          }, 2000);
        }
      }
    });

    this.brandMasterFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.brandMasterFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved === true) {
          this.showNotification('pw.brandMaster.updateSuccessMessage');
        }
      });
  }

  updateTab(tabIndex: number) {
    this.tabIndex = tabIndex;
  }

  back() {
    this.router.navigate([getProductMasterBrandListRouteUrl()]);
  }

  formOutput($event: BrandMasterDetails) {
    $event = {
      ...$event,
      orgCode: this.orgCode
    };
    if (this.isNew) {
      this.brandMasterFacade.saveBrandMasterDetails($event);
    } else {
      this.brandMasterFacade.updateBrandMasterDetails($event);
    }
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
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
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
