import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  BankPriority,
  SaveBankPriorityFormDetailsPayload
} from '@poss-web/shared/models';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'poss-web-bank-prioity-listing-items',
  templateUrl: './bank-prioity-listing-items.component.html',
  styleUrls: ['./bank-priority-listing-items.scss']
})
export class BankPrioityListingItemsComponent implements OnChanges {
  @Input() vertical = true;
  @Input() horizontal = false;
  @Input() wrap = true;
  @Input() changes = true;

  currentIndex = 0;

  @Input() bankPriorityListing: BankPriority[];
  @Output() savePayloadEvent = new EventEmitter<
    SaveBankPriorityFormDetailsPayload
  >();

  hasChange = false;
  bankPriorityLists: BankPriority[] = [];
  savePayload: SaveBankPriorityFormDetailsPayload;
  addedBanks: any[] = [];
  removedPriority: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.bankPriorityLists = this.bankPriorityListing;
  }

  drop(event: CdkDragDrop<{ title: string; poster: string }[]>) {
    this.hasChange = true;

    moveItemInArray(
      this.bankPriorityLists,
      event.previousIndex,
      event.currentIndex
    );
  }
  moveUp(previousIndex: number, currentIndex: number) {
    this.common(previousIndex, currentIndex);
  }
  moveDown(previousIndex: number, currentIndex: number) {
    this.common(previousIndex, currentIndex);
  }
  common(previousIndex, currentIndex) {
    this.hasChange = true;
    this.currentIndex = previousIndex;

    moveItemInArray(this.bankPriorityLists, previousIndex, currentIndex);
  }

  // /**
  //  *  Listener for Enter key event to save
  //  */
  // @HostListener('keydown', ['$event'])
  // onKeydown(event: KeyboardEvent): void {
  //   if (event.key === 'Enter') {
  //     this.changePriority = !this.changePriority;
  //     // this.save();
  //   }
  // }

  save() {
    for (const bank of this.bankPriorityLists) {
      this.addedBanks.push({
        bankName: bank.bankName,
        locationCode: 'URB',
        priority: this.bankPriorityLists.indexOf(bank)
      });
      this.removedPriority.push(bank.bankName);
    }
    this.savePayload = {
      addPriority: this.addedBanks,
      removePriority: this.removedPriority
    };
    if (this.hasChange) {
      this.savePayloadEvent.emit(this.savePayload);
    }

    this.hasChange = false;
    this.addedBanks = [];
    this.removedPriority = [];
  }
}
