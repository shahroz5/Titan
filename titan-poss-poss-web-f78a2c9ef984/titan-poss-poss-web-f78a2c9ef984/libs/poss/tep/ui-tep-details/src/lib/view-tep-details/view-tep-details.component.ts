import { Component, Input } from '@angular/core';
import {
  commonRefundTranslateKeyMap,
  commonTranslateKeyMap
} from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import {
  AdvanceBookingDetailsResponse,
  CreateTepTypesEnum,
  TepTransactionResponse
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-view-tep-details',
  templateUrl: './view-tep-details.component.html',
})
export class ViewTepDetailsComponent {
  statusColor: string;
  @Input() workflowDetails: AdvanceBookingDetailsResponse;
  @Input() tepDetails: any;
  @Input() cancelDetails: TepTransactionResponse;
  @Input() tepType: string;
  @Input() rsoNames: { value: string; description: string } [] =[];

  destroy$: Subject<null> = new Subject<null>();

  constructor(private translate: TranslateService) {}

  dateFormat(date) {
    return moment(date);
  }

  getStatusColor(status: string) {
    let key;
    if (commonRefundTranslateKeyMap.has(status)) {
      key = commonRefundTranslateKeyMap.get(status);
    }
    if (key) {
      this.translate
        .get([key.statusColor])
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessages: string) => {
          this.statusColor = translatedMessages[key.statusColor];
        });
      return this.statusColor;
    }
  }

  getRequestStatusColor(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  getTepType(tepType) {
    switch (tepType.toUpperCase()) {
      case CreateTepTypesEnum.REGULAR_TEP: {
        return 'Regular TEP';
      }
      case CreateTepTypesEnum.FULL_VALUE_TEP: {
        return 'Full value Tep';
      }
      case CreateTepTypesEnum.INTER_BRAND_TEP: {
        return 'Inter Brand TEP';
      }
      case CreateTepTypesEnum.CUT_PIECE_TEP: {
        return 'Cut Piece Tep';
      }
      case CreateTepTypesEnum.MANUAL_TEP: {
        return 'Manual TEP';
      }

      case CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP: {
        return 'Manual Full value TEP';
      }
      default: {
        return 'Regular TEP';
      }
    }
  }

    // display rso name from rso code
    getRsoNameFromCode(code: string) {
      if (this.rsoNames.length !== 0) {
        for (const rso of this.rsoNames) {
          if (rso.value === code) return rso.description;
        }
      }
      return code;
    }
}
