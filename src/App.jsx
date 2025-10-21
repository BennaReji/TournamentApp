import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [numTeams, setNumTeams] = useState(4);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [playoffMatches, setPlayoffMatches] = useState({
    semifinal1: { score1: "", score2: "" },
    semifinal2: { score1: "", score2: "" },
    championship: { score1: "", score2: "" },
  });

  // Initialize tournament when numTeams changes
  useEffect(() => {
    initializeTournament();
  }, [numTeams]);

  const initializeTournament = () => {
    const newTeams = [];
    for (let i = 1; i <= numTeams; i++) {
      newTeams.push({
        id: i,
        name: `Team ${i}`,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
      });
    }
    setTeams(newTeams);

    // Generate round-robin matches
    const newMatches = [];
    for (let i = 0; i < newTeams.length; i++) {
      for (let j = i + 1; j < newTeams.length; j++) {
        newMatches.push({
          team1: i,
          team2: j,
          score1: "",
          score2: "",
        });
      }
    }
    setMatches(newMatches);

    // Reset playoff matches
    setPlayoffMatches({
      semifinal1: { score1: "", score2: "" },
      semifinal2: { score1: "", score2: "" },
      championship: { score1: "", score2: "" },
    });
  };

  const updateTeamName = (index, name) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  };

  const updateScore = (matchIndex, team, value) => {
    const newMatches = [...matches];
    if (team === 1) {
      newMatches[matchIndex].score1 = value;
    } else {
      newMatches[matchIndex].score2 = value;
    }
    setMatches(newMatches);
  };

  const updatePlayoffScore = (matchType, team, value) => {
    setPlayoffMatches((prev) => ({
      ...prev,
      [matchType]: {
        ...prev[matchType],
        [team === 1 ? "score1" : "score2"]: value,
      },
    }));
  };

  const calculateStandings = () => {
    const calculatedTeams = teams.map((team) => ({
      ...team,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    }));

    matches.forEach((match) => {
      if (match.score1 && match.score2) {
        const s1 = parseInt(match.score1);
        const s2 = parseInt(match.score2);

        calculatedTeams[match.team1].pointsFor += s1;
        calculatedTeams[match.team1].pointsAgainst += s2;
        calculatedTeams[match.team2].pointsFor += s2;
        calculatedTeams[match.team2].pointsAgainst += s1;

        if (s1 > s2) {
          calculatedTeams[match.team1].wins++;
          calculatedTeams[match.team2].losses++;
        } else if (s2 > s1) {
          calculatedTeams[match.team2].wins++;
          calculatedTeams[match.team1].losses++;
        }
      }
    });

    return calculatedTeams.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      const diffA = a.pointsFor - a.pointsAgainst;
      const diffB = b.pointsFor - b.pointsAgainst;
      return diffB - diffA;
    });
  };

  const sortedTeams = calculateStandings();

  const getWinnerClass = (match) => {
    if (match.score1 && match.score2) {
      const s1 = parseInt(match.score1);
      const s2 = parseInt(match.score2);
      if (s1 > s2) return "winner-1";
      if (s2 > s1) return "winner-2";
    }
    return "";
  };

  const getPlayoffWinner = (match) => {
    if (match.score1 && match.score2) {
      const s1 = parseInt(match.score1);
      const s2 = parseInt(match.score2);
      if (s1 > s2) return 1;
      if (s2 > s1) return 2;
    }
    return null;
  };

  const getSemifinal1Winner = () => {
    const winner = getPlayoffWinner(playoffMatches.semifinal1);
    if (winner === 1) return sortedTeams[0]?.name || "TBD";
    if (winner === 2) return sortedTeams[3]?.name || "TBD";
    return "Winner SF1";
  };

  const getSemifinal2Winner = () => {
    const winner = getPlayoffWinner(playoffMatches.semifinal2);
    if (winner === 1) return sortedTeams[1]?.name || "TBD";
    if (winner === 2) return sortedTeams[2]?.name || "TBD";
    return "Winner SF2";
  };

  const getChampion = () => {
    const winner = getPlayoffWinner(playoffMatches.championship);
    if (winner === 1) return getSemifinal1Winner();
    if (winner === 2) return getSemifinal2Winner();
    return null;
  };

  const resetTournament = () => {
    if (window.confirm("Are you sure you want to reset all scores?")) {
      initializeTournament();
    }
  };

  const champion = getChampion();

  return (
    <div className="container">
      <h1>🏆 Tournament Score Sheet</h1>

      <div className="setup-section">
        <div className="setup-header">
          <div className="team-toggle">
            <button
              className={numTeams === 4 ? "active" : ""}
              onClick={() => setNumTeams(4)}
            >
              4 Teams
            </button>
            <button
              className={numTeams === 5 ? "active" : ""}
              onClick={() => setNumTeams(5)}
            >
              5 Teams
            </button>
            <button
              className={numTeams === 6 ? "active" : ""}
              onClick={() => setNumTeams(6)}
            >
              6 Teams
            </button>
          </div>
          <button className="reset-btn" onClick={resetTournament}>
            Reset All
          </button>
        </div>

        <div className="team-inputs">
          {teams.map((team, index) => (
            <div key={team.id} className="team-input">
              <label>Team {index + 1}</label>
              <input
                type="text"
                value={team.name}
                onChange={(e) => updateTeamName(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="matches-section">
        <h2>Round Robin Matches</h2>
        <div className="matches">
          {matches.map((match, index) => (
            <div key={index} className={`match-card ${getWinnerClass(match)}`}>
              <div className="team-section team-1">
                <div className="team-name">{teams[match.team1].name}</div>
                <input
                  type="number"
                  className="score-input"
                  value={match.score1}
                  onChange={(e) => updateScore(index, 1, e.target.value)}
                  placeholder="Score"
                />
              </div>
              <div className="vs">VS</div>
              <div className="team-section team-2">
                <div className="team-name">{teams[match.team2].name}</div>
                <input
                  type="number"
                  className="score-input"
                  value={match.score2}
                  onChange={(e) => updateScore(index, 2, e.target.value)}
                  placeholder="Score"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="standings-section">
        <h2>Standings</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Points For</th>
              <th>Points Against</th>
              <th>Differential</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => {
              const diff = team.pointsFor - team.pointsAgainst;
              return (
                <tr key={team.id}>
                  <td>
                    <strong>{index + 1}</strong>
                  </td>
                  <td>
                    <strong>{team.name}</strong>
                  </td>
                  <td>{team.wins}</td>
                  <td>{team.losses}</td>
                  <td>{team.pointsFor}</td>
                  <td>{team.pointsAgainst}</td>
                  <td style={{ color: diff >= 0 ? "#28a745" : "#dc3545" }}>
                    {diff > 0 ? "+" : ""}
                    {diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="playoffs-section">
        <h2>Playoffs</h2>

        {champion && (
          <div className="champion-banner">
            🏆 <strong>CHAMPION:</strong> {champion} 🏆
          </div>
        )}

        <div
          className={`playoff-match ${getWinnerClass(
            playoffMatches.semifinal1
          )}`}
        >
          <h3>Semifinal 1</h3>
          <div className="playoff-game">
            <div className="team-section team-1">
              <div className="team-name">
                #1: {sortedTeams[0]?.name || "TBD"}
              </div>
              <input
                type="number"
                className="score-input"
                value={playoffMatches.semifinal1.score1}
                onChange={(e) =>
                  updatePlayoffScore("semifinal1", 1, e.target.value)
                }
                placeholder="Score"
              />
            </div>
            <div className="vs">VS</div>
            <div className="team-section team-2">
              <div className="team-name">
                #4: {sortedTeams[3]?.name || "TBD"}
              </div>
              <input
                type="number"
                className="score-input"
                value={playoffMatches.semifinal1.score2}
                onChange={(e) =>
                  updatePlayoffScore("semifinal1", 2, e.target.value)
                }
                placeholder="Score"
              />
            </div>
          </div>
        </div>

        <div
          className={`playoff-match ${getWinnerClass(
            playoffMatches.semifinal2
          )}`}
        >
          <h3>Semifinal 2</h3>
          <div className="playoff-game">
            <div className="team-section team-1">
              <div className="team-name">
                #2: {sortedTeams[1]?.name || "TBD"}
              </div>
              <input
                type="number"
                className="score-input"
                value={playoffMatches.semifinal2.score1}
                onChange={(e) =>
                  updatePlayoffScore("semifinal2", 1, e.target.value)
                }
                placeholder="Score"
              />
            </div>
            <div className="vs">VS</div>
            <div className="team-section team-2">
              <div className="team-name">
                #3: {sortedTeams[2]?.name || "TBD"}
              </div>
              <input
                type="number"
                className="score-input"
                value={playoffMatches.semifinal2.score2}
                onChange={(e) =>
                  updatePlayoffScore("semifinal2", 2, e.target.value)
                }
                placeholder="Score"
              />
            </div>
          </div>
        </div>

        <div
          className={`playoff-match championship-match ${getWinnerClass(
            playoffMatches.championship
          )}`}
        >
          <h3>🏆 Championship</h3>
          <div className="playoff-game">
            <div className="team-section team-1">
              <div className="team-name">{getSemifinal1Winner()}</div>
              <input
                type="number"
                className="score-input"
                value={playoffMatches.championship.score1}
                onChange={(e) =>
                  updatePlayoffScore("championship", 1, e.target.value)
                }
                placeholder="Score"
              />
            </div>
            <div className="vs">VS</div>
            <div className="team-section team-2">
              <div className="team-name">{getSemifinal2Winner()}</div>
              <input
                type="number"
                className="score-input"
                value={playoffMatches.championship.score2}
                onChange={(e) =>
                  updatePlayoffScore("championship", 2, e.target.value)
                }
                placeholder="Score"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
