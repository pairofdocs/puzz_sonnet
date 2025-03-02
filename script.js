document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const startButton = document.getElementById('start-button');
    const movesCount = document.getElementById('moves-count');
    
    // Game variables
    const GRID_SIZE = 3; // 3x3 grid for 8 pieces + 1 empty
    const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;
    let pieces = [];
    let emptyCell = { row: GRID_SIZE - 1, col: GRID_SIZE - 1 }; // Bottom right is initially empty
    let emptyPiece = null; // Reference to the empty piece element
    let moves = 0;
    let containerSize = 400; // Default size
    let pieceSize = containerSize / GRID_SIZE;
    
    // Adjust for smaller screens
    function adjustForScreenSize() {
        if (window.innerWidth <= 500) {
            containerSize = 300;
        } else {
            containerSize = 400;
        }
        pieceSize = containerSize / GRID_SIZE;
        puzzleContainer.style.width = `${containerSize}px`;
        puzzleContainer.style.height = `${containerSize}px`;
    }
    
    // Initialize the puzzle
    function initializePuzzle() {
        adjustForScreenSize();
        puzzleContainer.innerHTML = '';
        pieces = [];
        moves = 0;
        movesCount.textContent = moves;
        emptyCell = { row: GRID_SIZE - 1, col: GRID_SIZE - 1 };
        
        // Create puzzle pieces
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                
                // Set size and position
                piece.style.width = `${pieceSize}px`;
                piece.style.height = `${pieceSize}px`;
                piece.style.left = `${col * pieceSize}px`;
                piece.style.top = `${row * pieceSize}px`;
                
                // Set background position to show correct part of the image
                piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
                
                // Store the current position and original position
                piece.setAttribute('data-row', row);
                piece.setAttribute('data-col', col);
                piece.setAttribute('data-original-row', row);
                piece.setAttribute('data-original-col', col);
                
                // Make the last piece empty
                if (row === GRID_SIZE - 1 && col === GRID_SIZE - 1) {
                    piece.classList.add('empty');
                    emptyPiece = piece;
                }
                
                // Add click event
                piece.addEventListener('click', () => {
                    const currentRow = parseInt(piece.getAttribute('data-row'));
                    const currentCol = parseInt(piece.getAttribute('data-col'));
                    movePiece(currentRow, currentCol);
                });
                
                puzzleContainer.appendChild(piece);
                pieces.push(piece);
            }
        }
    }
    
    // Move a piece if it's adjacent to the empty cell
    function movePiece(row, col) {
        // Don't allow moving the empty piece directly
        if (row === emptyCell.row && col === emptyCell.col) {
            return;
        }
        
        // Check if the clicked piece is adjacent to the empty cell
        if (
            (Math.abs(row - emptyCell.row) === 1 && col === emptyCell.col) ||
            (Math.abs(col - emptyCell.col) === 1 && row === emptyCell.row)
        ) {
            // Find the piece at the given row and col
            const piece = pieces.find(p => 
                parseInt(p.getAttribute('data-row')) === row && 
                parseInt(p.getAttribute('data-col')) === col
            );
            
            if (piece) {
                // Swap positions with empty cell
                piece.style.left = `${emptyCell.col * pieceSize}px`;
                piece.style.top = `${emptyCell.row * pieceSize}px`;
                
                // Move empty piece to the clicked piece's position
                emptyPiece.style.left = `${col * pieceSize}px`;
                emptyPiece.style.top = `${row * pieceSize}px`;
                
                // Update data attributes
                piece.setAttribute('data-row', emptyCell.row);
                piece.setAttribute('data-col', emptyCell.col);
                emptyPiece.setAttribute('data-row', row);
                emptyPiece.setAttribute('data-col', col);
                
                // Update empty cell position
                emptyCell.row = row;
                emptyCell.col = col;
                
                // Increment moves
                moves++;
                movesCount.textContent = moves;
                
                // Check if puzzle is solved
                checkWin();
            }
        }
    }
    
    // Shuffle the puzzle
    function shufflePuzzle() {
        // Reset the puzzle first
        initializePuzzle();
        
        // Perform random valid moves
        const shuffleMoves = 100; // Number of random moves
        
        for (let i = 0; i < shuffleMoves; i++) {
            // Get adjacent pieces to the empty cell
            const adjacentPieces = [];
            
            // Check all four directions
            const directions = [
                { row: -1, col: 0 }, // Up
                { row: 1, col: 0 },  // Down
                { row: 0, col: -1 }, // Left
                { row: 0, col: 1 }   // Right
            ];
            
            for (const dir of directions) {
                const newRow = emptyCell.row + dir.row;
                const newCol = emptyCell.col + dir.col;
                
                // Check if the new position is within bounds
                if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                    adjacentPieces.push({ row: newRow, col: newCol });
                }
            }
            
            // Randomly select one of the adjacent pieces
            if (adjacentPieces.length > 0) {
                const randomIndex = Math.floor(Math.random() * adjacentPieces.length);
                const randomPiece = adjacentPieces[randomIndex];
                movePiece(randomPiece.row, randomPiece.col);
            }
        }
        
        // Reset moves counter after shuffling
        moves = 0;
        movesCount.textContent = moves;
    }
    
    // Check if the puzzle is solved
    function checkWin() {
        const isWin = pieces.every(piece => {
            // Skip the empty piece in the win check
            if (piece.classList.contains('empty')) {
                return true;
            }
            
            const currentRow = parseInt(piece.getAttribute('data-row'));
            const currentCol = parseInt(piece.getAttribute('data-col'));
            const originalRow = parseInt(piece.getAttribute('data-original-row'));
            const originalCol = parseInt(piece.getAttribute('data-original-col'));
            
            return currentRow === originalRow && currentCol === originalCol;
        });
        
        if (isWin) {
            setTimeout(() => {
                alert(`Congratulations! You solved the puzzle in ${moves} moves!`);
            }, 300);
        }
    }
    
    // Event listeners
    startButton.addEventListener('click', shufflePuzzle);
    window.addEventListener('resize', () => {
        adjustForScreenSize();
        // Update positions of all pieces
        pieces.forEach(piece => {
            const row = parseInt(piece.getAttribute('data-row'));
            const col = parseInt(piece.getAttribute('data-col'));
            piece.style.width = `${pieceSize}px`;
            piece.style.height = `${pieceSize}px`;
            piece.style.left = `${col * pieceSize}px`;
            piece.style.top = `${row * pieceSize}px`;
            
            // Only update background for non-empty pieces
            if (!piece.classList.contains('empty')) {
                const originalCol = parseInt(piece.getAttribute('data-original-col'));
                const originalRow = parseInt(piece.getAttribute('data-original-row'));
                piece.style.backgroundSize = `${containerSize}px ${containerSize}px`;
                piece.style.backgroundPosition = `-${originalCol * pieceSize}px -${originalRow * pieceSize}px`;
            }
        });
    });
    
    // Initialize the puzzle
    initializePuzzle();
}); 