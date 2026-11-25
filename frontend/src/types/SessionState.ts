export interface SessionState {
    amountOfPlayers: number;
    sessionStarted: boolean;
    sessionEnded: boolean;
    roomCode: string;
    playerNames: string[];

    playerScores?: number[];

    roundIndex?: number;
    roundState?: number;
    answeredQuestion?: boolean;
    roundQuestion?: string;
    playersAnsweredQuestion?: number;
}