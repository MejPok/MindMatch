import type { JoinedPlayer } from "../types";

export type JoinGameProps = {
  roomCode: string;
  setRoomCode: (value: string) => void;
  playerName: string;
  setPlayerName: (value: string) => void;
  joinedGame: boolean;
  setJoinedGame: (value: boolean) => void;
  onJoined: (player: JoinedPlayer) => void;
};
