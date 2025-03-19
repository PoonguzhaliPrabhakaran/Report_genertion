import { Component,OnInit } from '@angular/core';
import { ReportService } from '../services/report.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
   isVisible: boolean = true;
  reportData: any[] = [];
  fromDate: string = '';
  toDate: string = '';
  table1: any[] =[];
  table2: any[] =[];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
   // this.loadReportData();
  }

  loadReportData() {
    debugger;
    if (!this.fromDate || !this.toDate) {
      alert("Please select both From Date and To Date!");
      return;
    }

    this.reportService.getReportData(this.fromDate, this.toDate).subscribe((data) => {
     if(data && typeof data =='object')
     {
      this.table1 = data.table1 ?? [];  // ✅ Use Nullish Coalescing (??) to prevent errors
      this.table2 = data.table2 ?? [];
    } else {
      console.error("Invalid API response format", data);
    }
    });
  }

  exportToExcel(tableData: any[], tableName: string) {
    if (tableData.length === 0) {
      alert(`${tableName} has no data to export!`);
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, tableName);

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, `${tableName}.xlsx`);
  }

  exportToPDF(tableData: any[], tableName: string) {
    if (tableData.length === 0) {
      alert(`${tableName} has no data to export!`);
      return;
    }
    const doc = new jsPDF();
    doc.text(`${tableName}`, 10, 10);

    autoTable(doc, {
      head: [Object.keys(tableData[0] || {})],
      body: tableData.map(row => Object.values(row)),
    });

    doc.save(`${tableName}.pdf`);
  }
}
