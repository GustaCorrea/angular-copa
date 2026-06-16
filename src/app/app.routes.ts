import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ChaveamentoComponent } from './chaveamento/chaveamento';

export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'chaveamento/:id', component: ChaveamentoComponent },
  { path: '**', redirectTo: '' }
];