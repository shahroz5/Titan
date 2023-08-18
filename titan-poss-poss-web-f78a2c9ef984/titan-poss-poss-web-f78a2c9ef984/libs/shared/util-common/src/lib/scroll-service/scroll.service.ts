import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollTopData = new BehaviorSubject<number>(0);
  scrollTop = this.scrollTopData.asObservable();



  setScrollTop(newScrollTop: number) {
    this.scrollTopData.next(newScrollTop);
  }
}
