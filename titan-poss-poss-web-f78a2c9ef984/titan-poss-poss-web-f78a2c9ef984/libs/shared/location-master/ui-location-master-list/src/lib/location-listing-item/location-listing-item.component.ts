import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LocationListingData } from '@poss-web/shared/models';
import { CopyDetailsDialogComponent } from '../copy-details-dialog/copy-details-dialog.component';

@Component({
  selector: 'poss-web-location-listing-item',
  templateUrl: './location-listing-item.component.html',
  styleUrls: ['./location-listing-item.component.scss']
})
export class LocationListingItemComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  @Input() listItem: LocationListingData;
  @Output() locationCode = new EventEmitter<any>();
  @Output() viewLocationCode = new EventEmitter<any>();
  @Output() copyDetails = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();

  checked: boolean;

  ngOnInit() {
    this.checked = this.listItem.isActive;
  }

  viewDetailsPage() {
    this.viewLocationCode.emit(this.listItem.locationCode);
  }

  loadDetailsPage() {
    this.locationCode.emit(this.listItem.locationCode);
  }

  change(event: MatSlideToggleChange) {
    this.checked = event.checked;
    const obj = {
      isActive: event.checked,
      locationCode: this.listItem.locationCode
    };
    this.emitToggle.emit(obj);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CopyDetailsDialogComponent, {
      width: '450px',
      height: '270px',
      data: this.listItem
    });

    dialogRef.afterClosed().subscribe(data => {
      this.copyDetails.emit(data);
    });
  }
}
