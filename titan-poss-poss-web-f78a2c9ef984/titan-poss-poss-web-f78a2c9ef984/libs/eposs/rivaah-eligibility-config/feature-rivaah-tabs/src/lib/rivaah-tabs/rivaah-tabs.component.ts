import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-rivaah-tabs',
  templateUrl: './rivaah-tabs.component.html'
})
export class RivaahTabsComponent implements OnInit {
  permissions$: Observable<any[]>;

  ELIGIBILITY_CRITERIA_TAB = "RivaahEligibiltyConfig_EligibilityCriteria_Tab";
  COUPON_CONFIGURATION_TAB = "RivaahEligibiltyConfig_CouponConfiguration_Tab";
  LOCATION_MAPPING_TAB = "RivaahEligibiltyConfig_LocationMapping_Tab";

  constructor(
    public router: Router,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
    ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
