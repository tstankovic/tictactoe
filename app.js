const readline = require("readline");

let m = [
  [" ", " ", " "],
  [" ", " ", " "],
  [" ", " ", " "],
];

function printTable() {
  console.log(`
        1   2   3
      ~~~~~~~~~~~~~
    1 | ${m[0][0]} | ${m[0][1]} | ${m[0][2]} |
      ~~~~~~~~~~~~~
    2 | ${m[1][0]} | ${m[1][1]} | ${m[1][2]} |
      ~~~~~~~~~~~~~
    3 | ${m[2][0]} | ${m[2][1]} | ${m[2][2]} |
      ~~~~~~~~~~~~~
  `);
}

function ask(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

function validate([x, y]) {
  let err;
  if (!x || !y)
    err =
      "Invalid input: you must enter the x and y coordinates separated by spaces";
  else if (x > 3 || x < 1 || y > 3 || y < 1)
    err = "Invalid input: those coordinates are outside the playable area";
  else if (m[y - 1][x - 1] !== " ")
    err = "Invalid input: that space is already taken";
  return err;
}

async function run() {
  let turn = "X",
    move,
    err,
    over = false,
    winner;

  printTable();

  function checkForWinner() {
    let i, j, sign;

    // Checking horizontal lines
    for (i = 0; i < 3; i++) {
      sign = m[i][0];
      if (sign === " ") continue;
      for (j = 1; j < 3; j++) {
        if (m[i][j] !== sign) break;
      }
      // If j == 3 that means for loop made it to the end
      //  => all signs in i-th line are same
      //  => we have a winner!
      if (j === 3) {
        over = true;
        winner = sign === "X" ? p1 : p2;
        return;
      }
    }

    // Checking vertical lines
    for (j = 0; j < 3; j++) {
      sign = m[0][j];
      if (sign === " ") continue;
      for (i = 1; i < 3; i++) {
        if (m[i][j] !== sign) break;
      }
      if (i === 3) {
        over = true;
        winner = sign === "X" ? p1 : p2;
        return;
      }
    }

    // Checking main diagonal
    sign = m[0][0];
    if (sign !== " " && sign === m[1][1] && sign === m[2][2]) {
      over = true;
      winner = sign === "X" ? p1 : p2;
      return;
    }

    // Checking side diagonal
    sign = m[2][0];
    if (sign !== " " && m[1][1] === sign && m[0][2] === sign) {
      over = true;
      winner = sign === "X" ? p1 : p2;
      return;
    }

    // Check if the table is full
    // We check does the table have at least 1 empty space. If it doesn't, it's game over
    const tableFull = !m.some((el) => el.some((elem) => elem === " "));
    if (tableFull) {
      over = true;
      winner = "No one";
    }
  }

  async function getInputAndValidate() {
    err = "";
    move = await ask(`${turn === "X" ? p1 : p2} (${turn}) move: `);
    if (move === "resign") {
      over = true;
      winner = turn === "X" ? p2 : p1;
      return;
    }
    const input = move.split(" ");
    err = validate(input);
    if (!err) {
      const [x, y] = input;
      m[y - 1][x - 1] = turn;
      printTable();
      checkForWinner();
      turn = turn === "X" ? "O" : "X";
    }
  }

  async function makeMove() {
    await getInputAndValidate();

    while (err) {
      console.log(err);
      await getInputAndValidate();
    }
  }

  while (!over) {
    await makeMove();
  }

  console.log(winner + " won!");
}

let p1, p2;
async function init() {
  p1 = await ask("Player 1: ");
  p2 = await ask("Player 2: ");

  await run();
  let more = await ask("Play another game? y/n \n");
  if (more === "y") {
    m = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
    init();
  } else {
    console.log("Bye bye!");
  }
}

init();

module.exports = { validate };
