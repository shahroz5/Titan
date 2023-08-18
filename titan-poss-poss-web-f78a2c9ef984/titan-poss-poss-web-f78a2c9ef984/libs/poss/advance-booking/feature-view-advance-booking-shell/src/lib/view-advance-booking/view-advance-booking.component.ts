import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  getAdvanceBookingReguestStatusUrl,
  getAdvanceBookingSearchUrl
} from '@poss-web/shared/util-site-routes';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-view-advance-booking-shell',
  templateUrl: './view-advance-booking.component.html',
  styleUrls: ['./view-advance-booking.component.scss']
})
export class ViewAdvanceBookingComponent implements OnInit, OnDestroy {
  isApproval = false;
  hasNotification = true;
  destroy$: Subject<null> = new Subject<null>();
  fileUploadTitleText: string;
  fileType = 'OTHERS';
  showUpload = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.advanceBooking.uploadIdProofLabelandOrderCopy'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fileUploadTitleText =
          translatedMessages[
            'pw.advanceBooking.uploadIdProofLabelandOrderCopy'
          ];
      });
  }

  ngOnInit(): void {
    if (
      this.activatedRoute.snapshot.params['_tab'] === 'cancel-request' ||
      this.activatedRoute.snapshot.params['_tab'] === 'activate-request' ||
      this.activatedRoute.snapshot.params['_tab'] === 'freeze' ||
      this.activatedRoute.snapshot.params['_tab'] === 'add-payment'
    ) {
      if (
        this.activatedRoute.snapshot.params['_tab'] === 'cancel-request' ||
        this.activatedRoute.snapshot.params['_tab'] === 'activate-request'
      ) {
        this.showUpload = true;
      }
      this.isApproval = true;
    }
  }

  possHomeUrl() {
    if (
      this.activatedRoute.snapshot.params['_tab'] === 'cancel-request' ||
      this.activatedRoute.snapshot.params['_tab'] === 'activate-request' ||
      this.activatedRoute.snapshot.params['_tab'] === 'freeze' ||
      this.activatedRoute.snapshot.params['_tab'] === 'view' ||
      this.activatedRoute.snapshot.params['_tab'] === 'add-payment'
    ) {
      this.router.navigate(
        [getAdvanceBookingSearchUrl()],

        {
          state: { clearFilter: false }
        }
      );
    } else {
      this.router.navigate([getAdvanceBookingReguestStatusUrl()], {
        state: { clearFilter: false }
      });
    }
  }


  scrollUp() {
    document.getElementsByTagName('mat-sidenav-content')[0].scroll({
      top: 0,
      behavior: 'smooth'
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
