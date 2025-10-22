// Calculate standings from teams and matches
export function calculateStandings(teams, matches) {
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
}

// Generate round-robin matches
export function generateRoundRobinMatches(numTeams) {
  const matches = [];
  for (let i = 0; i < numTeams; i++) {
    for (let j = i + 1; j < numTeams; j++) {
      matches.push({
        team1: i,
        team2: j,
        score1: "",
        score2: "",
      });
    }
  }
  return matches;
}

// Initialize teams
export function initializeTeams(count) {
  const teams = [];
  for (let i = 1; i <= count; i++) {
    teams.push({
      id: i,
      name: `Team ${i}`,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    });
  }
  return teams;
}

// Get winner class for CSS
export function getWinnerClass(match) {
  if (match.score1 && match.score2) {
    const s1 = parseInt(match.score1);
    const s2 = parseInt(match.score2);
    if (s1 > s2) return "winner-1";
    if (s2 > s1) return "winner-2";
  }
  return "";
}

// Get playoff winner (1, 2, or null)
export function getPlayoffWinner(match) {
  if (match.score1 && match.score2) {
    const s1 = parseInt(match.score1);
    const s2 = parseInt(match.score2);
    if (s1 > s2) return 1;
    if (s2 > s1) return 2;
  }
  return null;
}

// Calculate point differential
export function calculateDifferential(pointsFor, pointsAgainst) {
  return pointsFor - pointsAgainst;
}

// Get semifinal winner name
export function getSemifinalWinner(playoffMatch, sortedTeams, seeds) {
  const winner = getPlayoffWinner(playoffMatch);
  if (winner === 1) return sortedTeams[seeds[0]]?.name || "TBD";
  if (winner === 2) return sortedTeams[seeds[1]]?.name || "TBD";
  return null;
}