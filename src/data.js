// ─────────────────────────────────────────────
//  V.E.R. — Virtual Encrypted Rooms
// ─────────────────────────────────────────────

export const ROOMS = [
  {
    id: 1, section: "SECTION 1", sectionTitle: "Introduction to Computers",
    title: "The Silicon Suspect", icon: "🔍",
    flavor: "Classified data was stolen from MATI's central server using high-speed parallel processing. Four suspects were found at the scene. Study the evidence — then identify the culprit.",
    type: "detective",
    crimeReport: {
      title: "INCIDENT REPORT — FILE #0x001",
      details: [
        "TIME OF BREACH: 02:47 AM",
        "METHOD: High-speed parallel processing used to crack encryption",
        "SCALE: Thousands of simultaneous operations executed per second",
        "LOCATION: Data centre, no personal workstation nearby",
        "WITNESS NOTE: No keyboard. No mouse. No monitor found at the scene.",
        "POWER CONSUMPTION: Extremely high — entire floor circuit tripped",
        "SIZE: Occupied a significant portion of the server room",
      ],
    },
    suspects: [
      {
        id: "a",
        name: "Personal Computer",
        icon: "🖥️",
        profile: [
          "General-purpose desktop machine",
          "Used by a single user at a time",
          "Moderate processing power",
          "Requires keyboard, mouse, and monitor",
          "Found in homes and offices",
        ],
        guilty: false,
        alibi: "A PC operates one task at a time for a single user. It lacks the parallel processing power needed for this breach.",
      },
      {
        id: "b",
        name: "Laptop",
        icon: "💻",
        profile: [
          "Portable personal computer",
          "Battery-powered, compact form factor",
          "Built-in screen, keyboard, and trackpad",
          "Designed for individual use on the move",
          "Low to moderate processing power",
        ],
        guilty: false,
        alibi: "A laptop is portable and personal. Its processing power and battery limitations rule it out for a breach of this scale.",
      },
      {
        id: "c",
        name: "Mainframe",
        icon: "🏢",
        profile: [
          "Extremely powerful, large-scale computer",
          "Designed for thousands of simultaneous operations",
          "Processes massive datasets at high speed",
          "No personal interface — managed remotely",
          "Found in data centres and large organisations",
          "Consumes enormous amounts of power",
        ],
        guilty: true,
        convictMsg: "The evidence matches perfectly. The Mainframe operates without a personal interface, consumes massive power, occupies large physical space, and is capable of executing thousands of parallel operations simultaneously — exactly what this breach required.",
      },
      {
        id: "d",
        name: "Embedded System",
        icon: "⚙️",
        profile: [
          "A computer built into a larger device",
          "Designed for one specific task only",
          "No general-purpose operating system",
          "Examples: traffic lights, washing machines, smart sensors",
          "Very limited processing power",
        ],
        guilty: false,
        alibi: "An embedded system is single-purpose with very limited processing power. It cannot perform complex parallel data operations.",
      },
    ],
    hint: "Focus on the power consumption, physical size, the absence of a personal interface, and the scale of simultaneous operations. Which suspect fits ALL the evidence?",
    successMsg: "SUSPECT IDENTIFIED. Case closed.",
  },

  {
    id: 2, section: "SECTION 2", sectionTitle: "Computer Components",
    title: "The Device Gauntlet", icon: "I/O",
    flavor: "Ten devices. Three categories. One wrong answer resets everything back to Q1. Classify each device correctly without breaking the chain.",
    type: "gauntlet",
    questions: [
      { device: "Touchscreen",         correct: "Input",   options: ["Input","Output","Storage"] },
      { device: "Blu-ray Disc",        correct: "Storage", options: ["Input","Output","Storage"] },
      { device: "Plotter",             correct: "Output",  options: ["Input","Output","Storage"] },
      { device: "Graphics Tablet",     correct: "Input",   options: ["Input","Output","Storage"] },
      { device: "ROM Cartridge",       correct: "Storage", options: ["Input","Output","Storage"] },
      { device: "Braille Display",     correct: "Output",  options: ["Input","Output","Storage"] },
      { device: "Smart Card Reader",   correct: "Input",   options: ["Input","Output","Storage"] },
      { device: "NAS Drive",           correct: "Storage", options: ["Input","Output","Storage"] },
      { device: "Actuator",            correct: "Output",  options: ["Input","Output","Storage"] },
      { device: "Optical Drive",       correct: "Storage", options: ["Input","Output","Storage"] },
    ],
    hint: "Input = sends data INTO the computer. Output = computer sends data OUT. Storage = data is saved/kept.",
    successMsg: "GAUNTLET CLEARED. All 10 devices classified.",
  },

  {
    id: 3, section: "SECTION 3", sectionTitle: "Microarchitecture",
    title: "The CPU Confession", icon: "CPU",
    flavor: "The CPU has been keeping a diary. A rogue process has tampered with one entry. The lie sounds plausible — but it is wrong. Find it.",
    type: "imposter",
    entries: [
      { id: "a", text: "\"Today I used the Program Counter to find the address of my next instruction. Very efficient.\"" },
      { id: "b", text: "\"I stored the memory address I needed to access inside the Memory Address Register. Standard procedure.\"" },
      { id: "c", text: "\"The Accumulator held the result of my last arithmetic operation. It always does.\"" },
      { id: "d", text: "\"I used the Data Bus to carry control signals to the CPU components. Works every time.\"" },
      { id: "e", text: "\"The MDR held the data I fetched from memory before it was decoded.\"" },
    ],
    correctImposter: "d",
    errorExplanation: "Control signals travel on the Control Bus — not the Data Bus. The Data Bus carries data between components. The Address Bus carries memory addresses. Each bus has a distinct, specific role.",
    hint: "There are three buses in a CPU system — each carries something different. One entry assigns the wrong job to the wrong bus.",
    successMsg: "ROGUE ENTRY DELETED. CPU diary integrity restored.",
  },

  {
    id: 4, section: "SECTION 4", sectionTitle: "Fetch-Decode-Execute Cycle",
    title: "The Cycle Saboteur", icon: "FDE",
    flavor: "The CPU's three-stage cycle log has been sabotaged. One stage is described incorrectly. It almost sounds right. Almost.",
    type: "fde_chase",
    entries: [
      { id: "a", text: "\"FETCH: I checked the Program Counter for the address of the next instruction, retrieved it from memory, and stored it in the MDR.\"" },
      { id: "b", text: "\"DECODE: The Control Unit examined the instruction and determined which operation needed to be performed and what operands were required.\"" },
      { id: "c", text: "\"EXECUTE: The Program Counter carried out the instruction by performing the arithmetic operation and stored the result directly into RAM.\"" },
    ],
    correctImposter: "c",
    errorExplanation: "Two errors: the Program Counter does not execute instructions — that is the ALU's job. And results go into the Accumulator first, not directly into RAM.",
    hint: "Which component actually carries out instructions during EXECUTE? And where does the result go first — RAM, or somewhere closer to the CPU?",
    successMsg: "SABOTEUR FOUND. FDE Cycle fully restored.",
  },

  {
    id: 5, section: "SECTION 5", sectionTitle: "Data & Communication Modes",
    title: "The Binary Transmission", icon: "BIN",
    flavor: "A secret transmission has been intercepted. It is encoded in 8-bit ASCII binary. Decode it — letter by letter — to reveal the hidden word.",
    type: "binary_decode",
    binaryWords: [
      { binary: "01001000", decimal: 72, letter: "H" },
      { binary: "01001111", decimal: 79, letter: "O" },
      { binary: "01010010", decimal: 82, letter: "R" },
      { binary: "01000011", decimal: 67, letter: "C" },
      { binary: "01010010", decimal: 82, letter: "R" },
      { binary: "01010101", decimal: 85, letter: "U" },
      { binary: "01011000", decimal: 88, letter: "X" },
    ],
    answer: "HORCRUX",
    hint: "Convert each binary value to decimal using place values: 128, 64, 32, 16, 8, 4, 2, 1. Then find that decimal's ASCII letter. H=72, O=79, R=82, C=67, U=85, X=88.",
    successMsg: "TRANSMISSION DECODED. Hidden word recovered.",
  },

  {
    id: 6, section: "SECTION 6", sectionTitle: "Data Transmission Rates & Errors",
    title: "The Parity Gauntlet", icon: "PAR",
    flavor: "Five parity checks stand between you and the exit. Get 5 correct in a row. One mistake and you start over. You have 3 seconds per question. Watch the buttons carefully — they are not always what they seem.",
    type: "parity_gauntlet",
    hint: "Even parity = total number of 1s including parity bit must be even. Odd parity = total must be odd. Read the rule on each question — it changes.",
    successMsg: "5 CONSECUTIVE CORRECT. Parity gauntlet cleared.",
  },

  {
    id: 7, section: "SECTION 7", sectionTitle: "Boolean Logic, Algorithms & Flowcharts",
    title: "The Logic Lockdown", icon: "&&",
    flavor: "Three logic gates are blocking the exit. Toggle inputs A, B, and C until ALL three gate outputs return TRUE. Only then will the door open.",
    type: "logic",
    hint: "AND needs BOTH inputs TRUE. OR needs at least ONE TRUE. NOT flips the value. Try: A=TRUE, B=TRUE, C=FALSE.",
    successMsg: "ALL GATES TRUE. Logic lockdown disengaged.",
  },

  {
    id: 8, section: "SECTION 8", sectionTitle: "C# Programming",
    title: "The Debugger's Dilemma", icon: "C#",
    flavor: "This program should print \"Access Granted\" when score is 50 or above, and \"Access Denied\" otherwise. Tested with score = 50 — it printed the wrong output. Click the line containing the bug.",
    type: "type_debug",
    code: [
      { id: "a", line: 1,  text: "int score = 50;",               buggy: false },
      { id: "b", line: 2,  text: "int passMark = 50;",            buggy: false },
      { id: "c", line: 3,  text: "string result;",                buggy: false },
      { id: "d", line: 4,  text: "if (score > passMark)",         buggy: true  },
      { id: "e", line: 5,  text: "{",                             buggy: false },
      { id: "f", line: 6,  text: '    result = "Access Granted";',buggy: false },
      { id: "g", line: 7,  text: "}",                             buggy: false },
      { id: "h", line: 8,  text: "else",                          buggy: false },
      { id: "i", line: 9,  text: "{",                             buggy: false },
      { id: "j", line: 10, text: '    result = "Access Denied";', buggy: false },
      { id: "k", line: 11, text: "}",                             buggy: false },
      { id: "l", line: 12, text: "Console.WriteLine(result);",    buggy: false },
    ],
    bugLine: "d",
    errorExplanation: "Line 4 uses > (strictly greater than) instead of >= (greater than or equal to). When score is exactly 50 and passMark is 50, the condition 50 > 50 evaluates to FALSE — so it falls into else and prints \"Access Denied\" instead of \"Access Granted\".",
    hint: "Trace through the code manually with score=50 and passMark=50. What does the condition on line 4 actually evaluate to? Is 50 > 50 true or false?",
    successMsg: "BUG SQUASHED. Program now executes correctly.",
  },

  {
    id: 9, section: "BOSS ROOM", sectionTitle: "The Final Challenge",
    title: "Gym Leader Ver's Lair", icon: "👔",
    flavor: "You have cleared all eight encrypted rooms. One final challenge remains.",
    type: "boss",
    hint: "",
    successMsg: "",
  },
];

