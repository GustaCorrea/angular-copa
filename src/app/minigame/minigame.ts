import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minigame',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minigame.html',
  styleUrls: ['./minigame.css']
})
export class MinigameComponent implements OnInit, OnDestroy {
  // Recebe os times do Chaveamento
  @Input() partidaAtual: any; 
  
  // Avisa o Chaveamento quando o jogo acabar
  @Output() jogoFinalizado = new EventEmitter<{placarA: number, placarB: number}>();
  @Output() fechar = new EventEmitter<void>();

  placarA = 0;
  placarB = 0;
  mensagemAviso = 'Valendo vaga!';
  statusResultado: 'ganhou' | 'perdeu' | 'normal' = 'normal';

  // --- CONTROLES DA ANIMAÇÃO E SPAM ---
  posicaoCursor = 0; 
  direcaoCursor = 1; 
  velocidade = 1;
  intervaloAnimacao: any;
  podeChutar: boolean = false; // Começa falso até a animação iniciar

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.iniciarAnimacao();
  }

  ngOnDestroy() {
    // Limpa a memória se o componente for destruído
    if (this.intervaloAnimacao) {
      clearInterval(this.intervaloAnimacao);
    }
  }

  iniciarAnimacao() {
    if (this.intervaloAnimacao) {
      clearInterval(this.intervaloAnimacao);
    }
    
    this.posicaoCursor = 0;
    this.direcaoCursor = 1;
    this.podeChutar = true; // Libera o botão de chutar

    this.intervaloAnimacao = setInterval(() => {
      this.posicaoCursor += this.velocidade * this.direcaoCursor;
      
      if (this.posicaoCursor >= 100) {
        this.posicaoCursor = 100;
        this.direcaoCursor = -1;
      } else if (this.posicaoCursor <= 0) {
        this.posicaoCursor = 0;
        this.direcaoCursor = 1;
      }
      this.cdr.detectChanges();
    }, 16);
  }

  chutar() {
    // TRAVA ANTI-SPAM: Se não puder chutar, sai da função
    if (!this.podeChutar) return;
    this.podeChutar = false; // Bloqueia novos cliques imediatamente

    clearInterval(this.intervaloAnimacao);

    const acertou = this.posicaoCursor >= 45 && this.posicaoCursor <= 55;

    if (acertou) {
      this.placarA++;
      this.mensagemAviso = 'GOLAÇO DO SEU TIME! ⚽';
    } else {
      this.placarB++;
      this.mensagemAviso = 'GOL DO ADVERSÁRIO! ❌';
    }

    this.cdr.detectChanges();

    // VERIFICAÇÃO DO VENCEDOR (Melhor de 5 - Quem faz 3 primeiro)
    if (this.placarA >= 3 || this.placarB >= 3) {
      const venceuJogador = this.placarA >= 3;
      
      this.statusResultado = venceuJogador ? 'ganhou' : 'perdeu';
      this.mensagemAviso = venceuJogador 
        ? `FIM DE JOGO! ${this.partidaAtual.timeA.nome.toUpperCase()} VENCEU! 🏆` 
        : `FIM DE JOGO! ${this.partidaAtual.timeB.nome.toUpperCase()} VENCEU! ❌`;
      
      this.cdr.detectChanges();

      // Espera um tempo para o jogador ler e depois avisa o Pai que acabou
      setTimeout(() => {
        this.jogoFinalizado.emit({ placarA: this.placarA, placarB: this.placarB });
      }, 3500); 
      
      return; // Acabou, não reinicia a barra
    }

    // Se ninguém ganhou ainda, prepara a próxima rodada
    this.velocidade += 0.1;
    setTimeout(() => {
      this.mensagemAviso = 'Valendo!';
      this.iniciarAnimacao();
    }, 2000);
  }

  fecharModal() {
    this.fechar.emit();
  }
}