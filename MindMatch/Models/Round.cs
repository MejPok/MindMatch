namespace MindMatch.Models
{
    public class Round
    {
        public int roundId { get; set; }
        public int gameSessionId { get; set; }

        public int playersAnswered { get; set; }

        public List<Answer> playerAnswers { get; set; } = new List<Answer>();
        public RoundState state { get; set; } = RoundState.NotStarted;

        public string roundQuestion { get; set; }
    }

    public enum RoundState
    {
        NotStarted,
        WaitingForAnswers,
        ShowingResults,

    }
}
