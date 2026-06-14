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
  meuTime: any = null;
  mostrarMinigame = false;
  
  partidaAtual: any = {
    timeA: { nome: 'Aguardando...', bandeira: '' },
    timeB: { nome: 'Aguardando...', bandeira: '' }
  };

  // --- VARIÁVEL DO MODAL DE TROCA DE TIME ---
  mostrarModalTroca = false;

  // Uma lista reduzida para o modal (o Java mandará isso depois)
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
    // Mock inicial (futuro GET pro Java)
    this.meuTime = { id: 1, nome: 'Brasil', bandeira: 'https://flagcdn.com/w160/br.png' };
    this.partidaAtual.timeA = this.meuTime;
    this.partidaAtual.timeB = { nome: 'França', bandeira: 'https://flagcdn.com/w160/fr.png' };
  }

  abrirModalTroca() {
    this.mostrarModalTroca = true;
  }

  // Recebe o time do modal e faz a lógica de evitar duplicatas (Swap)
  efetuarTroca(novoTime: any) {
    if (this.partidaAtual.timeB.nome === novoTime.nome) {
      this.partidaAtual.timeB = this.meuTime; 
    }

    this.meuTime = novoTime;
    this.partidaAtual.timeA = this.meuTime;

    this.mostrarModalTroca = false;
  }

  jogarPartida() {
    this.mostrarMinigame = true;
  } 

  // Função chamada pelo app-minigame
  finalizarPartida(resultado: {placarA: number, placarB: number}) {
    console.log(`Jogo acabou! Placar: ${resultado.placarA} x ${resultado.placarB}`);
    this.mostrarMinigame = false;
    // Aqui no futuro vamos mandar pro Java atualizar a chave
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