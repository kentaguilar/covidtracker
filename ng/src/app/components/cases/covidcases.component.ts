import {Component} from '@angular/core';
import { CovidCasesService } from '../../services/covidcases.service';

@Component({
    selector: 'covidcases',
    templateUrl: './covidcases.component.html'
})

export class CovidCasesComponent {
    covidCases: any;
    involvedCountries: any;
    title: string;
    currentCountry: string;
    resultsCount: any;
    caseSummary: any;
    
    constructor(private covidCasesService: CovidCasesService){          
        this.covidCasesService.getInvolvedCountries().subscribe(results => {
            this.involvedCountries = results;            
        });

        this.covidCasesService.getCasesByCountry("Afghanistan").subscribe(results => {
            this.covidCases = results;
            this.resultsCount = this.covidCases.length;
        });        

        this.covidCasesService.getSummaryByCountry("Afghanistan").subscribe(result => {
            this.caseSummary = result;
        });
    }

    updateReport(newCountry: string){     
        if(newCountry == "All"){
            this.covidCasesService.getAllCases().subscribe(results => {
                this.covidCases = results;
                this.resultsCount = this.covidCases.length;
            });

            this.covidCasesService.getSummary().subscribe(result => {
                this.caseSummary = result;
            });
        }
        else{
            this.covidCasesService.getCasesByCountry(newCountry).subscribe(results => {
                this.covidCases = results;
                this.resultsCount = this.covidCases.length;
            });

            this.covidCasesService.getSummaryByCountry(newCountry).subscribe(result => {
                this.caseSummary = result;
            });
        }
    }

    getTotalRecords(): number{
        return (this.covidCases) ? this.covidCases.length : 0;
    }
}