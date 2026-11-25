import type { RoundInfo, JoinedPlayer } from '../types';

export type GameProps = {
    roundInfo: RoundInfo;
    setRoundInfo: (value: RoundInfo) => void;
    player: JoinedPlayer;
    setPlayer: (player: JoinedPlayer | null) => void;
};