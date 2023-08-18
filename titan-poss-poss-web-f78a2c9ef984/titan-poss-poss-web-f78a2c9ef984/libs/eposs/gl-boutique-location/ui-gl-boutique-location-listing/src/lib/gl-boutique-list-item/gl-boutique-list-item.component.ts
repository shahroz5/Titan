import {
  Component,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { GlBoutiqueLocationList } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-gl-boutique-list-item',
  templateUrl: './gl-boutique-list-item.component.html'
})
export class GlBoutiqueListItemComponent implements OnChanges {
  @Input() glBoutiqueList: GlBoutiqueLocationList;
  @Output() glBoutiqueLocationCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();
  isActive: any;


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.glBoutiqueList.isActive;
  }

  getLocationCode(locationCode: string) {
    this.glBoutiqueLocationCode.emit(locationCode);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      locationCode: this.glBoutiqueList.locationCode,
      glCode: this.glBoutiqueList.glCode,
      pifSeriesNo: this.glBoutiqueList.pifSeriesNo,
      fitCode: this.glBoutiqueList.fitCode,
      costCenter: this.glBoutiqueList.costCenter,
      isActive: event.checked
    };
    this.emitToggle.emit(obj);
  }
  openViewPage(locationCode) {
    this.viewPage.emit(locationCode);
  }
}
