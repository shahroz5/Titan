import {
  Component,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbnailComponent implements OnChanges {
  @Input() thumbnailSrc: string;
  @Input() imageSrc: string;
  @Input() alt: string;
  @Input() isLoadingImage: boolean;
  @Input() isLoadingThumbnailImage = false;

    // todo: temp property added, to be deleted after implementing image changes in all modules
    @Input() toLoadImageUrlFromAPI = false;

  @Output() loadImageEvent = new EventEmitter<null>();

  @ViewChild('popUpTemplate', { static: true }) popUpTemplateRef: any;

  defaultImageUrl = 'assets/img/product-default-image.svg';
  isLoadImageSrc = false;

  constructor(public dialog: MatDialog, public translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isLoadingImage'] &&
      !this.isLoadingImage &&
      this.isLoadImageSrc
    ) {
      this.showPopup();
    }
  }

  showPopup(): void {
    this.isLoadImageSrc = false;
    this.dialog.open(this.popUpTemplateRef, {
      height: '525px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl
      }
    });
  }

  loadImageUrl(): void {
    if (
      this.imageSrc !== null &&
      this.imageSrc !== this.defaultImageUrl &&
      typeof this.imageSrc === 'string' &&
      !this.imageSrc.includes('https') &&
      this.toLoadImageUrlFromAPI
    ) {
      this.isLoadImageSrc = true;
      this.loadImageEvent.emit();
    } else {
      this.showPopup();
    }
  }

  defaultThumbnailImage() {
    this.thumbnailSrc = this.defaultImageUrl;
  }

  defaultImage() {
    this.imageSrc = this.defaultImageUrl;
  }
}
