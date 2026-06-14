import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinigameComponent } from '../minigame/minigame';
import { Router, RouterModule } from '@angular/router';
import { ModalTimeComponent } from '../modal-time/modal-time';

@Component({
  selector: 'app-chaveamento',
  standalone: true,
  imports: [CommonModule, MinigameComponent, RouterModule, ModalTimeComponent],
  templateUrl: './chaveamento.html',
  styleUrls: ['./chaveamento.css']
})
export class ChaveamentoComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  faseAtual = 'Oitavas de Final';
  mostrarMinigame = false;
  mostrarModalTroca = false;
  
  meuTime: any = null;
  partidaAtual: any = null;

  // ESTRUTURA PRONTA PARA O JAVA: Array com as 8 partidas das Oitavas
  partidas = [
    // LADO ESQUERDO
    { id: 1, timeCasa: { nome: 'Brasil', bandeira: 'https://flagcdn.com/w160/br.png' }, timeFora: { nome: 'França', bandeira: 'https://flagcdn.com/w160/fr.png' } },
    { id: 2, timeCasa: { nome: 'Argentina', bandeira: 'https://flagcdn.com/w160/ar.png' }, timeFora: { nome: 'Uruguai', bandeira: 'https://flagcdn.com/w160/uy.png' } },
    { id: 3, timeCasa: { nome: 'Espanha', bandeira: 'https://flagcdn.com/w160/es.png' }, timeFora: { nome: 'Portugal', bandeira: 'https://flagcdn.com/w160/pt.png' } },
    { id: 4, timeCasa: { nome: 'Itália', bandeira: 'https://flagcdn.com/w160/it.png' }, timeFora: { nome: 'Holanda', bandeira: 'https://flagcdn.com/w160/nl.png' } },
    // LADO DIREITO
    { id: 5, timeCasa: { nome: 'Inglaterra', bandeira: 'https://flagcdn.com/w160/gb-eng.png' }, timeFora: { nome: 'EUA', bandeira: 'https://flagcdn.com/w160/us.png' } },
    { id: 6, timeCasa: { nome: 'Alemanha', bandeira: 'https://flagcdn.com/w160/de.png' }, timeFora: { nome: 'México', bandeira: 'https://flagcdn.com/w160/mx.png' } },
    { id: 7, timeCasa: { nome: 'Japão', bandeira: 'https://flagcdn.com/w160/jp.png' }, timeFora: { nome: 'Coreia do Sul', bandeira: 'https://flagcdn.com/w160/kr.png' } },
    { id: 8, timeCasa: { nome: 'Marrocos', bandeira: 'https://flagcdn.com/w160/ma.png' }, timeFora: { nome: 'Senegal', bandeira: 'https://flagcdn.com/w160/sn.png' } }
  ];

  timesDisponiveis = [
    { nome: 'Brasil', bandeira: 'https://flagcdn.com/w160/br.png' },
    { nome: 'França', bandeira: 'https://flagcdn.com/w160/fr.png' },
    { nome: 'Argentina', bandeira: 'https://flagcdn.com/w160/ar.png' },
    { nome: 'Alemanha', bandeira: 'https://flagcdn.com/w160/de.png' },
    { nome: 'Espanha', bandeira: 'https://flagcdn.com/w160/es.png' },
    { nome: 'Inglaterra', bandeira: 'https://flagcdn.com/w160/gb-eng.png' }
  ];

  ngOnInit() {
    this.carregarChaveamento();
  }

  carregarChaveamento() {
    // Quando o Java estiver pronto, isso aqui será substituído pelo retorno da API
    this.meuTime = this.partidas[0].timeCasa;
    this.partidaAtual = this.partidas[0];
  }

  abrirModalTroca() {
    this.mostrarModalTroca = true;
  }

  efetuarTroca(novoTime: any) {
    const timeAntigo = { ...this.meuTime };

    // Varre todas as partidas para encontrar onde o novo time estava e colocar o antigo no lugar
    for (let partida of this.partidas) {
      if (partida.timeCasa.nome === novoTime.nome) {
        partida.timeCasa = timeAntigo;
        break;
      }
      if (partida.timeFora.nome === novoTime.nome) {
        partida.timeFora = timeAntigo;
        break;
      }
    }

    // Atualiza o seu time para a partida atual (Partida 1)
    this.meuTime = novoTime;
    this.partidas[0].timeCasa = novoTime;
    this.partidaAtual = this.partidas[0];

    this.mostrarModalTroca = false;
    this.cdr.detectChanges();
  }

  jogarPartida() {
    this.mostrarMinigame = true;
  } 

  finalizarPartida(resultado: {placarCasa: number, placarFora: number}) {
    this.mostrarMinigame = false;
    // O Java vai receber esse resultado para avançar o time na chave!
  }

  fecharMinigame() {
    this.mostrarMinigame = false;
  }

  excluirCopa() {
    console.log('[Angular] Chamando o Java para excluir a Copa...');
  }

  mudarTime() {
    this.router.navigate(['/']);
  }
}