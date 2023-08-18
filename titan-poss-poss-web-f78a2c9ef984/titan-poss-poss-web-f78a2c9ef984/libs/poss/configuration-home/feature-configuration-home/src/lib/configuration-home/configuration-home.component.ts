import { ScrollService } from '@poss-web/shared/util-common';
import { CardMenu, ConfigurationsMenuKeyEnum } from '@poss-web/shared/models';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { getPrinterConfigurationRouteUrl } from '@poss-web/shared/util-site-routes';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
@Component({
  selector: 'poss-web-configuration-home',
  templateUrl: './configuration-home.component.html'
})
export class ConfigurationHomeComponent implements OnInit {
  permissions$: Observable<any[]>;

  menu: CardMenu[] = [
    {
      menuKey: ConfigurationsMenuKeyEnum.GLOBAL_MENU_KEY,
      titleTranslationKey: 'pw.configurations.global',
      subTitleTranslationKey: 'pw.configurations.configuration',
      hasChild: true,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'Configurations Home - Global Configurations Menu',
      child: [
        {
          titleTranslationKey: 'pw.configurations.printerConfiguration',
          hasChild: false,
          elementName: 'Global Configurations - Printer Configuration SubMenu',
          path: getPrinterConfigurationRouteUrl()
        }
      ]
    }
  ];

  constructor(
    private permissionfacade: PermissionFacade,
    public scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }
}
