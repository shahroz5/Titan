import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { cnTransferTabEnum, SalesMenuKeyEnum } from '@poss-web/shared/models';
import {
  getCreditNoteTransferUrl,
  getSalesHomePageUrl
} from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-cn-transfer',
  templateUrl: './cn-transfer.component.html'
})
export class CnTransferComponent implements OnInit {
  tab: string;
  cnTransferEnumRef = cnTransferTabEnum;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {

  }

  changeTab(newTab: any) {
    if (this.tab !== newTab) {
      this.tab = newTab;
      this.router.navigate([getCreditNoteTransferUrl(this.tab)]);
    }
  }
  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CREDIT_NOTE
      }
    });
  }

}
