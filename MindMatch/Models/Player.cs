namespace MindMatch.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string playerName { get; set; } = "";

        public string playerToken { get; set; } = "";
        public int sessionId { get; set; }

        public int score { get; set; } = 0;

        public bool answeredThisRound { get; set; } = false;

    }
}
