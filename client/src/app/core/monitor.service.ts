import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HeapInfo } from '../model/HeapInfo';
import { DispatcherInfo } from '../model/DispatcherInfo';
import { CollectStat } from '../model/CollectStat';
import { MailBoxStat } from '../model/MailBoxStat';
import { EngineActorStatus } from '../model/EngineActorStatus';

@Injectable()
export class MonitorService {

    constructor(private http: Http) { }

    findHeapInfo(offsetMinute: number): Observable<HeapInfo[]> {
        return this.http
            .get('api/monitor/heap/query/' + offsetMinute)
            .map(response => {
                return response.json() as HeapInfo[];
            });
    }

    findDispatcherInfo(dispatcherName, offsetMinute: number): Observable<DispatcherInfo[]> {
        let url = 'api/monitor/dispatcher/' + dispatcherName + '/query/' + offsetMinute;
        return this.http
            .get(url)
            .map(response => {
                return response.json() as DispatcherInfo[];
            });
    }

    findCollectStat(offsetMinute: number): Observable<CollectStat[]> {
        return this.http
            .get('api/monitor/collectStat/query/' + offsetMinute)
            .map(response => {
                return response.json() as CollectStat[];
            });
    }

     findIndicatorHandleStat(offsetMinute: number): Observable<CollectStat[]> {
        return this.http
            .get('api/monitor/indicatorHandleStat/query/' + offsetMinute)
            .map(response => {
                return response.json() as CollectStat[];
            });
    }

    findMailboxStat(offsetMinute: number): Observable<MailBoxStat[]> {
        return this.http
            .get('api/monitor/mailboxStat/query/' + offsetMinute)
            .map(response => {
                return response.json() as MailBoxStat[];
            });
    }

    queryActorTree(deviceIp: string): Observable<EngineActorStatus> {
         let formData:FormData = new FormData();  
         formData.append('ip',deviceIp);  

        return this.http.post('api/monitor/engine/actorStatus', formData)
            .map(response => {
                return response.json() as EngineActorStatus;
            });
    }

}    