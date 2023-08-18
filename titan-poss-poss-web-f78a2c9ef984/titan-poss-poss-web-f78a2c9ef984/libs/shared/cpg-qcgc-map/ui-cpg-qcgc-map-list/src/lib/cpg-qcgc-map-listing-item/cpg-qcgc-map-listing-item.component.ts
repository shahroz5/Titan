import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CPGProductGroupConfigForQCGCDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cpg-qcgc-map-listing-item',
  templateUrl: './cpg-qcgc-map-listing-item.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CpgQcgcMapListingItemComponent implements OnInit, OnChanges {
  @Input() cpgproductGroupConfigListItem: CPGProductGroupConfigForQCGCDetails;
  @Output() cpgproductGroupConfigIdView = new EventEmitter<string>();
  @Output() cpgproductGroupConfigId = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<any>();
  checked: boolean;


  ngOnInit() {
    this.checked = this.cpgproductGroupConfigListItem.isActive;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.checked = this.cpgproductGroupConfigListItem.isActive;
  }
  getCPGProductGroupConfigIdView(id: string) {
    this.cpgproductGroupConfigIdView.emit(id);
  }
  getCPGProductGroupConfigId(id: string) {
    this.cpgproductGroupConfigId.emit(id);
  }

  change(event) {
    this.checked = event.checked;
    const obj = {
      isActive: event.checked,
      paymentCategoryName: this.cpgproductGroupConfigListItem
        .paymentCategoryName
    };
    this.emitToggle.emit(obj);
  }
}
