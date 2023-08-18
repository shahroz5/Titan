import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  AppTypesEnum,
  PermissionData,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import {
  EPOSS_APP_VERSION_NUMBER,
  POSS_APP_TYPE,
  POSS_APP_VERSION_NUMBER,
  POSS_WEB_HOST_NAME
} from '@poss-web/shared/util-config';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

@Component({
  selector: 'poss-web-top-menu-secondary',
  templateUrl: './top-menu.component-secondary.html',
  styleUrls: ['./top-menu.component-secondary.scss']
})
export class TopMenuSecondaryComponent {
  @Input() notificationsCount = 0;
  @Input() username = '';
  @Input() locationCode = '';
  @Input() isHandSet = false;
  @Input() hostNameData = '';
  @Input() isBtqUser;
  @Input() fullName;

  @Output() logout = new EventEmitter();
  appTypesEnum = AppTypesEnum;

  // sidenavSecondary: any[] = [
  //   {
  //     external: false,
  //     name: 'HOME',
  //     translatedName: 'pw.navigation.home',
  //     url: 'home',
  //     permission: {
  //       transactionCodes: ['R0', 'R1', 'R2', 'S', 'S25', 'S26'],
  //       authorisedStrategy: '',
  //       unAuthorisedStrategy: ''
  //     }
  //   }
  // ];

  constructor(
    private translate: TranslateService,
    public router: Router,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    public shortcutService: ShortcutServiceAbstraction,
    @Inject(POSS_WEB_HOST_NAME) public hostname,
    @Inject(POSS_APP_TYPE) public appType,
    @Inject(POSS_APP_VERSION_NUMBER) private possAppVersionNumber: string,
    @Inject(EPOSS_APP_VERSION_NUMBER) private epossAppVersionNumber: string
  ) {}

  isNotificationBadgeHidden() {
    if (this.notificationsCount && this.notificationsCount > 0) {
      return false;
    } else {
      return true;
    }
  }

  toggleTheme() {
    if (document.body.classList.contains('pw-light-theme')) {
      document.body.classList.remove('pw-light-theme');
      document.body.classList.add('pw-dark-theme');
    } else {
      document.body.classList.remove('pw-dark-theme');
      document.body.classList.add('pw-light-theme');
    }
  }

  toggleShortcut() {
    this.shortcutService.shortcutEnable = !this.shortcutService
      .shortcutEnable;
  }

  getPermissions = (permissionData: PermissionData) => of(permissionData);

  showAboutMessage(messageKey: string, versionNumber: string) {
    this.dialog.closeAll();
    this.translate
      .get([messageKey], {
        entityName: versionNumber
      })
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        const alertMessage = translatedMsg[messageKey];

        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.INFO,
            message: alertMessage
          })
          .pipe(take(1))
          .subscribe();
      });
  }

  showAbout() {
    let messageKey: string;

    switch (this.appType) {
      case AppTypesEnum.POSS:
        messageKey = 'pw.navigation.possAppVersion';
        this.showAboutMessage(messageKey, this.possAppVersionNumber);
        break;
      default:
        messageKey = 'pw.navigation.epossAppVersion';
        this.showAboutMessage(messageKey, this.epossAppVersionNumber);
        break;
    }
  }

  // showAbout() {
  //   this.dialog.closeAll();
  //   this.alertPopupService
  //     .open({
  //       type: AlertPopupTypeEnum.INFO,
  //       message:
  //         this.appType === 'POSS'
  //           ? `POSS - Boutique Point Of Sale. Version No: ${this.possAppVersionNumber}`
  //           : `EPOSS - Central Point Of Sale. Version No: ${this.epossAppVersionNumber}`
  //     })
  //     .pipe(take(1))
  //     .subscribe();
  // }
}
