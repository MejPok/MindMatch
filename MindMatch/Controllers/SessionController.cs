using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMatch.Db;
using MindMatch.Models;
using System.Security.Cryptography;

namespace MindMatch.Controllers
{
    [ApiController]
    [Route("api/session")]
    public class SessionController : ControllerBase
    {
        public GameDbContext dbContext;
        public SessionController(GameDbContext context)
        {
            dbContext = context;
        }

        [HttpPost("newRoom")]
        public async Task<IActionResult> CreateNewRoom() //returns joincode for the new session
        {
            GameSession newSession = new GameSession();

            newSession.currentRoundIndex = 0;
            var random = new Random();
            newSession.joinCode = "" + random.Next(1000, 9999);
            newSession.sessionOwnerToken = "";


            dbContext.GameSessions.Add(newSession);

            await dbContext.SaveChangesAsync();

            for (int i = 0; i < 5; i++)
            {
                var round = new Round
                {
                    gameSessionId = newSession.gameSessionId,
                    playersAnswered = 0,
                    roundQuestion = $"question number {i}"
                };
                newSession.rounds.Add(round);
            }

            await dbContext.SaveChangesAsync();

            return Ok(newSession.joinCode);
        }

        [HttpPost("joinRoom/{joinCode}/{name}")]
        public async Task<IActionResult> CreateNewPlayer(string joinCode, string name) //creates player and joins a room, returns playerToken
        {
            var session = await dbContext.GameSessions
    .Include(s => s.joinedPlayers)
    .FirstOrDefaultAsync(x => x.joinCode == joinCode);

            if (session == null)
            {
                return NotFound();
            }

            if (!session.isSessionFull())
            {
                var player = new Player
                {
                    playerName = name,
                    playerToken = GeneratePlayerToken(),
                    sessionId = session.gameSessionId

                };


                if (session.joinedPlayers.Count() == 0)
                {
                    session.sessionOwnerToken = player.playerToken;
                }

                session.joinedPlayers.Add(player);

                await dbContext.SaveChangesAsync();

                return Ok(new { playerName = player.playerName, playerToken = player.playerToken, sessionId = session.gameSessionId });
            }

            return BadRequest("no such room");

        }



        [HttpPost("CreateQuestions/{sessionId}/{playerToken}")]
        public async Task<IActionResult> CreateRoundQuestions([FromQuery] int sessionId, [FromQuery] string playerToken, List<string> questionsForRounds) //allows owner to set the questions
        {
            var session = await dbContext.GameSessions
.Include(s => s.joinedPlayers)
.Include(s => s.rounds)
.FirstOrDefaultAsync(s => s.gameSessionId == sessionId);

            if (session == null)
            {
                return NotFound();
            }

            if (session.sessionOwnerToken == playerToken)
            {
                for(int i = 0; i < session.rounds.Count(); i++)
                {
                    session.rounds[i].roundQuestion = questionsForRounds[i];
                }
                

                await dbContext.SaveChangesAsync();

                return Ok();
            }

            return BadRequest("not an room owner");

        }


        [HttpGet]
        public async Task<IActionResult> GetSessionState([FromQuery] int sessionId, [FromQuery] string playerToken)
        {

            var session = await dbContext.GameSessions
.Include(s => s.joinedPlayers)
.Include(s => s.rounds)
.FirstOrDefaultAsync(s => s.gameSessionId == sessionId);

            if (session == null)
            {
                return BadRequest("no session found");
            }

            var joinedPlayer = session.joinedPlayers.FirstOrDefault(x => x.playerToken == playerToken);

            if (joinedPlayer == null)
            {
                return BadRequest($"no such player, player count {session.joinedPlayers.Count()}");
            }

            SessionState sessionState = new SessionState();
            sessionState.AmountOfPlayers = session.joinedPlayers.Count;
            sessionState.SessionStarted = session.sessionStarted;

            

            List<string> playerNames = new List<string>();
            foreach (var p in session.joinedPlayers)
            {
                playerNames.Add(p.playerName);
            }
            sessionState.playerNames = playerNames;

            if (session.sessionStarted == false)
            {
                return Ok(sessionState);
            }

            List<int> playerScores = new List<int>();
            foreach (var p in session.joinedPlayers)
            {
                playerScores.Add(p.score);
            }

            sessionState.playerScores = playerScores;

            if (session.currentRoundIndex >= session.rounds.Count())
            {
                sessionState.SessionEnded = true;
                return Ok(sessionState);
            }


            var currentRound = session.rounds[session.currentRoundIndex];

            sessionState.RoundIndex = session.currentRoundIndex;
            sessionState.RoundState = currentRound.state;
            sessionState.answeredQuestion = joinedPlayer.answeredThisRound;

            if (currentRound.state == RoundState.WaitingForAnswers || currentRound.state == RoundState.ShowingResults)
            {
                sessionState.RoundQuestion = currentRound.roundQuestion;
                sessionState.PlayersAnsweredQuestion = currentRound.playersAnswered;
            }





            

            return Ok(sessionState);


        }

