using System.Net;

namespace MindMatch.Models
{
    public class SessionState
    {
        public bool SessionStarted { get; set; } = true;
        public bool SessionEnded { get; set; } = false;

        public int AmountOfPlayers { get; set; }
        public RoundState RoundState { get; set; }
        public string RoundQuestion { get; set; }
        public int RoundIndex { get; set; }
        public int PlayersAnsweredQuestion { get; set; }
        public bool answeredQuestion { get; set; } = false;

        public List<string> playerNames { get; set; }
        public List<int> playerScores { get; set; }
    }
}