// Hex green shades pool for Attack 2
export const GREEN_SHADES = [
  { name: "Forest Green",  hex: "#228B22" },
  { name: "Emerald",       hex: "#50C878" },
  { name: "Shamrock",      hex: "#009E60" },
  { name: "Olive",         hex: "#808000" },
  { name: "Moss",          hex: "#8A9A5B" },
  { name: "Mint",          hex: "#98FF98" },
  { name: "Sage",          hex: "#77815C" },
  { name: "Chartreuse",    hex: "#7FFF00" },
  { name: "Lime",          hex: "#00FF00" },
  { name: "Hunter Green",  hex: "#355E3B" },
  { name: "Jade",          hex: "#00A86B" },
  { name: "Fern",          hex: "#4F7942" },
];

// Cipher word pool for Attack 3
export const CIPHER_WORDS = [
  { word: "POKEMON",  display: "POKEMON"  },
  { word: "DIGIMON",  display: "DIGIMON"  },
  { word: "YUGIOH",   display: "YUGIOH"   },
  { word: "NARUTO",   display: "NARUTO"   },
];

export const BOSS_STAGES = null; // generated dynamically in BossRoom


export const INTRO_LINES = [
  "...",
  "So. You made it through all eight rooms.",
  "Noted.",
  "I am GYM LEADER VER.",
  "Keeper of the Syntax Badge. Master of this domain.",
  "My logic has no errors. My cache has never missed.",
  "You have four challenges remaining.",
  "I suggest you think before you type.",
  "Begin.",
];

export const DEFEAT_LINES = (teamName) => [
  "...",
  "Correct.",
  "All four.",
  "I have nothing further to add.",
  "Except...",
  `Well done, ${teamName}.`,
  "The SYNTAX BADGE is yours.",
  "Don't make me regret this.",
];
