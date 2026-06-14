import { Component } from '@angular/core';
import { HomeComponent } from './home/home';
import { ChaveamentoComponent } from './chaveamento/chaveamento';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, ChaveamentoComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'angular-copa';
}