import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CovidCasesService{    
    constructor(private http:HttpClient){
        console.log('Covid Cases Service Initialized...');
    }

    getAllCases(){        
        return this.http.get('/api/all_cases');        
    }

    getInvolvedCountries(){        
        return this.http.get('/api/all_countries');        
    }

    getSummary(){        
        return this.http.get('/api/get_summary');        
    }

    getTopConfirmedCountries(){
        return this.http.get('/api/get_top_confirmed_countries');        
    }

    getTopRecoveredCountries(){
        return this.http.get('/api/get_top_recovered_countries');        
    }

    getTopDeathsCountries(){
        return this.http.get('/api/get_top_deaths_countries');        
    }

    getRecapChart(){
        return this.http.get('/api/get_recap_report');        
    }

    getTopConfirmed(observationDate, maxResults){
        return this.http.get('/api/top/confirmed?observation_date=' + observationDate + '&max_results=' + maxResults);        
    }

    getCasesByCountry(country){
        return this.http.get('/api/get_cases_by_country?country=' + country);        
    }

    getSummaryByCountry(country){
        return this.http.get('/api/get_summary_by_country?country=' + country);        
    }
}