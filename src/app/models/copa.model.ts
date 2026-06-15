import { Partida } from './partida.model';
import { Time } from './time.model';

export interface Copa {
  id: number;
  faseAtual: string;
  status: string;
  timeDoJogador: Time;
  partidas: Partida[];
}