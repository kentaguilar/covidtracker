import { Component } from '@angular/core';
import { CovidCasesService } from './services/covidcases.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CovidCasesService]
})
export class AppComponent {
  title = 'Covid Tracker v1.0';
}
