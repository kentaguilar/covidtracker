import { Component, OnInit } from '@angular/core';
import { CovidCasesService } from '../../services/covidcases.service';

@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})

export class MyBarChartComponent implements OnInit {
  covidCases: any;  
  caseSummary: any;
  topConfirmedCountries: any;
  topRecoveredCountries: any;
  topDeathsCountries: any;

  constructor(private covidCasesService: CovidCasesService) { 
    this.topConfirmedCountries = 0;
    this.topRecoveredCountries = 0;
    this.topDeathsCountries = 0;    

    this.barChartData = [
      {data: [65, 59, 80, 81, 56, 55, 40], label: 'Confirmed Cases'},
      {data: [28, 48, 40, 19, 86, 27, 90], label: 'Recoveries'},
      {data: [28, 48, 40, 19, 86, 27, 90], label: 'Deaths'}
    ];    

    this.covidCasesService.getRecapChart().subscribe(response => {                
        this.barChartLabels = response["labels"];
        this.barChartData = [
          {data: response["confirmed"], label: 'Confirmed Cases'},
          {data: response["recoveries"], label: 'Recoveries'},
          {data: response["deaths"], label: 'Deaths'}
        ];   
    });

    this.covidCasesService.getSummary().subscribe(result => {
        this.caseSummary = result;
    });

    this.covidCasesService.getTopConfirmedCountries().subscribe(result => {
        this.topConfirmedCountries = result;
    });

    this.covidCasesService.getTopRecoveredCountries().subscribe(result => {
        this.topRecoveredCountries = result;
    });

    this.covidCasesService.getTopDeathsCountries().subscribe(result => {
        this.topDeathsCountries = result;
    });
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData;
  
  ngOnInit() {
    
  }
}