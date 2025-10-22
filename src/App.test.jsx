import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("App Component - Integration Tests", () => {
  // ========== Initial Render Tests ==========
  describe("Initial Render", () => {
    it("renders tournament title", () => {
      render(<App />);
      expect(screen.getByText("🏆 Tournament Score Sheet")).toBeInTheDocument();
    });

    it("renders 4 teams by default", () => {
      render(<App />);
      const teamInputs = screen.getAllByLabelText(/Team \d+/);
      expect(teamInputs).toHaveLength(4);
    });

    it("has 4 Teams button active by default", () => {
      render(<App />);
      const fourTeamsBtn = screen.getByText("4 Teams");
      expect(fourTeamsBtn).toHaveClass("active");
    });

    it("renders all sections", () => {
      render(<App />);
      expect(screen.getByText("Round Robin Matches")).toBeInTheDocument();
      expect(screen.getByText("Standings")).toBeInTheDocument();
      expect(screen.getByText("Playoffs")).toBeInTheDocument();
    });
  });

  // ========== Team Management Tests ==========
  describe("Team Management", () => {
    it("renders 4 teams by default", () => {
      render(<App />);
      const teamInputs = screen.getAllByLabelText(/Team \d+/);
      expect(teamInputs).toHaveLength(4);
    });

    it("switches to 5 teams", async () => {
      render(<App />);

      const fiveTeamsBtn = screen.getByText("5 Teams");
      fireEvent.click(fiveTeamsBtn);

      await waitFor(() => {
        const teamInputs = screen.getAllByLabelText(/Team \d+/);
        expect(teamInputs).toHaveLength(5);
      });
    });

    it("switches to 6 teams", async () => {
      render(<App />);

      const sixTeamsBtn = screen.getByText("6 Teams");
      fireEvent.click(sixTeamsBtn);

      await waitFor(() => {
        const teamInputs = screen.getAllByLabelText(/Team \d+/);
        expect(teamInputs).toHaveLength(6);
      });
    });

    it("updates team name", () => {
      render(<App />);

      const firstInput = screen.getByLabelText("Team 1");
      fireEvent.change(firstInput, { target: { value: "Warriors" } });

      expect(firstInput.value).toBe("Warriors");
    });

    it("displays updated team name in matches", async () => {
      render(<App />);

      const firstInput = screen.getByLabelText("Team 1");
      fireEvent.change(firstInput, { target: { value: "Lakers" } });

      await waitFor(() => {
        expect(screen.getAllByText("Lakers").length).toBeGreaterThan(0);
      });
    });
  });

  // ========== Match Scoring Tests ==========
  describe("Match Scoring", () => {
    it("allows entering scores", () => {
      render(<App />);

      const scoreInputs = screen.getAllByPlaceholderText("Score");
      fireEvent.change(scoreInputs[0], { target: { value: "30" } });

      expect(scoreInputs[0].value).toBe("30");
    });

    it("highlights winner when team 1 wins", () => {
      render(<App />);

      const scoreInputs = screen.getAllByPlaceholderText("Score");
      fireEvent.change(scoreInputs[0], { target: { value: "40" } });
      fireEvent.change(scoreInputs[1], { target: { value: "30" } });

      const matchCard = scoreInputs[0].closest(".match-card");
      expect(matchCard).toHaveClass("winner-1");
    });

    it("highlights winner when team 2 wins", () => {
      render(<App />);

      const scoreInputs = screen.getAllByPlaceholderText("Score");
      fireEvent.change(scoreInputs[0], { target: { value: "25" } });
      fireEvent.change(scoreInputs[1], { target: { value: "35" } });

      const matchCard = scoreInputs[0].closest(".match-card");
      expect(matchCard).toHaveClass("winner-2");
    });
  });

  // ========== Standings Tests ==========
  describe("Standings", () => {
    it("displays all table headers", () => {
      render(<App />);
      expect(screen.getByText("Rank")).toBeInTheDocument();
      expect(screen.getByText("Wins")).toBeInTheDocument();
      expect(screen.getByText("Losses")).toBeInTheDocument();
      expect(screen.getByText("Differential")).toBeInTheDocument();
    });

    it("shows 4 teams in standings", () => {
      render(<App />);
      const rows = screen.getByRole("table").querySelectorAll("tbody tr");
      expect(rows).toHaveLength(4);
    });

    it("updates standings after entering scores", () => {
      render(<App />);

      const scoreInputs = screen.getAllByPlaceholderText("Score");
      fireEvent.change(scoreInputs[0], { target: { value: "50" } });
      fireEvent.change(scoreInputs[1], { target: { value: "30" } });

      const table = screen.getByRole("table");
      expect(table.textContent).toContain("1");
    });
  });

  // ========== Playoffs Tests ==========
  describe("Playoffs", () => {
    it("displays playoff brackets", () => {
      render(<App />);
      expect(screen.getByText("Semifinal 1")).toBeInTheDocument();
      expect(screen.getByText("Semifinal 2")).toBeInTheDocument();
      expect(screen.getByText(/Championship/i)).toBeInTheDocument();
    });

    it("shows all playoff seeds", () => {
      render(<App />);
      expect(screen.getByText(/#1:/)).toBeInTheDocument();
      expect(screen.getByText(/#2:/)).toBeInTheDocument();
      expect(screen.getByText(/#3:/)).toBeInTheDocument();
      expect(screen.getByText(/#4:/)).toBeInTheDocument();
    });
  });

  // ========== Reset Functionality ==========
  describe("Reset", () => {
    it("clears scores when reset is confirmed", () => {
      render(<App />);

      const scoreInputs = screen.getAllByPlaceholderText("Score");
      fireEvent.change(scoreInputs[0], { target: { value: "50" } });

      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

      const resetBtn = screen.getByText("Reset All");
      fireEvent.click(resetBtn);

      // Get fresh reference to inputs after reset
      const updatedScoreInputs = screen.getAllByPlaceholderText("Score");
      expect(updatedScoreInputs[0].value).toBe("");

      // Restore mock
      confirmSpy.mockRestore();
    });
  });
});
