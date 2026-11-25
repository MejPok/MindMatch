export type JoinedPlayer = {
  playerName: string;
  playerToken: string;
  sessionId: number;
  roomCode: string;
  isSessionOwner: boolean;
  score: number;
};