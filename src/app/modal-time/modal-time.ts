import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-time',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-time.html',
  styleUrls: ['./modal-time.css']
})
export class ModalTimeComponent implements OnInit {
  @Input() timesDisponiveis: any[] = [];
  @Input() meuTimeAtual: any;

  @Output() timeConfirmado = new EventEmitter<any>();
  @Output() fecharModal = new EventEmitter<void>();

  abaAtiva: 'existente' | 'novo' = 'existente';
  timeSelecionado: any = null;
  novoTime = { nome: '', bandeira: '' };

  ngOnInit() {
    // Quando abre, já deixa o time atual pré-selecionado
    this.timeSelecionado = this.meuTimeAtual;
  }

  confirmar() {
    const timeEscolhido = this.abaAtiva === 'existente' ? this.timeSelecionado : { ...this.novoTime };
    
    if (!timeEscolhido || !timeEscolhido.nome) return;
    
    // Devolve o time escolhido para o chaveamento (pai)
    this.timeConfirmado.emit(timeEscolhido);
  }

  fechar() {
    this.fecharModal.emit();
  }
}