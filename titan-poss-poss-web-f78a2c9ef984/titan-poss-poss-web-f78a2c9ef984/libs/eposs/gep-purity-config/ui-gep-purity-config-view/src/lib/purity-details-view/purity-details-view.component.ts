import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  Lov,
  MetalType,
  PurityDetailsResponse,
  Ranges
} from '@poss-web/shared/models';
import * as moment from 'moment';
@Component({
  selector: 'poss-web-purity-details-view',
  templateUrl: './purity-details-view.component.html'
})
export class PurityDetailsViewComponent implements OnInit, OnChanges {
  @Input() metalTypes: MetalType[];
  @Input() itemTypes: Lov[];
  @Input() purityDetails: PurityDetailsResponse[];
  @Input() goldRanges: Ranges[];
  @Input() silverRanges: Ranges[];
  @Input() platinumRanges: Ranges[];
  @Input() dateFormat: string;
  @Output() openLocationMapping = new EventEmitter<boolean>();
  rowData = [];


  ngOnInit(): void {
    console.log('abc');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['metalTypes'] ||
      changes['itemTypes'] ||
      changes['purityDetails'] ||
      changes['goldRanges'] ||
      changes['silverRanges'] ||
      changes['platinumRanges']
    ) {
      this.rowData = [];

      for (const details of this.purityDetails) {
        let rangeValue;
        if (details.metalType === 'J') {
          rangeValue = this.goldRanges.filter(
            range => range.id === details.rangeId
          )[0].range;
        } else if (details.metalType === 'L') {
          rangeValue = this.platinumRanges.filter(
            range => range.id === details.rangeId
          )[0].range;
        } else if (details.metalType === 'P') {
          rangeValue = this.silverRanges.filter(
            range => range.id === details.rangeId
          )[0].range;
        }
        this.rowData.push({
          metalType: this.metalTypes.filter(
            data => data.materialTypeCode === details.metalType
          )[0].description,
          itemType: this.itemTypes.filter(
            data => data.code === details.itemType
          )[0].value,
          range: rangeValue ? rangeValue : '',
          deduction: details ? details.deductionPercent : '',
          scheme: details && details.schemePercent !== null ? details.schemePercent : '',
          startDate:
            details && details.startDate
              ? moment(details.startDate).format(this.dateFormat)
              : '',
          endDate:
            details && details.endDate
              ? moment(details.endDate).format(this.dateFormat)
              : '',
          id: details ? details.id : ''
        });
      }
      console.log('rowData', this.rowData);
    }
  }
  openViewLocationMapping() {
    this.openLocationMapping.emit(true);
  }
}
