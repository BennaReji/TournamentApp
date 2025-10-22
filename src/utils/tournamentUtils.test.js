import { describe, it, expect, test } from 'vitest'
import {
  calculateStandings,
  generateRoundRobinMatches,
  initializeTeams,
  getWinnerClass,
  getPlayoffWinner,
  calculateDifferential,
} from './tournamentUtils'

describe('Tournament Utils - White Box Unit Tests', () => {
  
  // ========== initializeTeams Tests ==========
  describe('initializeTeams', () => {
    it('should create 4 teams by default', () => {
      const teams = initializeTeams(4)
      expect(teams).toHaveLength(4)
    })

    it('should create 5 teams', () => {
      const teams = initializeTeams(5)
      expect(teams).toHaveLength(5)
    })

    it('should create 6 teams', () => {
      const teams = initializeTeams(6)
      expect(teams).toHaveLength(6)
    })

    it('should initialize teams with correct structure', () => {
      const teams = initializeTeams(3)
      expect(teams[0]).toEqual({
        id: 1,
        name: 'Team 1',
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
      })
    })

    it('should assign sequential IDs starting from 1', () => {
      const teams = initializeTeams(4)
      teams.forEach((team, index) => {
        expect(team.id).toBe(index + 1)
        expect(team.name).toBe(`Team ${index + 1}`)
      })
    })

    it('should initialize all teams with zero stats', () => {
      const teams = initializeTeams(5)
      teams.forEach((team) => {
        expect(team.wins).toBe(0)
        expect(team.losses).toBe(0)
        expect(team.pointsFor).toBe(0)
        expect(team.pointsAgainst).toBe(0)
      })
    })

    it('should handle edge case of 1 team', () => {
      const teams = initializeTeams(1)
      expect(teams).toHaveLength(1)
      expect(teams[0].id).toBe(1)
    })
  })

  // ========== generateRoundRobinMatches Tests ==========
  describe('generateRoundRobinMatches', () => {
    it('should generate 6 matches for 4 teams (4C2)', () => {
      const matches = generateRoundRobinMatches(4)
      expect(matches).toHaveLength(6)
    })

    it('should generate 10 matches for 5 teams (5C2)', () => {
      const matches = generateRoundRobinMatches(5)
      expect(matches).toHaveLength(10)
    })

    it('should generate 15 matches for 6 teams (6C2)', () => {
      const matches = generateRoundRobinMatches(6)
      expect(matches).toHaveLength(15)
    })

    it('should initialize all matches with empty scores', () => {
      const matches = generateRoundRobinMatches(4)
      matches.forEach((match) => {
        expect(match.score1).toBe('')
        expect(match.score2).toBe('')
      })
    })

    it('should create unique matchups (no duplicates)', () => {
      const matches = generateRoundRobinMatches(4)
      const matchups = matches.map(m => `${m.team1}-${m.team2}`)
      const uniqueMatchups = new Set(matchups)
      expect(matchups.length).toBe(uniqueMatchups.size)
    })

    it('should never match team with itself', () => {
      const matches = generateRoundRobinMatches(5)
      matches.forEach((match) => {
        expect(match.team1).not.toBe(match.team2)
      })
    })

    it('should always have team1 < team2', () => {
      const matches = generateRoundRobinMatches(6)
      matches.forEach((match) => {
        expect(match.team1).toBeLessThan(match.team2)
      })
    })

    it('should generate correct matchups for 3 teams', () => {
      const matches = generateRoundRobinMatches(3)
      expect(matches).toHaveLength(3)
      expect(matches).toEqual([
        { team1: 0, team2: 1, score1: '', score2: '' },
        { team1: 0, team2: 2, score1: '', score2: '' },
        { team1: 1, team2: 2, score1: '', score2: '' },
      ])
    })
  })

  // ========== getWinnerClass Tests ==========
  describe('getWinnerClass', () => {
    it('should return "winner-1" when team 1 wins', () => {
      const match = { score1: '30', score2: '20' }
      expect(getWinnerClass(match)).toBe('winner-1')
    })

    it('should return "winner-2" when team 2 wins', () => {
      const match = { score1: '15', score2: '25' }
      expect(getWinnerClass(match)).toBe('winner-2')
    })

    it('should return empty string for tie', () => {
      const match = { score1: '20', score2: '20' }
      expect(getWinnerClass(match)).toBe('')
    })

    it('should return empty string when scores are empty', () => {
      const match = { score1: '', score2: '' }
      expect(getWinnerClass(match)).toBe('')
    })

    it('should return empty string when only one score is entered', () => {
      const match1 = { score1: '10', score2: '' }
      const match2 = { score1: '', score2: '10' }
      expect(getWinnerClass(match1)).toBe('')
      expect(getWinnerClass(match2)).toBe('')
    })

    it('should handle string numbers correctly', () => {
      const match = { score1: '100', score2: '99' }
      expect(getWinnerClass(match)).toBe('winner-1')
    })

    it('should handle large score differences', () => {
      const match = { score1: '150', score2: '50' }
      expect(getWinnerClass(match)).toBe('winner-1')
    })
  })

  // ========== calculateDifferential Tests ==========
  describe('calculateDifferential', () => {
    it('should calculate positive differential', () => {
      expect(calculateDifferential(50, 30)).toBe(20)
    })

    it('should calculate negative differential', () => {
      expect(calculateDifferential(30, 50)).toBe(-20)
    })

    it('should return 0 for equal scores', () => {
      expect(calculateDifferential(40, 40)).toBe(0)
    })

    it('should handle zero values', () => {
      expect(calculateDifferential(0, 0)).toBe(0)
      expect(calculateDifferential(10, 0)).toBe(10)
      expect(calculateDifferential(0, 10)).toBe(-10)
    })

    it('should handle large numbers', () => {
      expect(calculateDifferential(1000, 500)).toBe(500)
    })
  })

  // ========== getPlayoffWinner Tests ==========
  describe('getPlayoffWinner', () => {
    it('should return 1 when team 1 wins', () => {
      const match = { score1: '55', score2: '50' }
      expect(getPlayoffWinner(match)).toBe(1)
    })

    it('should return 2 when team 2 wins', () => {
      const match = { score1: '48', score2: '52' }
      expect(getPlayoffWinner(match)).toBe(2)
    })

    it('should return null for tie', () => {
      const match = { score1: '50', score2: '50' }
      expect(getPlayoffWinner(match)).toBeNull()
    })

    it('should return null when scores are empty', () => {
      const match = { score1: '', score2: '' }
      expect(getPlayoffWinner(match)).toBeNull()
    })

    it('should return null when only one score exists', () => {
      const match1 = { score1: '60', score2: '' }
      const match2 = { score1: '', score2: '60' }
      expect(getPlayoffWinner(match1)).toBeNull()
      expect(getPlayoffWinner(match2)).toBeNull()
    })
  })

  // ========== calculateStandings Tests (Complex Logic) ==========
  describe('calculateStandings', () => {
    it('should sort teams by wins (descending)', () => {
      const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
      ]
      const matches = [
        { team1: 0, team2: 1, score1: '30', score2: '20' },
      ]

      const standings = calculateStandings(teams, matches)

      expect(standings[0].name).toBe('Team A')
      expect(standings[0].wins).toBe(1)
      expect(standings[1].name).toBe('Team B')
      expect(standings[1].wins).toBe(0)
      expect(standings[1].losses).toBe(1)
    })

    it('should calculate points for and against correctly', () => {
      const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
      ]
      const matches = [
        { team1: 0, team2: 1, score1: '50', score2: '30' },
      ]

      const standings = calculateStandings(teams, matches)

      expect(standings[0].pointsFor).toBe(50)
      expect(standings[0].pointsAgainst).toBe(30)
      expect(standings[1].pointsFor).toBe(30)
      expect(standings[1].pointsAgainst).toBe(50)
    })

    it('should sort by differential when wins are equal', () => {
      const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
        { id: 3, name: 'Team C' },
      ]
      const matches = [
        { team1: 0, team2: 1, score1: '50', score2: '40' }, // A wins by 10
        { team1: 2, team2: 1, score1: '60', score2: '30' }, // C wins by 30
      ]

      const standings = calculateStandings(teams, matches)

      // Both A and C have 1 win, but C has better differential
      expect(standings[0].name).toBe('Team C')
      expect(standings[0].wins).toBe(1)
      expect(standings[1].name).toBe('Team A')
      expect(standings[1].wins).toBe(1)
    })

    it('should handle ties correctly (no winner)', () => {
      const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
      ]
      const matches = [
        { team1: 0, team2: 1, score1: '20', score2: '20' },
      ]

      const standings = calculateStandings(teams, matches)

      expect(standings[0].wins).toBe(0)
      expect(standings[0].losses).toBe(0)
      expect(standings[1].wins).toBe(0)
      expect(standings[1].losses).toBe(0)
    })

    it('should ignore matches without complete scores', () => {
      const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
      ]
      const matches = [
        { team1: 0, team2: 1, score1: '', score2: '' },
        { team1: 0, team2: 1, score1: '10', score2: '' },
      ]

      const standings = calculateStandings(teams, matches)

      expect(standings[0].wins).toBe(0)
      expect(standings[0].pointsFor).toBe(0)
      expect(standings[1].wins).toBe(0)
      expect(standings[1].pointsFor).toBe(0)
    })

    it('should handle multiple matches correctly', () => {
      const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
        { id: 3, name: 'Team C' },
      ]
      const matches = [
        { team1: 0, team2: 1, score1: '30', score2: '20' }, // A wins
        { team1: 0, team2: 2, score1: '40', score2: '25' }, // A wins
        { team1: 1, team2: 2, score1: '35', score2: '30' }, // B wins
      ]

      const standings = calculateStandings(teams, matches)

      expect(standings[0].name).toBe('Team A')
      expect(standings[0].wins).toBe(2)
      expect(standings[0].losses).toBe(0)

      expect(standings[1].name).toBe('Team B')
      expect(standings[1].wins).toBe(1)
      expect(standings[1].losses).toBe(1)

      expect(standings[2].name).toBe('Team C')
      expect(standings[2].wins).toBe(0)
      expect(standings[2].losses).toBe(2)
    })

    it('should accumulate points across multiple matches', () => {
      const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
      ]
      const matches = [
        { team1: 0, team2: 1, score1: '30', score2: '20' },
        { team1: 0, team2: 1, score1: '40', score2: '35' },
      ]

      const standings = calculateStandings(teams, matches)

      expect(standings[0].pointsFor).toBe(70) // 30 + 40
      expect(standings[0].pointsAgainst).toBe(55) // 20 + 35
      expect(standings[1].pointsFor).toBe(55) // 20 + 35
      expect(standings[1].pointsAgainst).toBe(70) // 30 + 40
    })

    it('should handle complex 4-team scenario', () => {
      const teams = initializeTeams(4)
      const matches = [
        { team1: 0, team2: 1, score1: '50', score2: '40' }, // T1 wins
        { team1: 0, team2: 2, score1: '60', score2: '55' }, // T1 wins
        { team1: 0, team2: 3, score1: '45', score2: '50' }, // T4 wins
        { team1: 1, team2: 2, score1: '70', score2: '60' }, // T2 wins
        { team1: 1, team2: 3, score1: '55', score2: '50' }, // T2 wins
        { team1: 2, team2: 3, score1: '65', score2: '60' }, // T3 wins
      ]

      const standings = calculateStandings(teams, matches)

      // Team 1: 2 wins, Team 2: 2 wins, Team 3: 1 win, Team 4: 1 win
      expect(standings[0].wins).toBeGreaterThanOrEqual(1)
      expect(standings.every(team => team.wins + team.losses <= 3)).toBe(true)
    })

    it('should preserve team data while calculating stats', () => {
      const teams = [
        { id: 1, name: 'Warriors', customProp: 'test' },
        { id: 2, name: 'Lakers', customProp: 'test2' },
      ]
      const matches = [
        { team1: 0, team2: 1, score1: '30', score2: '20' },
      ]

      const standings = calculateStandings(teams, matches)

      expect(standings[0].id).toBe(1)
      expect(standings[0].name).toBe('Warriors')
      expect(standings[0].customProp).toBe('test')
    })
  })

  // ========== Edge Cases ==========
  describe('Edge Cases', () => {
    it('should handle zero teams', () => {
      const teams = initializeTeams(0)
      expect(teams).toHaveLength(0)
    })

    it('should handle empty matches array', () => {
      const teams = initializeTeams(4)
      const standings = calculateStandings(teams, [])
      
      expect(standings).toHaveLength(4)
      standings.forEach(team => {
        expect(team.wins).toBe(0)
        expect(team.losses).toBe(0)
      })
    })

    it('should handle very large scores', () => {
      const match = { score1: '9999', score2: '9998' }
      expect(getWinnerClass(match)).toBe('winner-1')
    })

    it('should handle negative differential correctly', () => {
      const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
      ]
      const matches = [
        { team1: 0, team2: 1, score1: '10', score2: '50' },
      ]

      const standings = calculateStandings(teams, matches)
      const loser = standings.find(t => t.name === 'Team A')
      
      expect(loser.pointsFor - loser.pointsAgainst).toBe(-40)
    })
  })
  
})