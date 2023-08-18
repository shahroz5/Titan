import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  DiscountTEPConfig,
  DiscountTEPDetails,
  DiscountTypeEnum
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-recovery-config-view',
  templateUrl: './tep-recovery-config-view.component.html'
})
export class TepRecoveryConfigViewComponent implements OnChanges {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() durations;
  @Input() tepConfig: DiscountTEPDetails;
  rowData = [];


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tepConfig']) {
      this.createRowData();
    }
    if (changes['durations']) {
      this.durations = this.durations;
    }
    console.log(this.durations, 'durations');
  }
  createRowData() {
    this.rowData = [];
    if (this.tepConfig.tepDetails?.length) {
      for (const item of this.tepConfig.tepDetails) {
        this.createRow(item);
      }
    } else {
      this.createRow();
    }
    console.log('TEP Config check rowData ', this.rowData);
  }
  createRow(tepConfig?: DiscountTEPConfig) {
    if (tepConfig) {
      this.rowData.push({
        id: tepConfig.id ? tepConfig.id : '',
        durationInDays: tepConfig.durationInDays ? tepConfig.durationInDays : 0,
        recoveryPercent: tepConfig.recoveryPercent
          ? tepConfig.recoveryPercent
          : 0
      });
    }
  }

}
