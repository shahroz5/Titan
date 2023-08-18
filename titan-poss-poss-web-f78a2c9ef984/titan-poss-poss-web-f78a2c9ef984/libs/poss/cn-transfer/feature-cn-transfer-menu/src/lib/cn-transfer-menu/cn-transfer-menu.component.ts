import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { cnTransferTabEnum, PermissionData } from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { getCreditNoteTransferUrl } from '@poss-web/shared/util-site-routes';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-cn-transfer-menu',
  templateUrl: './cn-transfer-menu.component.html',
  styleUrls: []
})
export class CnTransferMenuComponent implements OnInit {
  tab: string;
  cnTransferEnumRef = cnTransferTabEnum;
  permission$: Observable<any[]>;

  readonly CN_SEARCH = 'CNTransfer_CNSearch';
  readonly CN_SENT = 'CNTransfer_CNSent';
  readonly CN_RECEIVE = 'CNTransfer_CNReceived';

  constructor(
    private router: Router,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {}

  ngOnInit(): void {
    this.tab = this.router.url.split('?')[0].split('/').pop();
    this.changeTab(this.tab);
    this.permission$ = this.permissionfacade.getPermissionforURL();
  }

  changeTab(newTab: any) {
    if (this.tab !== newTab) {
      this.tab = newTab;
      this.router.navigate([getCreditNoteTransferUrl(this.tab)]);
    }
  }

  loadPermission = (element: string): Observable<PermissionData> =>
    this.elementPermission.loadPermission(element, this.permission$);
}
