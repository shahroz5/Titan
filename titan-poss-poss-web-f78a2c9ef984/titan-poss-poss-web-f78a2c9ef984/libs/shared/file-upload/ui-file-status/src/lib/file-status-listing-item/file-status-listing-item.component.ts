import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertPopupServiceAbstraction,
  FileStatusList,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'poss-web-file-status-listing-item',
  templateUrl: './file-status-listing-item.component.html'
})
export class FileStatusListingItemComponent implements OnInit {
  @Input() fileStatusList: FileStatusList;
  destroy$: Subject<null> = new Subject<null>();
  status: string;
  statusColor: string;
  @Output() fileId = new EventEmitter<any>();
  constructor(
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog
  ) {}
  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status: string) {
    let key = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  ngOnInit() {
    console.log(this.fileStatusList, 'filelist');
  }
  failureDetailsPopup(remarks) {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: remarks
    });
  }
  getFileId(fileId: string, fileGroup: string) {
    this.fileId.emit({ fileId, fileGroup });
  }
}
