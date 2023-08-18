import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AppTypesEnum,
  CardMenu,
  EpossHomeKeyEnum
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ScrollService } from '@poss-web/shared/util-common';
import {
  getAccessControlRouteUrl,
  getRoleAllowedRouteUrl,
  getUamUsersListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedtab = '';
  isBTQUser = false;
  permissions$: Observable<any[]>;

  menu: CardMenu[] = [
    {
      menuKey: EpossHomeKeyEnum.CREATE_EDIT_USER_ROLE_MENU,
      titleTranslationKey: 'pw.userrolemgmntdashboard.createeditCardtext',
      subTitleTranslationKey: 'pw.userrolemgmntdashboard.userroleCardText',
      hasChild: true,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-product-icon-64',
      elementName: 'Uam Home - User Role Card',
      child: [
        {
          titleTranslationKey: 'pw.userrolemgmntdashboard.userCardText',
          hasChild: false,
          elementName: 'Uam Home - User SubCard',
          path: getUamUsersListRouteUrl()
        },
        {
          titleTranslationKey: 'pw.userrolemgmntdashboard.roleCardText',
          hasChild: false,
          elementName: 'Uam Home - Role SubCard',
          path: getRoleAllowedRouteUrl()
        }
      ]
    },
    {
      menuKey: EpossHomeKeyEnum.ACCESS_CONTROL,
      titleTranslationKey: 'pw.userrolemgmntdashboard.accessCardText',
      subTitleTranslationKey: 'pw.userrolemgmntdashboard.controlCardText',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-location-icon-64',
      elementName: 'Uam Home - Access Control Card',
      path: getAccessControlRouteUrl()
    }
  ];

  constructor(
    private permissionfacade: PermissionFacade,
    public router: Router,
    public scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }
}
