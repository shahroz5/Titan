import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  ConfigDetails,
  UpdateWeightTolerancePayload
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-weight-tolerance-listing-item',
  templateUrl: './weight-tolerance-listing-item.component.html',
  styleUrls: ['./weight-tolerance-listing-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightToleranceListingItemComponent implements OnChanges {
  @Input() configDetailsItem: ConfigDetails;

  @Output() loadSelectedWeightToleranceView = new EventEmitter<string>();
  @Output() loadSelectedWeightTolerance = new EventEmitter<string>();
  @Output() emittoggle = new EventEmitter<UpdateWeightTolerancePayload>();
  isActive: boolean;


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.configDetailsItem.isActive;
  }

  viewWeightTolerance() {
    this.loadSelectedWeightToleranceView.emit(this.configDetailsItem.configId);
  }
  editWeightTolerance() {
    this.loadSelectedWeightTolerance.emit(this.configDetailsItem.configId);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      id: this.configDetailsItem.configId,
      data: { isActive: event.checked }
    };
    this.emittoggle.emit(obj);
  }
}
