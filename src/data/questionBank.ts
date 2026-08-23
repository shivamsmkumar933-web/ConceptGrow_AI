import { PracticeQuestion } from '../types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // --- ELECTRICAL ENGINEERING: Circuit Junctions (EE-104) ---
  {
    id: 'q-junc-1',
    conceptId: 'circuit_junctions',
    conceptName: 'Circuit Junctions & Branch Nodes',
    subject: 'Basic Electrical Engineering',
    difficulty: 'easy',
    type: 'conceptual',
    questionText: 'Which statement accurately describes an essential circuit junction (node)?',
    options: [
      'A point where at least three circuit branches connect together.',
      'A component that stores electrical charge over time.',
      'A closed conducting loop without branches.',
      'A battery terminal with zero internal resistance.'
    ],
    correctAnswer: 'A point where at least three circuit branches connect together.',
    explanation: 'In circuit analysis, an essential node or junction is defined as an interconnection point where three or more conductive paths or branches meet.',
    formulaOrRule: 'Junction Definition: Branch intersection with N ≥ 3 connections.',
    hints: ['Think about where current is forced to split into multiple separate paths.']
  },
  {
    id: 'q-junc-2',
    conceptId: 'circuit_junctions',
    conceptName: 'Circuit Junctions & Branch Nodes',
    subject: 'Basic Electrical Engineering',
    difficulty: 'easy',
    type: 'short',
    questionText: 'Can electrical charge accumulate or get stored permanently at an ideal circuit junction in steady state? Answer Yes or No.',
    correctAnswer: 'No',
    explanation: 'No. Under steady-state conditions, charge cannot accumulate at an idealized node because a node has zero capacitance and charge conservation must hold.',
    formulaOrRule: 'dq/dt at ideal node = 0.',
    hints: ['Ideal nodes have zero physical volume and capacitance.']
  },

  // --- ELECTRICAL ENGINEERING: KCL (EE-105) ---
  {
    id: 'q-kcl-1',
    conceptId: 'kcl',
    conceptName: 'Kirchhoff’s Current Law (KCL)',
    subject: 'Basic Electrical Engineering',
    difficulty: 'easy',
    type: 'numerical',
    questionText: 'Two currents $I_1 = 5\\text{ A}$ and $I_2 = 3\\text{ A}$ enter a junction. A single branch leaves the junction with current $I_3$. What is the value of $I_3$ in Amperes?',
    options: [
      '8 A',
      '2 A',
      '15 A',
      '-2 A'
    ],
    correctAnswer: '8 A',
    explanation: 'By KCL, $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$. Therefore $I_3 = I_1 + I_2 = 5\\text{ A} + 3\\text{ A} = 8\\text{ A}$.',
    formulaOrRule: '\\sum I_{\\text{in}} = \\sum I_{\\text{out}}',
    hints: ['Add all incoming branch currents together to find the outgoing current.'],
    prerequisiteConceptId: 'circuit_junctions'
  },
  {
    id: 'q-kcl-2',
    conceptId: 'kcl',
    conceptName: 'Kirchhoff’s Current Law (KCL)',
    subject: 'Basic Electrical Engineering',
    difficulty: 'medium',
    type: 'mcq',
    questionText: 'At node X, four branches meet: $I_1 = 12\\text{ A}$ enters, $I_2 = 4\\text{ A}$ leaves, $I_3 = 3\\text{ A}$ enters, and $I_4$ is connected. To satisfy KCL, what must $I_4$ be?',
    options: [
      '11 A leaving the node',
      '11 A entering the node',
      '19 A leaving the node',
      '5 A leaving the node'
    ],
    correctAnswer: '11 A leaving the node',
    explanation: 'Total entering current = $I_1 + I_3 = 12\\text{ A} + 3\\text{ A} = 15\\text{ A}$. Currently leaving = $4\\text{ A}$. To balance the node: $15\\text{ A} = 4\\text{ A} + I_4 \\implies I_4 = 11\\text{ A}$ leaving.',
    formulaOrRule: '\\sum I_{\\text{in}} = \\sum I_{\\text{out}} \\implies 12 + 3 = 4 + I_4',
    hints: ['Group entering currents on one side and leaving currents on the other.'],
    prerequisiteConceptId: 'circuit_junctions'
  },
  {
    id: 'q-kcl-3',
    conceptId: 'kcl',
    conceptName: 'Kirchhoff’s Current Law (KCL)',
    subject: 'Basic Electrical Engineering',
    difficulty: 'hard',
    type: 'numerical',
    questionText: 'A node has 5 branches. Currents entering are $+6\\text{ A}$, $+2.5\\text{ A}$, and $-1.5\\text{ A}$ (a negative entering current means $1.5\\text{ A}$ is actually leaving). If one known outgoing branch carries $4\\text{ A}$, what is the current in the fifth outgoing branch?',
    options: [
      '3 A leaving',
      '7 A leaving',
      '11 A leaving',
      '0.5 A leaving'
    ],
    correctAnswer: '3 A leaving',
    explanation: 'Net entering current = $6 + 2.5 + (-1.5) = 7\\text{ A}$. Total leaving must equal $7\\text{ A}$. Known leaving = $4\\text{ A}$. Hence fifth branch = $7 - 4 = 3\\text{ A}$ leaving.',
    formulaOrRule: '\\sum I_{\\text{entering}} = \\sum I_{\\text{leaving}} \\implies 7\\text{ A} = 4\\text{ A} + I_5',
    hints: ['A negative entering current is identical to a positive leaving current.'],
    prerequisiteConceptId: 'circuit_junctions'
  },

  // --- ELECTRICAL ENGINEERING: Ohm's Law (EE-103) ---
  {
    id: 'q-ohm-1',
    conceptId: 'ohms_law',
    conceptName: 'Ohm’s Law & Resistance',
    subject: 'Basic Electrical Engineering',
    difficulty: 'easy',
    type: 'numerical',
    questionText: 'A $20\\,\\Omega$ resistor is connected across a $10\\text{ V}$ direct current supply. What current flows through the resistor?',
    options: [
      '0.5 A',
      '2.0 A',
      '200 A',
      '0.2 A'
    ],
    correctAnswer: '0.5 A',
    explanation: 'By Ohm’s Law: $I = V / R = 10\\text{ V} / 20\\,\\Omega = 0.5\\text{ A}$.',
    formulaOrRule: 'I = \\frac{V}{R}',
    hints: ['Divide the voltage across the terminals by the resistance.'],
    prerequisiteConceptId: 'electric_current'
  },
  {
    id: 'q-ohm-2',
    conceptId: 'ohms_law',
    conceptName: 'Ohm’s Law & Resistance',
    subject: 'Basic Electrical Engineering',
    difficulty: 'medium',
    type: 'numerical',
    questionText: 'An electrical heating element draws $5\\text{ A}$ from a $220\\text{ V}$ mains line. How much electrical power in Watts is dissipated as heat?',
    options: [
      '1100 W',
      '44 W',
      '2200 W',
      '550 W'
    ],
    correctAnswer: '1100 W',
    explanation: 'Power $P = V \\times I = 220\\text{ V} \\times 5\\text{ A} = 1100\\text{ W}$.',
    formulaOrRule: 'P = V \\cdot I',
    hints: ['Multiply voltage by current.'],
    prerequisiteConceptId: 'electric_potential'
  },

  // --- ELECTRICAL ENGINEERING: KVL (EE-106) ---
  {
    id: 'q-kvl-1',
    conceptId: 'kvl',
    conceptName: 'Kirchhoff’s Voltage Law (KVL)',
    subject: 'Basic Electrical Engineering',
    difficulty: 'medium',
    type: 'mcq',
    questionText: 'Kirchhoff’s Voltage Law (KVL) is the direct manifestation of which fundamental conservation law of physics?',
    options: [
      'Conservation of Energy',
      'Conservation of Electric Charge',
      'Conservation of Linear Momentum',
      'Conservation of Angular Momentum'
    ],
    correctAnswer: 'Conservation of Energy',
    explanation: 'KVL states that the net work done in moving a unit charge around any closed loop must equal zero because electrostatic force fields are conservative. Thus KVL expresses Conservation of Energy.',
    formulaOrRule: '\\sum V_{\\text{loop}} = 0 \\iff \\Delta E_{\\text{net}} = 0',
    hints: ['Recall what voltage (potential difference) represents in terms of work and energy.']
  },
  {
    id: 'q-kvl-2',
    conceptId: 'kvl',
    conceptName: 'Kirchhoff’s Voltage Law (KVL)',
    subject: 'Basic Electrical Engineering',
    difficulty: 'hard',
    type: 'numerical',
    questionText: 'In a single closed loop, a $24\\text{ V}$ DC source is connected in series with two resistors $R_1 = 4\\,\\Omega$ and $R_2 = 8\\,\\Omega$. What is the voltage drop across $R_2$ in Volts?',
    options: [
      '16 V',
      '8 V',
      '12 V',
      '24 V'
    ],
    correctAnswer: '16 V',
    explanation: 'Total resistance $R_{\\text{eq}} = 4 + 8 = 12\\,\\Omega$. Circuit current $I = V / R_{\\text{eq}} = 24 / 12 = 2\\text{ A}$. Voltage drop across $R_2 = I \\times R_2 = 2\\text{ A} \\times 8\\,\\Omega = 16\\text{ V}$.',
    formulaOrRule: 'V_2 = V_{\\text{source}} \\times \\frac{R_2}{R_1 + R_2}',
    hints: ['First find the loop current using KVL, then multiply by R2 resistance.'],
    prerequisiteConceptId: 'ohms_law'
  },

  // --- MATHEMATICS: Differentiation (MATH-102) ---
  {
    id: 'q-diff-1',
    conceptId: 'differentiation',
    conceptName: 'Differentiation & Instantaneous Rates',
    subject: 'Mathematics',
    difficulty: 'easy',
    type: 'numerical',
    questionText: 'What is the derivative of the polynomial function $f(x) = 3x^4 - 5x^2 + 7$ with respect to $x$?',
    options: [
      '12x^3 - 10x',
      '12x^3 - 10x + 7',
      '3x^3 - 5x',
      '7x^3 - 10x'
    ],
    correctAnswer: '12x^3 - 10x',
    explanation: 'Using the power rule $\\frac{d}{dx}[x^n] = n x^{n-1}$: $\\frac{d}{dx}[3x^4] = 12x^3$, $\\frac{d}{dx}[-5x^2] = -10x$, and the derivative of constant $7$ is $0$. Result = $12x^3 - 10x$.',
    formulaOrRule: '\\frac{d}{dx}[a x^n] = a n x^{n-1}',
    hints: ['Apply the power rule to each term individually; the derivative of a constant is zero.']
  },
  {
    id: 'q-diff-2',
    conceptId: 'differentiation',
    conceptName: 'Differentiation & Instantaneous Rates',
    subject: 'Mathematics',
    difficulty: 'medium',
    type: 'conceptual',
    questionText: 'Geometrically, what does the first derivative $f\'(a)$ represent on the graph of $y = f(x)$ at $x = a$?',
    options: [
      'The slope of the tangent line to the curve at x = a',
      'The area under the curve from 0 to a',
      'The distance of the point (a, f(a)) from origin',
      'The curvature of the function at x = a'
    ],
    correctAnswer: 'The slope of the tangent line to the curve at x = a',
    explanation: 'The derivative $f\'(a)$ measures the instantaneous rate of change of $y$ with respect to $x$, which corresponds to the geometric slope ($m = \\tan \\theta$) of the line tangent to $y=f(x)$ at $x=a$.',
    formulaOrRule: 'f\'(a) = \\text{Slope of Tangent Line at } x = a',
    hints: ['Think of secant lines approaching a single point in the limit.']
  },

  // --- MATHEMATICS: Integration (MATH-103) ---
  {
    id: 'q-int-1',
    conceptId: 'integration',
    conceptName: 'Definite & Indefinite Integration',
    subject: 'Mathematics',
    difficulty: 'medium',
    type: 'numerical',
    questionText: 'Evaluate the definite integral $\\int_{0}^{3} (2x + 1) \\, dx$.',
    options: [
      '12',
      '9',
      '15',
      '6'
    ],
    correctAnswer: '12',
    explanation: 'Anti-derivative: $F(x) = x^2 + x$. Evaluating from $0$ to $3$: $F(3) = 3^2 + 3 = 12$, and $F(0) = 0$. Hence $12 - 0 = 12$.',
    formulaOrRule: '\\int (2x + 1) dx = x^2 + x + C',
    hints: ['Find the anti-derivative first, then evaluate F(3) - F(0).'],
    prerequisiteConceptId: 'differentiation'
  },

  // --- PHYSICS: Newton's Laws (PHY-102) ---
  {
    id: 'q-newt-1',
    conceptId: 'newtons_laws',
    conceptName: 'Newton’s Laws of Motion & Forces',
    subject: 'Physics',
    difficulty: 'easy',
    type: 'numerical',
    questionText: 'A constant horizontal net force of $50\\text{ N}$ acts on a $10\\text{ kg}$ crate resting on a frictionless surface. What is the acceleration produced?',
    options: [
      '5 m/s²',
      '500 m/s²',
      '0.2 m/s²',
      '25 m/s²'
    ],
    correctAnswer: '5 m/s²',
    explanation: 'By Newton’s Second Law: $a = F_{\\text{net}} / m = 50\\text{ N} / 10\\text{ kg} = 5\\text{ m/s}^2$.',
    formulaOrRule: 'F_{\\text{net}} = m \\cdot a \\implies a = \\frac{F}{m}',
    hints: ['Divide the net force by the mass of the crate.']
  },
  {
    id: 'q-newt-2',
    conceptId: 'newtons_laws',
    conceptName: 'Newton’s Laws of Motion & Forces',
    subject: 'Physics',
    difficulty: 'medium',
    type: 'conceptual',
    questionText: 'When a rocket accelerates upward into space by expelling hot exhaust gases downward, which principle explains this propulsion?',
    options: [
      'Newton’s 3rd Law: The gas exerts an equal and opposite upward reaction force on the rocket',
      'Newton’s 1st Law: Inertia maintains velocity without external forces',
      'Friction between exhaust gas and surrounding atmosphere',
      'Gravitational attraction toward the upper stratosphere'
    ],
    correctAnswer: 'Newton’s 3rd Law: The gas exerts an equal and opposite upward reaction force on the rocket',
    explanation: 'The rocket exerts a downward action force on the expelled propellant gas. By Newton’s Third Law, the gas exerts an equal magnitude upward reaction force on the combustion chamber.',
    formulaOrRule: '\\vec{F}_{\\text{gas on rocket}} = -\\vec{F}_{\\text{rocket on gas}}',
    hints: ['For every action, there is an equal and opposite reaction.']
  },

  // --- PHYSICS: Conservation of Energy (PHY-103) ---
  {
    id: 'q-energy-1',
    conceptId: 'conservation_of_energy',
    conceptName: 'Work, Power & Energy Conservation',
    subject: 'Physics',
    difficulty: 'medium',
    type: 'numerical',
    questionText: 'A $2\\text{ kg}$ sphere is dropped from rest from a height of $20\\text{ m}$ above the ground ($g = 10\\text{ m/s}^2$, ignore air resistance). What is its speed just before hitting the ground?',
    options: [
      '20 m/s',
      '10 m/s',
      '40 m/s',
      '14.1 m/s'
    ],
    correctAnswer: '20 m/s',
    explanation: 'Initial potential energy transforms entirely into kinetic energy: $m g h = \\frac{1}{2} m v^2 \\implies v = \\sqrt{2 g h} = \\sqrt{2 \\times 10 \\times 20} = \\sqrt{400} = 20\\text{ m/s}$.',
    formulaOrRule: 'v = \\sqrt{2 g h}',
    hints: ['Equate initial potential energy m*g*h to final kinetic energy 0.5*m*v^2.'],
    prerequisiteConceptId: 'newtons_laws'
  }
];
