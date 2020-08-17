import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { APIService, SnakebarService, LoadingService, DataService } from '@shared/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  series = [];
  eventId;
  counter = 0;
  _routeListener: Subscription;
  eventData: any;
  EnentList = ["Cricket", "Tennis", "Football", "Soccer"];
  panelOpenState: boolean = false;
  inplayData: any = [];

  constructor(
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private ds: DataService,
    private apiService: APIService,
    private router: Router,
    private route: ActivatedRoute) {
    this._routeListener = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //console.log(event.urlAfterRedirects)
        if (this.route.snapshot.params['id']) {
          this.getSeries(this.route.snapshot.params['id']);
        }
      }
    });
  }

  ngOnInit(): void {
    this.ds.event$.subscribe(event => {
      this.eventData = event;
      //console.log(this.eventData)
    });
    this.inPlayMatches(this.route.snapshot.params['id']);
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState
  }

  setHeaderData(data) {
    this.ds.changeBread(data);
  }

  getSeries(id) {
    this._loadingService.show();
    this.eventId = id;
    this.apiService.ApiCall('', environment.apiUrl + 'event-competition?eventID=' + id, 'get').subscribe(
      result => {
        this._loadingService.hide();
        if (result.success) {
          this.series = result.data;
          //console.log(this.series)
        } else {
          this.series = [];
        }
      },
      err => {
        this._loadingService.hide();
      }
    );
  }

  inPlayMatches(eventId) {
    let param = {};

    this.apiService.ApiCall(param, environment.apiUrl + 'fetch-inplay/?eventID=' + eventId, 'get').subscribe(
      result => {
        if (result.success) {
          console.log(result);
          this.inplayData = result["result"];
        }
      },
      err => {
      }
    );
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }
}