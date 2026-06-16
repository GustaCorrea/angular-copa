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

  // Arrays separados para manter o seu design visual
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

        const timesSet = new Map();
        this.oitavas.forEach(p => {
          timesSet.set(p.timeCasa.id, p.timeCasa);
          timesSet.set(p.timeFora.id, p.timeFora);
        });
        this.timesDisponiveis = Array.from(timesSet.values());

        this.quartas = data.partidas.filter(p => p.fase === 'QUARTAS');
        this.semis = data.partidas.filter(p => p.fase === 'SEMIFINAL');
        this.finais = data.partidas.filter(p => p.fase === 'FINAL');
        
        // logica do campeão
        if (this.finais.length > 0 && this.finais[0].concluida) {
          const partidaFinal = this.finais[0];
          // Descobre quem é o campeão baseado no vencedorId
          if (partidaFinal.vencedorId === partidaFinal.timeCasa.id) {
            this.campeao = partidaFinal.timeCasa;
          } else if (partidaFinal.vencedorId === partidaFinal.timeFora.id) {
            this.campeao = partidaFinal.timeFora;
          }
        }

        // 2. logica de eliminacao
        const partidasDoJogador = data.partidas.filter(p => 
          p.timeCasa.id === data.timeDoJogador.id || p.timeFora.id === data.timeDoJogador.id
        );
        const ultimaPartida = partidasDoJogador.reverse().find(p => p.concluida);
        
        // Se o jogador perdeu
        if (ultimaPartida && ultimaPartida.vencedorId !== data.timeDoJogador.id) {
          this.jogadorEliminado = true;
        } else {
          this.jogadorEliminado = false;
        }

        // 3. atualiza a partida atual
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
    
    // Salva o placar no Java
    if (this.partidaAtual) {
      this.copaService.salvarPlacar(this.partidaAtual.id, resultado).subscribe(() => {
        console.log("Placar salvo no backend! Atualizando chaveamento...");
        this.carregarChaveamento(); // Recarrega a tela para mostrar o avanço de fase
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

    // Chama o Java para atualizar o banco de dados
    this.copaService.trocarTime(this.copa.id, novoTime.id).subscribe({
      next: () => {
        console.log("Time alterado no backend com sucesso para:", novoTime.nome);
        this.mostrarModalTroca = false;
        
        // Recarrega a copa inteira para atualizar os destaques e a partida atual
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

    //confirmação ao usuário antes de apagar
    const confirmacao = confirm('Tem certeza que deseja excluir esta Copa? Todo o progresso será perdido!');

    if (confirmacao) {
      this.copaService.excluirCopa(this.copa.id).subscribe({
        next: () => {
          console.log('[Angular] Copa excluída com sucesso do banco de dados!');
          // Redireciona o jogador de volta para a tela inicial
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