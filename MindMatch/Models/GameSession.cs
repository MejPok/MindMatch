using MindMatch.Db;

namespace MindMatch.Models
{
    public class GameSession
    {
        public int gameSessionId { get; set; }

        public int maxAmountOfPlayers { get; set; } = 2;

        public string joinCode { get; set; } = "";


        public List<Player> joinedPlayers { get; set; } = new List<Player>();
        public List<Round> rounds { get; set; } = new List<Round>();

        public Player? sessionOwner { get; set; }
        public int currentRoundIndex { get; set; } = 0;

        public bool sessionStarted { get; set; } = false;

        public bool isSessionFull()
        {
            if(joinedPlayers.Count >= maxAmountOfPlayers)
            {
                return true;
            }
            return false;
        }
    }
}
