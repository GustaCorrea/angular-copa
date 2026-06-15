import { Time } from './time.model';

export interface Partida {
  id: number;
  fase: string;
  concluida: boolean;
  placarCasa: number | null;
  placarFora: number | null;
  timeCasa: Time;
  timeFora: Time;
  vencedorId: number | null;
}