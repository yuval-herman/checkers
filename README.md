# Explanation videos:
1. [gui explanation](https://youtu.be/8R7CO7tH_UE)
2. [classes explanation](https://youtu.be/PdsCRfc0ymg)
3. [Game class explanation](https://youtu.be/tj6DbhCWuw8)

# Project Structure (plan):

## classes
- HTMLBoard
- Game
- Piece
- Renderer
---

### Game

This class will manage the entire game.\
Allmost every function should be called from within this class.

### HTMLBoard

This class will hold the table html.\
It will be used to manipulate the low level html elements and shouldn't be used directly.


### Piece

This class will contain logic about piece movement.\
This class should know where it can move by getting a board state.

### Renderer

This class will connect the backend to the frontend.\
It will be called from within Game after each move and abstract away HTMLBoard functions.
