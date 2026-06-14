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
  
  // Avisa o Chaveamento quando o jogo acabar com o novo padrão Casa/Fora
  @Output() jogoFinalizado = new EventEmitter<{placarCasa: number, placarFora: number}>();
  @Output() fechar = new EventEmitter<void>();

  placarCasa = 0;
  placarFora = 0;
  mensagemAviso = 'Valendo vaga!';
  statusResultado: 'ganhou' | 'perdeu' | 'normal' = 'normal';

  // --- CONTROLES DA ANIMAÇÃO E SPAM ---
  posicaoCursor = 0; 
  direcaoCursor = 1; 
  velocidade = 1;
  intervaloAnimacao: any;
  podeChutar: boolean = false; 

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.iniciarAnimacao();
  }

  ngOnDestroy() {
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
    this.podeChutar = true; 

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
    if (!this.podeChutar) return;
    this.podeChutar = false; 

    clearInterval(this.intervaloAnimacao);

    const acertou = this.posicaoCursor >= 45 && this.posicaoCursor <= 55;

    if (acertou) {
      this.placarCasa++;
      this.mensagemAviso = 'GOLAÇO DO SEU TIME! ⚽';
    } else {
      this.placarFora++;
      this.mensagemAviso = 'GOL DO ADVERSÁRIO! ❌';
    }

    this.cdr.detectChanges();

    // VERIFICAÇÃO DO VENCEDOR (Melhor de 5)
    if (this.placarCasa >= 3 || this.placarFora >= 3) {
      const venceuJogador = this.placarCasa >= 3;
      
      this.statusResultado = venceuJogador ? 'ganhou' : 'perdeu';
      this.mensagemAviso = venceuJogador 
        ? `FIM DE JOGO! ${this.partidaAtual.timeCasa.nome.toUpperCase()} VENCEU! 🏆` 
        : `FIM DE JOGO! ${this.partidaAtual.timeFora.nome.toUpperCase()} VENCEU! ❌`;
      
      this.cdr.detectChanges();

      setTimeout(() => {
        this.jogoFinalizado.emit({ placarCasa: this.placarCasa, placarFora: this.placarFora });
      }, 3500); 
      
      return; 
    }

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