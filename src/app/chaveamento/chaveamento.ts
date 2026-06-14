import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chaveamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chaveamento.html',
  styleUrls: ['./chaveamento.css']
})
export class ChaveamentoComponent implements OnInit {
  
  // --- DADOS DA COPA (Vão vir do Java depois) ---
  faseAtual = 'Oitavas de Final';
  meuTime: any = null;
  
  // --- CONTROLE DA TELA DO MINIGAME ---
  mostrarMinigame = false;
  partidaAtual: any = {
    timeA: { nome: 'Aguardando...', bandeira: '' },
    timeB: { nome: 'Aguardando...', bandeira: '' }
  };
  placarA = 0;
  placarB = 0;
  mensagemAviso = 'Prepare-se!';

  // --- VARIÁVEIS DA ANIMAÇÃO  ---
  posicaoCursor = 0; 
  direcaoCursor = 1; 
  velocidade = 1;
  intervaloAnimacao: any;

  // Injetamos o ChangeDetectorRef para forçar a tela a atualizar
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.carregarChaveamento();
  }

  carregarChaveamento() {
    // TODO: Fazer um GET no Java para buscar as partidas
    this.meuTime = { id: 1, nome: 'Brasil', bandeira: 'https://flagcdn.com/w160/br.png' };
    this.partidaAtual.timeA = this.meuTime;
    this.partidaAtual.timeB = { nome: 'França', bandeira: 'https://flagcdn.com/w160/fr.png' };
  }

  statusResultado: 'ganhou' | 'perdeu' | 'normal' = 'normal';

  jogarPartida() {
    this.mostrarMinigame = true;
    this.placarA = 0;
    this.placarB = 0;
    this.statusResultado = 'normal'; 
    this.mensagemAviso = 'Valendo vaga!';
    this.iniciarAnimacao();
  } 

  iniciarAnimacao() {
    if (this.intervaloAnimacao) {
      clearInterval(this.intervaloAnimacao);
    }
    
    // Zera a posição antes de começar
    this.posicaoCursor = 0;
    this.direcaoCursor = 1;

    // Roda a cada 16ms (60 FPS)
    this.intervaloAnimacao = setInterval(() => {
      this.posicaoCursor += this.velocidade * this.direcaoCursor;
      
      // Bateu nas bordas, inverte a direção
      if (this.posicaoCursor >= 100) {
        this.posicaoCursor = 100;
        this.direcaoCursor = -1;
      } else if (this.posicaoCursor <= 0) {
        this.posicaoCursor = 0;
        this.direcaoCursor = 1;
      }

      // vai desenhando a barrinha na nova posição
      this.cdr.detectChanges();
    }, 16);
  }

  chutar() {
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
      
      // Define se ganhou ou perdeu para mudar a cor no HTML
      this.statusResultado = venceuJogador ? 'ganhou' : 'perdeu';
      
      this.mensagemAviso = venceuJogador 
        ? `FIM DE JOGO! ${this.partidaAtual.timeA.nome.toUpperCase()} VENCEU! 🏆` 
        : `FIM DE JOGO! ${this.partidaAtual.timeB.nome.toUpperCase()} VENCEU! ❌`;
      
      this.cdr.detectChanges();

      setTimeout(() => {
        this.mostrarMinigame = false;
        this.cdr.detectChanges();
      }, 3500); 
      
      return;
    }

    this.velocidade += 0.1;

    setTimeout(() => {
      this.mensagemAviso = 'Valendo!';
      this.iniciarAnimacao();
    }, 2000);
  }

  fecharMinigame() {
    this.mostrarMinigame = false;
    clearInterval(this.intervaloAnimacao);
  }

  excluirCopa() {
    // TODO: DELETE pro Java
    console.log('[Angular] Chamando o Java para excluir a Copa...');
  }

  mudarTime() {
    // TODO: Voltar para a tela inicial
    console.log('[Angular] Voltando para a tela inicial...');
  }
}