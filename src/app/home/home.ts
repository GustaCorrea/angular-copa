import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Importações
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  modoAtual: 'inicio' | 'escolher' | 'criar' = 'inicio';
  timeSelecionadoId: number | null = null;
  novoTime = { nome: '', bandeiraUrl: '' };

  times = [
    // América do Sul
    { id: 1, nome: 'Brasil', bandeira: 'https://flagcdn.com/w160/br.png' },
    { id: 2, nome: 'Argentina', bandeira: 'https://flagcdn.com/w160/ar.png' },
    { id: 3, nome: 'Uruguai', bandeira: 'https://flagcdn.com/w160/uy.png' },
    { id: 4, nome: 'Colômbia', bandeira: 'https://flagcdn.com/w160/co.png' },
    { id: 5, nome: 'Equador', bandeira: 'https://flagcdn.com/w160/ec.png' },
    { id: 6, nome: 'Peru', bandeira: 'https://flagcdn.com/w160/pe.png' },
    { id: 7, nome: 'Paraguai', bandeira: 'https://flagcdn.com/w160/py.png' },
    // Europa
    { id: 8, nome: 'França', bandeira: 'https://flagcdn.com/w160/fr.png' },
    { id: 9, nome: 'Alemanha', bandeira: 'https://flagcdn.com/w160/de.png' },
    { id: 10, nome: 'Espanha', bandeira: 'https://flagcdn.com/w160/es.png' },
    { id: 11, nome: 'Inglaterra', bandeira: 'https://flagcdn.com/w160/gb-eng.png' },
    { id: 12, nome: 'Portugal', bandeira: 'https://flagcdn.com/w160/pt.png' },
    { id: 13, nome: 'Itália', bandeira: 'https://flagcdn.com/w160/it.png' },
    { id: 14, nome: 'Holanda', bandeira: 'https://flagcdn.com/w160/nl.png' },
    { id: 15, nome: 'Bélgica', bandeira: 'https://flagcdn.com/w160/be.png' },
    { id: 16, nome: 'Croácia', bandeira: 'https://flagcdn.com/w160/hr.png' },
    { id: 17, nome: 'Suíça', bandeira: 'https://flagcdn.com/w160/ch.png' },
    { id: 18, nome: 'Dinamarca', bandeira: 'https://flagcdn.com/w160/dk.png' },
    { id: 19, nome: 'Sérvia', bandeira: 'https://flagcdn.com/w160/rs.png' },
    { id: 20, nome: 'Polônia', bandeira: 'https://flagcdn.com/w160/pl.png' },
    { id: 21, nome: 'Suécia', bandeira: 'https://flagcdn.com/w160/se.png' },
    { id: 22, nome: 'Gales', bandeira: 'https://flagcdn.com/w160/gb-wls.png' },
    { id: 23, nome: 'Ucrânia', bandeira: 'https://flagcdn.com/w160/ua.png' },
    // América central e norte
    { id: 24, nome: 'EUA', bandeira: 'https://flagcdn.com/w160/us.png' },
    { id: 25, nome: 'México', bandeira: 'https://flagcdn.com/w160/mx.png' },
    { id: 26, nome: 'Canadá', bandeira: 'https://flagcdn.com/w160/ca.png' },
    { id: 27, nome: 'Costa Rica', bandeira: 'https://flagcdn.com/w160/cr.png' },
    { id: 28, nome: 'Panamá', bandeira: 'https://flagcdn.com/w160/pa.png' },
    { id: 29, nome: 'Jamaica', bandeira: 'https://flagcdn.com/w160/jm.png' },
    // África
    { id: 30, nome: 'Senegal', bandeira: 'https://flagcdn.com/w160/sn.png' },
    { id: 31, nome: 'Marrocos', bandeira: 'https://flagcdn.com/w160/ma.png' },
    { id: 32, nome: 'Egito', bandeira: 'https://flagcdn.com/w160/eg.png' },
    { id: 33, nome: 'Nigéria', bandeira: 'https://flagcdn.com/w160/ng.png' },
    { id: 34, nome: 'Camarões', bandeira: 'https://flagcdn.com/w160/cm.png' },
    { id: 35, nome: 'Gana', bandeira: 'https://flagcdn.com/w160/gh.png' },
    { id: 36, nome: 'Argélia', bandeira: 'https://flagcdn.com/w160/dz.png' },
    { id: 37, nome: 'C. do Marfim', bandeira: 'https://flagcdn.com/w160/ci.png' },
    { id: 38, nome: 'Tunísia', bandeira: 'https://flagcdn.com/w160/tn.png' },
    // Ásia e Oceania
    { id: 39, nome: 'Japão', bandeira: 'https://flagcdn.com/w160/jp.png' },
    { id: 40, nome: 'Coreia do Sul', bandeira: 'https://flagcdn.com/w160/kr.png' },
    { id: 41, nome: 'Irã', bandeira: 'https://flagcdn.com/w160/ir.png' },
    { id: 42, nome: 'Arábia Saudita', bandeira: 'https://flagcdn.com/w160/sa.png' },
    { id: 43, nome: 'Austrália', bandeira: 'https://flagcdn.com/w160/au.png' },
    { id: 44, nome: 'Catar', bandeira: 'https://flagcdn.com/w160/qa.png' },
    { id: 45, nome: 'EAU', bandeira: 'https://flagcdn.com/w160/ae.png' },
    { id: 46, nome: 'Iraque', bandeira: 'https://flagcdn.com/w160/iq.png' },
    { id: 47, nome: 'Uzbequistão', bandeira: 'https://flagcdn.com/w160/uz.png' },
    { id: 48, nome: 'Nova Zelândia', bandeira: 'https://flagcdn.com/w160/nz.png' }
  ];

  mudarModo(modo: 'inicio' | 'escolher' | 'criar') {
    this.modoAtual = modo;
  }

  iniciarCopa() {
    console.log('Iniciando copa...');
  }
}