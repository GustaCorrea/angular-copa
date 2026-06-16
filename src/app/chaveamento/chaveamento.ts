import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinigameComponent } from '../minigame/minigame';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalTimeComponent } from '../modal-time/modal-time';
import { CopaService } from '../services/copa.service';
import { Copa } from '../models/copa.model';
import { Partida } from '../models/partida.model';

@Component({
  selector: 'app-chaveamento',
  standalone: true,
  imports: [CommonModule, MinigameComponent, RouterModule, ModalTimeComponent], 
  templateUrl: './chaveamento.html',
  styleUrls: ['./chaveamento.css']
})
export class ChaveamentoComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef, 
    private router: Router,
    private route: ActivatedRoute,
    private copaService: CopaService 
  ) {}

  campeao: any = null;
  copa?: Copa;
  faseAtual = 'Carregando...';
  mostrarMinigame = false;
  mostrarModalTroca = false;
  jogadorEliminado: boolean = false;
  
  meuTime: any = null;
  partidaAtual: Partida | null = null; 

  oitavas: Partida[] = [];
  quartas: Partida[] = [];
  semis: Partida[] = [];
  finais: Partida[] = [];
  timesDisponiveis: any[] = [];

  ngOnInit() {
    this.carregarChaveamento();
  }

  carregarChaveamento() {
    const idCopa = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!idCopa) {
      console.error("ID da Copa não foi encontrado na URL!");
      this.router.navigate(['/']); 
      return;
    }

    this.copaService.buscarCopa(idCopa).subscribe({
      next: (data) => {
        this.copa = data;
        this.faseAtual = data.faseAtual;
        this.meuTime = data.timeDoJogador;

        this.oitavas = data.partidas.filter(p => p.fase === 'OITAVAS');

        // Mapeia os times das oitavas para a lista do modal de troca
        const timesSet = new Map();
        this.oitavas.forEach(p => {
          timesSet.set(p.timeCasa.id, p.timeCasa);
          timesSet.set(p.timeFora.id, p.timeFora);
        });
        this.timesDisponiveis = Array.from(timesSet.values());

        this.quartas = data.partidas.filter(p => p.fase === 'QUARTAS');
        this.semis = data.partidas.filter(p => p.fase.includes('SEMI'));
        this.finais = data.partidas.filter(p => p.fase === 'FINAL');
        
        // 1. LÓGICA DO CAMPEÃO DA FINAL
        if (this.finais.length > 0 && this.finais[0].concluida) {
          const partidaFinal = this.finais[0];
          
          const idVencedorFinal = partidaFinal.vencedorId || 
            (partidaFinal.placarCasa! > partidaFinal.placarFora! ? partidaFinal.timeCasa.id : partidaFinal.timeFora.id);

          if (idVencedorFinal === partidaFinal.timeCasa.id) {
            this.campeao = partidaFinal.timeCasa;
          } else {
            this.campeao = partidaFinal.timeFora;
          }
        }

        // 2. LÓGICA DE ELIMINAÇÃO 
        const partidasDoJogador = data.partidas.filter(p => 
          p.timeCasa.id === data.timeDoJogador.id || p.timeFora.id === data.timeDoJogador.id
        );
        
        // Cria uma cópia para inverter o array sem mutar a lista original de partidas
        const ultimaPartida = [...partidasDoJogador].reverse().find(p => p.concluida);
        
        if (ultimaPartida) {
          const idVencedor = ultimaPartida.vencedorId || 
            (ultimaPartida.placarCasa! > ultimaPartida.placarFora! ? ultimaPartida.timeCasa.id : ultimaPartida.timeFora.id);
          
          this.jogadorEliminado = (idVencedor !== data.timeDoJogador.id);
        } else {
          this.jogadorEliminado = false;
        }

        // 3. ATUALIZA A PARTIDA ATUAL 
        this.partidaAtual = data.partidas.find(p => 
          !p.concluida && 
          (p.timeCasa.id === data.timeDoJogador.id || p.timeFora.id === data.timeDoJogador.id)
        ) || null;

        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erro ao carregar chaveamento da API:", err)
    });
  }

  jogarPartida() {
    if (this.partidaAtual) {
      this.mostrarMinigame = true;
    }
  } 

  finalizarPartida(resultado: {placarCasa: number, placarFora: number}) {
    this.mostrarMinigame = false;
    
    if (this.partidaAtual) {
      this.copaService.salvarPlacar(this.partidaAtual.id, resultado).subscribe({
        next: () => {
          console.log("Placar salvo no backend! Atualizando chaveamento...");
          this.carregarChaveamento(); 
        },
        error: (err) => console.error("Erro ao salvar placar:", err)
      });
    }
  }

  fecharMinigame() {
    this.mostrarMinigame = false;
  }

  abrirModalTroca() {
    if (this.copa?.faseAtual !== 'OITAVAS') {
      console.warn('Não é permitido trocar de time após o início das Oitavas!');
      return;
    }
    this.mostrarModalTroca = true;
  }

  efetuarTroca(novoTime: any) {
    if (!novoTime || !this.copa) return;

    this.copaService.trocarTime(this.copa.id, novoTime.id).subscribe({
      next: () => {
        console.log("Time alterado no backend com sucesso para:", novoTime.nome);
        this.mostrarModalTroca = false;
        this.carregarChaveamento(); 
      },
      error: (err) => {
        console.error("Erro ao trocar time no backend", err);
        alert("Erro ao trocar de time.");
      }
    });
  }

  excluirCopa() {
    if (!this.copa) return;

    const confirmacao = confirm('Tem certeza que deseja excluir esta Copa? Todo o progresso será perdido!');

    if (confirmacao) {
      this.copaService.excluirCopa(this.copa.id).subscribe({
        next: () => {
          console.log('[Angular] Copa excluída com sucesso do banco de dados!');
          this.router.navigate(['/']); 
        },
        error: (err) => {
          console.error('[Angular] Erro ao excluir copa:', err);
          alert('Erro ao excluir a copa. Verifique o console.');
        }
      });
    }
  }

  mudarTime() {
    this.router.navigate(['/']);
  }
}