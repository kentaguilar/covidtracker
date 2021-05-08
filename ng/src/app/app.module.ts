import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import  { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CovidCasesComponent } from './components/cases/covidcases.component';
import { MyBarChartComponent } from './components/my-bar-chart/my-bar-chart.component';
import { ReportComponent } from './components/reports/report.component';

const appRoutes: Routes = [
  { path: '', component: MyBarChartComponent },
  { path: 'covidcases', component: CovidCasesComponent },
  { path: 'reports', component: ReportComponent }
];

@NgModule({
  declarations: [
    AppComponent, CovidCasesComponent, MyBarChartComponent, ReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ChartsModule,
    RouterModule.forRoot(appRoutes)    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
