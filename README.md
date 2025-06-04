# Gomoku Game
![Gomoku](https://github.com/user-attachments/assets/3889f205-7af6-4d5a-a62b-f6673bf0cb80)

This is a static HTML/CSS/JS Gomoku (五子棋) game that supports both two-player (雙人對戰) mode and AI battle (AI 對戰) mode with an adjustable AI difficulty. The game is fully responsive and automatically adapts to different devices and window sizes.

## Features

- **Responsive Design**: Constructed with CSS Grid and media queries to work perfectly on desktops, tablets, and mobile devices.
- **Game Modes**:
  - **雙人對戰 (PvP)**: Two players can alternate moves.
  - **AI 對戰 (AI Battle)**: Play against an AI that employs a strategic algorithm to prioritize winning moves and block opponent's winning moves.
- **AI Logic**:
  - First checks for a winning move to secure victory.
  - Then checks to block the opponent’s immediate winning move.
  - Evaluates the board using a scoring function (`evaluateMove`) and adds a bonus if neighboring pieces exist.
  - Uses adjustable difficulty parameters.
- **Inline SVG Chess Pieces**:
  - Chess pieces are rendered directly with SVG. 
  - Black pieces are drawn as solid black circles, and white pieces as white circles with a black border.
- **Additional Features**:
  - **Undo Last Move**: Allows reverting the last move.
  - **Restart Game**: Provides an option to restart the game with confirmation.
  - **Win Highlighting**: The final move that results in a win is highlighted.
  - **Scoreboard**: Tracks wins for both players and persists results with `localStorage`.
  - **Board Size Selection**: Choose between multiple board sizes for different difficulty levels.

## File Structure

- **index.html**: 
  - The entry point that provides the game board and user controls.
- **style.css**: 
  - Provides the styling for layout, chessboard design, responsiveness, and chess piece display.
- **game.js**: 
  - Contains the game logic including board initialization, move handling, win checking, AI logic, and event listeners for user interaction.

## How to Run

To play the Gomoku game, simply open the `index.html` file in your web browser. You can run it locally by executing the following command in the project's root directory:

```bash
start index.html
```

## Future Improvements

- **Enhanced AI**: Integrate more advanced AI techniques with deeper lookahead strategies.
- **Improved UI/UX**: Refine the user interface and add animations for a smoother gameplay experience.
- **Online Multiplayer**: Incorporate online gameplay capabilities for remote competition.

## Acknowledgements

Thanks for checking out this project! Contributions, feedback, and suggestions are all welcome.
