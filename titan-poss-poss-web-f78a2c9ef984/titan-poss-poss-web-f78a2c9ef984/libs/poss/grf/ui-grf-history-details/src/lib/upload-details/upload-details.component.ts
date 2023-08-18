import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'poss-web-upload-details',
  templateUrl: './upload-details.component.html'
})
export class UploadDetailsComponent implements OnInit {
  @Input() filesList;
  @Output() view = new EventEmitter<boolean>();

  ngOnInit(): void {
    console.log('fileList', this.filesList);
  }
  openPopUp(id) {
    this.view.emit(id);
  }
}
