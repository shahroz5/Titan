import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  CustomErrors,
  OverlayNotificationType,
  ConfigurationsMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  GrnInterboutiqueConfig
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';

import { GrnInterboutiqueConfigFacade } from '@poss-web/eposs/grn-interboutique-config/data-access-grn-interboutique-config';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-grn-interboutique-config-feature',
  templateUrl: './grn-interboutique-config-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrnInterboutiqueConfigFeatureComponent
  implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  grnInterboutiqueConfigDetails$: Observable<GrnInterboutiqueConfig>;
  destroy$ = new Subject<null>();

  permissions$: Observable<any[]>;
  ADD_EDIT_PERMISSION = 'Configurations_grnInteboutique_addEditPermission';
  VIEW_PERMISSION = 'Configurations_grnInteboutique_viewPermission';

  constructor(
    public router: Router,
    private grnInterboutiqueConfigFacade: GrnInterboutiqueConfigFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }

  ngOnInit(): void {
    this.isLoading$ = this.grnInterboutiqueConfigFacade.getIsLoading();
    this.grnInterboutiqueConfigDetails$ = this.grnInterboutiqueConfigFacade.getGrnInterboutiqueConfigDetails();

    this.grnInterboutiqueConfigFacade.loadGrnInterboutiqueConfigDetails(1);

    this.grnInterboutiqueConfigFacade
      .editEditGrnInterboutiqueConfigResponses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showNotification('pw.grnInterboutiqueConfig.save_notification');
        }
      });

    this.grnInterboutiqueConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  grnInterboutiqueConfigForm(formData: {
    form: GrnInterboutiqueConfig;
    mode: boolean;
  }) {
    if (formData.mode) {
      this.grnInterboutiqueConfigFacade.addNewGrnInterboutiqueConfigDetails(
        formData.form
      );
    } else {
      this.grnInterboutiqueConfigFacade.editGrnInterboutiqueConfigDetails(
        formData.form.ruleId,
        formData.form
      );
    }
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
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

  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
