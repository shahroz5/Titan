import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ItemFacade } from '@poss-web/shared/item-master/data-access-item-master';
import { ItemDetails } from '@poss-web/shared/models';
import {
  getProductMasterItemRouteUrl,
  getBoutiqueMasterItemRouteUrl
} from '@poss-web/shared/util-site-routes';
import { POSS_APP_TYPE } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-main-item-container',
  templateUrl: './main-item-container.component.html'
})
export class MainItemContainerComponent implements OnInit {
  itemDetailsUrl: string;
  itemDetailsByCode$: ItemDetails;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private itemFacade: ItemFacade,
    @Inject(POSS_APP_TYPE) private appType
  ) {}

  ngOnInit() {
    // const itemCode = decodeURIComponent(
    //   this.activatedRoute.snapshot.params['_itemCode']
    // );
    // this.itemFacade.loadItemDetailsByitemCode(itemCode);
    // this.itemDetailsUrl = getItemDetailsRouteUrl(itemCode);
  }

  back() {
    if (this.appType === 'EPOSS')
      this.router.navigate([getProductMasterItemRouteUrl()], {
        state: { clearFilter: false }
      });
    else if (this.appType === 'POSS') {
      this.router.navigate([getBoutiqueMasterItemRouteUrl()], {
        state: { clearFilter: false }
      });
    }
  }
}
