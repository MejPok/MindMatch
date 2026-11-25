import type { JoinedPlayer } from '../types';

export type CreateGameProps = {
  gameCreated: boolean;
  setGameCreated: (value: boolean) => void;
  playerName: string;
  setPlayerName: (value: string) => void;
  joinedGame: boolean;
  setJoinedGame: (value: boolean) => void;
  onJoined: (player: JoinedPlayer) => void;
};