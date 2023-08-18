import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ScrollService } from '@poss-web/shared/util-common';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { CardMenu, ConfigurationsMenuKeyEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-help-menu',
  templateUrl: './help-menu.component.html',
  styleUrls: ['./help-menu.component.scss']
})
export class HelpMenuComponent implements OnInit {
  permissions$: Observable<any[]>;

  menu: CardMenu[] = [
    {
      menuKey: ConfigurationsMenuKeyEnum.HELP,
      titleTranslationKey: 'pw.productMasterUpdate.master',
      subTitleTranslationKey: 'pw.productMasterUpdate.update',
      hasChild: true,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'Configurations Home - Master Update Configurations Menu',
      child: [
        {
          titleTranslationKey: 'pw.productMasterUpdate.productMasterUpdate',
          hasChild: false,
          elementName:
            'Help Configurations - Master Update Configuration SubMenu',
          path: '/help/product-master-update'
        }
      ]
    }
  ];

  constructor(
    private permissionfacade: PermissionFacade,
    public scrollService: ScrollService
  ) {}
  9;
  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }
}
