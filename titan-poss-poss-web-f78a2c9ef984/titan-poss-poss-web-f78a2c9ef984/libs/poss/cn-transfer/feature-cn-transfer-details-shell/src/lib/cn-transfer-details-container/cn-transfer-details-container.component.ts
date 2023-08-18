import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { cnTransferTabEnum, FileUploadDocTypeEnum, FileUploadFileTypeEnum } from '@poss-web/shared/models';
import { getCreditNoteTransferUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-cn-transfer-details-container',
  templateUrl: './cn-transfer-details-container.component.html'
})
export class CnTransferDetailsContainerComponent  {
  tab: cnTransferTabEnum;
  cnTransferTabEnumRef = cnTransferTabEnum;
  docType = FileUploadDocTypeEnum.CN_WORKFLOW;
  fileType = FileUploadFileTypeEnum.OTHERS;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.tab = this.activatedRoute.snapshot.params['tab'];
  }


  back() {
    this.router.navigate([getCreditNoteTransferUrl(this.tab)]);
  }
}