        public static async Task CalculatePlayerScores(int sessionId, GameDbContext dbContext)
        {

            var session = await dbContext.GameSessions
    .Include(s => s.joinedPlayers)
    .Include(s => s.rounds)
    .ThenInclude(r => r.playerAnswers)
        .ThenInclude(a => a.playersThatAnsweredThis)
    .FirstOrDefaultAsync(s => s.gameSessionId == sessionId);

            for (int i = 0; i < session.joinedPlayers.Count(); i++)
            {
                var player = session.joinedPlayers[i];
                int currentScore = 0;

                var round = session.rounds[session.currentRoundIndex];
                foreach (var answer in round.playerAnswers)
                {
                    if (answer.playersThatAnsweredThis.Contains(player))
                    {
                        currentScore += answer.playersThatAnsweredThis.Count() - 1;
                    }
                }


                player.score += currentScore;
            }

            await dbContext.SaveChangesAsync();
        }

        [HttpPost]
        public async Task<IActionResult> StartRound([FromQuery] int sessionId, [FromQuery] string playerToken)
        {
            var session = await dbContext.GameSessions
            .Include(s => s.joinedPlayers)
            .Include(s => s.rounds)
            .FirstOrDefaultAsync(s => s.gameSessionId == sessionId);

            if (session.sessionOwnerToken != "")
            {
                if (session.sessionOwnerToken == playerToken)
                {

                    if(session.currentRoundIndex >= session.rounds.Count)
                    {
                        session.rounds[session.currentRoundIndex].state = RoundState.End;
                        await dbContext.SaveChangesAsync();

                        return Ok();
                    } 

                    
                    var currentRound = session.rounds[session.currentRoundIndex];

                    if (currentRound.state == RoundState.NotStarted)
                    {
                        currentRound.state = RoundState.WaitingForAnswers;
                        session.sessionStarted = true;
                    }
                    else if (currentRound.state == RoundState.WaitingForAnswers)
                    {
                        currentRound.state = RoundState.ShowingResults;
                        await ShowAnswersAndRecalculate(sessionId, dbContext);


                    }
                    else if (currentRound.state == RoundState.ShowingResults)
                    {


                        currentRound.state = RoundState.NotStarted;

                        foreach (var player in session.joinedPlayers)
                        {
                            player.answeredThisRound = false;
                        }

                        session.currentRoundIndex++;
                    }

                    await dbContext.SaveChangesAsync();

                    return Ok();

                }
                else
                {
                    return BadRequest("you are not the session owner");
                }
            }
            else
            {
                return BadRequest("no session owner");
            }
        }

        [HttpPost("answer")]
        public async Task<IActionResult> SubmitAnswer(Answer answer, [FromQuery] int sessionId, [FromQuery] string playerToken)
        {
            var session = await dbContext.GameSessions
            .Include(s => s.joinedPlayers)
            .Include(s => s.rounds)
                .ThenInclude(r => r.playerAnswers)
                    .ThenInclude(a => a.playersThatAnsweredThis)
            .FirstOrDefaultAsync(s => s.gameSessionId == sessionId);

            if (session == null)
                return NotFound("No session found.");

            if (session.currentRoundIndex >= session.rounds.Count)
                return BadRequest("No current round.");

            var currentRound = session.rounds[session.currentRoundIndex];

            if (currentRound.state == RoundState.WaitingForAnswers)
            {
                var player = session.joinedPlayers.FirstOrDefault(x => x.playerToken == playerToken);
                if (player != null)
                {
                    if (player.answeredThisRound == false)
                    {
                        player.answeredThisRound = true;

                        var foundAnswer = currentRound.playerAnswers.FirstOrDefault(x => x.submittedAnswer == answer.submittedAnswer);

                        if (foundAnswer != null)
                        {
                            foundAnswer.playersThatAnsweredThis.Add(player);
                        }
                        else
                        {
                            answer.playersThatAnsweredThis.Add(player);
                            currentRound.playerAnswers.Add(answer);
                        }

                        currentRound.playersAnswered++;

                        if (currentRound.playersAnswered >= session.joinedPlayers.Count)
                        {
                            await dbContext.SaveChangesAsync();

                            await ShowAnswersAndRecalculate(sessionId, dbContext);


                        }


                    }


                    await dbContext.SaveChangesAsync();


                    return Ok("answered");
                }
            }
            return BadRequest("bad request");
        }



        [HttpGet("answer")]
        public async Task<IActionResult> GetAllAnswers([FromQuery] int sessionId, [FromQuery] string playerToken)
        {
            var session = await dbContext.GameSessions
        .Include(s => s.joinedPlayers)
        .Include(s => s.rounds)
        .ThenInclude(r => r.playerAnswers)
        .FirstOrDefaultAsync(s => s.gameSessionId == sessionId);

            var currentRound = session.rounds[session.currentRoundIndex];

            if (currentRound.state == RoundState.ShowingResults)
            {
                var player = session.joinedPlayers.FirstOrDefault(x => x.playerToken == playerToken);
                if (player != null)
                {
                    return Ok(currentRound.playerAnswers);
                }
            }
            return BadRequest("bad request");

        }



        public static string GeneratePlayerToken()
        {
            byte[] tokenBytes = RandomNumberGenerator.GetBytes(32);

            return Convert.ToBase64String(tokenBytes);
        }

        public static async Task ShowAnswersAndRecalculate(int sessionId, GameDbContext dbContext)
        {
            var session = await dbContext.GameSessions.FirstOrDefaultAsync(s => s.gameSessionId == sessionId);

            if (session.currentRoundIndex <= session.calculatedRoundIndex)
            {
                return;
            }

            session.rounds[session.currentRoundIndex].state = RoundState.ShowingResults;

            session.calculatedRoundIndex = session.currentRoundIndex;

            await dbContext.SaveChangesAsync();

            await CalculatePlayerScores(sessionId, dbContext);
        }



    }
}
