import {Component, OnInit} from '@angular/core';
import { CovidCasesService } from '../../services/covidcases.service';

@Component({
    selector: 'report',
    templateUrl: './report.component.html'
})

export class ReportComponent implements OnInit{    
    covidCases: any;
    title: string;
    currentObservationDate: any;
    currentMaxResults: any;
    countryCount: any;

    constructor(private covidCasesService: CovidCasesService){  
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();

        this.currentObservationDate = yyyy + '-' + mm + '-' + dd;
        this.currentMaxResults = 8;

        this.covidCasesService.getTopConfirmed(this.currentObservationDate, this.currentMaxResults).subscribe(covidCases => {
            this.covidCases = covidCases;                
        });
    }

    updateTopConfirmedResultsByObservationDate(newObservationDate: string){
        this.currentObservationDate = newObservationDate;

        this.covidCasesService.getTopConfirmed(this.currentObservationDate, this.currentMaxResults).subscribe(covidCases => {
            this.covidCases = covidCases;            
        });
    }

    updateTopConfirmedResultsByMaxResults(newMaxResults: string){
        this.currentMaxResults = newMaxResults;

        this.covidCasesService.getTopConfirmed(this.currentObservationDate, this.currentMaxResults).subscribe(covidCases => {
            this.covidCases = covidCases;            
        });
    }

    getTotalRecords(): number{
        return (this.covidCases) ? this.covidCases.countries.length : 0;
    }

    ngOnInit() {
       
    }
}