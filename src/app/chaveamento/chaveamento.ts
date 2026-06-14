import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinigameComponent } from '../minigame/minigame';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-chaveamento',
  standalone: true,
  imports: [CommonModule, MinigameComponent, RouterModule],
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

  ngOnInit() {
    this.carregarChaveamento();
  }

  carregarChaveamento() {
    // Mock inicial (futuro GET pro Java)
    this.meuTime = { id: 1, nome: 'Brasil', bandeira: 'https://flagcdn.com/w160/br.png' };
    this.partidaAtual.timeA = this.meuTime;
    this.partidaAtual.timeB = { nome: 'França', bandeira: 'https://flagcdn.com/w160/fr.png' };
  }

  jogarPartida() {
    this.mostrarMinigame = true;
  } 

  // Função chamada pelo do app-minigame
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