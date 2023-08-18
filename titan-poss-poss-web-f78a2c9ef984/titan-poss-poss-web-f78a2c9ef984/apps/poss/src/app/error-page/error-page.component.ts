import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'poss-web-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  errorCode: string;
  isLightTheme = true

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.errorPageCondition();
    if(document.body.classList.contains('pw-light-theme')
    ) {
      this.isLightTheme = true;
    }else {
      this.isLightTheme = false;
    }
  }

  errorPageCondition() {
    if (this.router.url === '/404') {
      this.errorCode = '404';
    } else if (this.router.url === '/500') {
      this.errorCode = '500';
    } else if (this.router.url === '/503') {
      this.errorCode = '503';
    } else {
      this.errorCode = '';
    }
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
