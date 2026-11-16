# MindMatch

ASP.net learning project to learn about backend and frontend programming.
It was mostly an easy but complete project so I can start properly learning ASP and actually create projects.

The project is about players getting into a owners room, and then guession the words based on the questions set by the owner of the room.
The players that get the same answer get points based on how many players answered that way. There are five rounds to which the questions are set by the owner at the creating room phase.

How to play:
Choose your name

Create your room

Choose your five questions for this session.

Wait for others to join using the room code.

Start the game by using the next phase button as an owner.

Answer the questions the same as other players to gain points.

Enjoy guessing their answers


To try the app simply go to the page: https://mindmatch-lukasprogram.runasp.net
Expect bugs and things to be placeholders, however the main thing is it works somehow.
Please be mindful of how you use the app as not to crash the server, it is hosted on a free monsterasp hosting.

To build the app yourself:

# Restore packages
dotnet restore

# Build a Release version
dotnet build --configuration Release

# Run locally with the HTTPS launch profile
dotnet run --launch-profile https

# Create deployment files
dotnet publish MindMatch.csproj --configuration Release --output ./publish
