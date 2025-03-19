import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/reports'; // Replace with your API
  constructor(private http: HttpClient) { }

  getReportData(fromDate: string, toDate: string): Observable<{ table1: any[]; table2: any[] }> {
    debugger;
    return this.http.get<{ table1: any[]; table2: any[] }>(`${this.apiUrl}?fromDate=${fromDate}&toDate=${toDate}`);
}
}