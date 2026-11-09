namespace MindMatch.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public List<Player> playersThatAnsweredThis { get; set; } = new List<Player>();

        public string submittedAnswer { get; set; } = "";
    }
}
