import { Concept, GroundedSource } from '../types';

export interface SubjectItem {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
}

export const SUBJECTS: SubjectItem[] = [
  {
    id: 'electrical_engineering',
    name: 'Basic Electrical Engineering',
    category: 'Engineering',
    description: 'Circuits, Nodal Analysis, Ohm’s Law, KCL, KVL & Power',
    iconName: 'Zap'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    category: 'Calculus & Algebra',
    description: 'Functions, Limits, Differentiation, Integration & Applications',
    iconName: 'Sigma'
  },
  {
    id: 'physics',
    name: 'Physics',
    category: 'Mechanics & Energy',
    description: 'Kinematics, Newton’s Laws, Energy Conservation & Fields',
    iconName: 'Compass'
  }
];

export const CONCEPTS: Concept[] = [
  // --- ELECTRICAL ENGINEERING ---
  {
    id: 'electric_current',
    subjectId: 'electrical_engineering',
    subjectName: 'Basic Electrical Engineering',
    name: 'Electric Current & Charge Flow',
    code: 'EE-101',
    difficulty: 'easy',
    description: 'Net rate of electric charge flow through a cross-sectional area per unit time ($I = dq/dt$). Measured in Amperes (Coulombs/sec).',
    prerequisites: [],
    summary: 'Current is the directed flow of mobile electric charges driven by an electric potential gradient.',
    formulas: ['I = \\frac{dq}{dt}', 'Q = I \\cdot t', '1\\text{ Ampere} = 1\\text{ Coulomb/second}'],
    keyPoints: [
      'Conventional current flows from positive to negative potential.',
      'Electrons actually drift in the opposite direction of conventional current.',
      'Current in a series branch is identical everywhere.'
    ],
    tags: ['charge', 'current', 'ampere', 'coulomb', 'drift velocity']
  },
  {
    id: 'electric_potential',
    subjectId: 'electrical_engineering',
    subjectName: 'Basic Electrical Engineering',
    name: 'Voltage & Potential Difference',
    code: 'EE-102',
    difficulty: 'easy',
    description: 'Work required per unit charge to move a test charge between two points in an electric field ($V = W/q$).',
    prerequisites: [],
    summary: 'Voltage acts as the electrical pressure difference driving charge carriers through a conductor.',
    formulas: ['V = \\frac{W}{q}', '1\\text{ Volt} = 1\\text{ Joule/Coulomb}'],
    keyPoints: [
      'Potential difference is always measured between two distinct points.',
      'Ground / Reference node is conventionally set to 0V.',
      'Voltage drop across a passive resistor occurs in the direction of current flow.'
    ],
    tags: ['voltage', 'potential difference', 'volt', 'joule', 'emf']
  },
  {
    id: 'ohms_law',
    subjectId: 'electrical_engineering',
    subjectName: 'Basic Electrical Engineering',
    name: 'Ohm’s Law & Resistance',
    code: 'EE-103',
    difficulty: 'easy',
    description: 'Direct proportionality between potential difference and current through an ohmic conductor at constant temperature ($V = I \\cdot R$).',
    prerequisites: ['electric_current', 'electric_potential'],
    summary: 'Resistance quantifies the opposition to charge movement. For linear resistors, V/I remains constant.',
    formulas: ['V = I \\cdot R', 'I = \\frac{V}{R}', 'R = \\rho \\frac{L}{A}', 'P = V \\cdot I = I^2 R = \\frac{V^2}{R}'],
    keyPoints: [
      'Valid for linear/ohmic materials under steady temperature.',
      'Resistance is proportional to length and inversely proportional to cross-sectional area.',
      'Power dissipation represents energy converted to thermal energy.'
    ],
    tags: ['ohms law', 'resistance', 'resistor', 'power', 'v=ir']
  },
  {
    id: 'circuit_junctions',
    subjectId: 'electrical_engineering',
    subjectName: 'Basic Electrical Engineering',
    name: 'Circuit Junctions & Branch Nodes',
    code: 'EE-104',
    difficulty: 'easy',
    description: 'A circuit junction (or essential node) is an interconnection point where three or more conductive circuit branches meet.',
    prerequisites: ['electric_current'],
    summary: 'Junctions act like water pipe intersections; no fluid or electrical charge can pool or disappear at a node.',
    formulas: ['\\text{Branches} = \\text{Individual circuit paths connected between nodes}'],
    keyPoints: [
      'A node connects multiple elements at the same electrical potential.',
      'Essential junctions require current division among branches.',
      'Understanding junction topology is the vital prerequisite before analyzing KCL.'
    ],
    tags: ['junction', 'node', 'branch', 'topology', 'prerequisite']
  },
  {
    id: 'kcl',
    subjectId: 'electrical_engineering',
    subjectName: 'Basic Electrical Engineering',
    name: 'Kirchhoff’s Current Law (KCL)',
    code: 'EE-105',
    difficulty: 'medium',
    description: 'Conservation of electric charge applied to a junction: the sum of currents entering a node equals the sum of currents leaving.',
    prerequisites: ['circuit_junctions', 'ohms_law'],
    summary: 'Total incoming electric current must balance outgoing current at every node: $\\sum I_{in} = \\sum I_{out}$ or $\\sum I = 0$.',
    formulas: ['\\sum I_{\\text{in}} = \\sum I_{\\text{out}}', '\\sum_{k=1}^{n} I_k = 0'],
    keyPoints: [
      'Direct manifestation of Law of Conservation of Charge.',
      'Sign convention: Incoming currents (+), Outgoing currents (-).',
      'Forms the mathematical basis of Nodal Voltage Analysis.'
    ],
    tags: ['kcl', 'kirchhoff', 'junction rule', 'nodal analysis', 'charge conservation']
  },
  {
    id: 'kvl',
    subjectId: 'electrical_engineering',
    subjectName: 'Basic Electrical Engineering',
    name: 'Kirchhoff’s Voltage Law (KVL)',
    code: 'EE-106',
    difficulty: 'hard',
    description: 'Conservation of energy in closed loops: the algebraic sum of all potential differences (voltages) around any closed circuit loop is zero.',
    prerequisites: ['ohms_law', 'kcl'],
    summary: 'Energy gained across sources equals energy dropped across components in a complete closed circuit path: $\\sum V_{\\text{loop}} = 0$.',
    formulas: ['\\sum_{k=1}^{n} V_k = 0', '\\sum V_{\\text{sources}} = \\sum V_{\\text{drops}}'],
    keyPoints: [
      'Direct manifestation of Law of Conservation of Energy.',
      'Traversing from - to + through an EMF adds +V; traversing in current direction through resistor drops -IR.',
      'Forms the foundation of Mesh Current Analysis.'
    ],
    tags: ['kvl', 'loop rule', 'mesh analysis', 'energy conservation', 'closed loop']
  },

  // --- MATHEMATICS ---
  {
    id: 'functions_mappings',
    subjectId: 'mathematics',
    subjectName: 'Mathematics',
    name: 'Functions & Domain-Range Mappings',
    code: 'MATH-101',
    difficulty: 'easy',
    description: 'A relation that uniquely maps each element of an input set (domain) to exactly one output value in a codomain.',
    prerequisites: [],
    summary: 'Functions describe structured causal dependencies between variables $y = f(x)$.',
    formulas: ['y = f(x)', 'f: X \\to Y'],
    keyPoints: [
      'Vertical line test determines if a geometric curve is a valid function.',
      'Domain is the set of all permitted inputs where the function is well-defined.',
      'Composition of functions $(f \\circ g)(x) = f(g(x))$.'
    ],
    tags: ['functions', 'domain', 'range', 'mapping', 'relations']
  },
  {
    id: 'differentiation',
    subjectId: 'mathematics',
    subjectName: 'Mathematics',
    name: 'Differentiation & Instantaneous Rates',
    code: 'MATH-102',
    difficulty: 'medium',
    description: 'The instantaneous rate of change of a function with respect to an independent variable, representing the tangent slope to its curve.',
    prerequisites: ['functions_mappings'],
    summary: 'Calculates how fast $f(x)$ changes as $x$ varies infinitesimally: $f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$.',
    formulas: [
      'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
      '\\frac{d}{dx}[x^n] = n x^{n-1}',
      '\\frac{d}{dx}[u \\cdot v] = u\'v + uv\'',
      '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)'
    ],
    keyPoints: [
      'Power rule, Product rule, Quotient rule, and Chain rule are core tools.',
      'Points where $f\'(x) = 0$ identify critical points (maxima, minima, inflection).',
      'Physical velocity is the derivative of position with respect to time ($v = ds/dt$).'
    ],
    tags: ['calculus', 'derivatives', 'tangent', 'rate of change', 'chain rule']
  },
  {
    id: 'integration',
    subjectId: 'mathematics',
    subjectName: 'Mathematics',
    name: 'Definite & Indefinite Integration',
    code: 'MATH-103',
    difficulty: 'hard',
    description: 'The mathematical accumulation of continuous quantities; anti-differentiation and calculating signed area under curves.',
    prerequisites: ['differentiation'],
    summary: 'By the Fundamental Theorem of Calculus, integration reverses differentiation: $\\int f\'(x) dx = f(x) + C$.',
    formulas: [
      '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
      '\\int_{a}^{b} f(x) dx = F(b) - F(a)',
      '\\int u \\, dv = u v - \\int v \\, du'
    ],
    keyPoints: [
      'Definite integral evaluates cumulative net signed area between limits [a, b].',
      'Indefinite integral represents a family of curves with arbitrary constant C.',
      'Techniques include substitution, integration by parts, and partial fractions.'
    ],
    tags: ['integration', 'calculus', 'area under curve', 'antiderivative', 'riemann sum']
  },

  // --- PHYSICS ---
  {
    id: 'kinematics_1d',
    subjectId: 'physics',
    subjectName: 'Physics',
    name: '1D Kinematics & Equations of Motion',
    code: 'PHY-101',
    difficulty: 'easy',
    description: 'Description of motion in terms of displacement, velocity, acceleration, and time without reference to the forces causing it.',
    prerequisites: [],
    summary: 'Uniformly accelerated rectilinear motion governed by kinematic equations.',
    formulas: [
      'v = u + a t',
      's = u t + \\frac{1}{2} a t^2',
      'v^2 = u^2 + 2 a s'
    ],
    keyPoints: [
      'Displacement is a vector quantity measuring net change in position.',
      'Acceleration is the time derivative of velocity ($a = dv/dt$).',
      'Area under a velocity-time graph represents displacement.'
    ],
    tags: ['kinematics', 'velocity', 'acceleration', 'displacement', 'motion']
  },
  {
    id: 'newtons_laws',
    subjectId: 'physics',
    subjectName: 'Physics',
    name: 'Newton’s Laws of Motion & Forces',
    code: 'PHY-102',
    difficulty: 'medium',
    description: 'Fundamental principles linking force interactions to the resulting changes in momentum and acceleration of physical bodies.',
    prerequisites: ['kinematics_1d'],
    summary: '1st Law: Inertia. 2nd Law: $\\sum \\vec{F} = m \\vec{a}$. 3rd Law: Action-Reaction pairs.',
    formulas: [
      '\\sum \\vec{F} = m \\vec{a}',
      '\\vec{p} = m \\vec{v}',
      '\\vec{F}_{AB} = -\\vec{F}_{BA}'
    ],
    keyPoints: [
      'Equilibrium occurs when the vector sum of all forces equals zero.',
      'Free Body Diagrams (FBD) isolate all contact and field forces acting on a body.',
      'Mass represents inertial resistance to changes in state of motion.'
    ],
    tags: ['newtons laws', 'force', 'f=ma', 'inertia', 'dynamics', 'free body diagram']
  },
  {
    id: 'conservation_of_energy',
    subjectId: 'physics',
    subjectName: 'Physics',
    name: 'Work, Power & Energy Conservation',
    code: 'PHY-103',
    difficulty: 'hard',
    description: 'Energy transformations in mechanical systems; total mechanical energy remains constant in conservative force fields.',
    prerequisites: ['newtons_laws'],
    summary: 'Work done equals change in kinetic energy ($W_{net} = \\Delta KE$). Total energy $E = KE + PE = \\text{constant}$.',
    formulas: [
      'W = \\vec{F} \\cdot \\vec{d} = F d \\cos(\\theta)',
      'KE = \\frac{1}{2} m v^2',
      'PE_{\\text{grav}} = m g h',
      'E_i = E_f'
    ],
    keyPoints: [
      'Work is only done by the component of force parallel to displacement.',
      'Conservative forces (like gravity) do path-independent work.',
      'Non-conservative forces (like friction) dissipate mechanical energy into heat.'
    ],
    tags: ['work', 'energy', 'kinetic energy', 'potential energy', 'conservation']
  }
];

export const GROUNDED_SOURCES_CATALOG: GroundedSource[] = [
  {
    title: 'OpenStax University Physics Vol 2 (Chapter 10: Direct-Current Circuits)',
    url: 'https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules',
    chapter: '10.3 Kirchhoff’s Rules',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)'
  },
  {
    title: 'MIT OpenCourseWare 6.002 - Circuits and Electronics',
    url: 'https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/',
    chapter: 'Lecture 2: KCL and KVL in Resistive Networks',
    license: 'CC BY-NC-SA'
  },
  {
    title: 'OpenStax Calculus Volume 1',
    url: 'https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative',
    chapter: 'Chapter 3: Derivatives and Instantaneous Rates',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)'
  },
  {
    title: 'OpenStax University Physics Vol 1 (Mechanics)',
    url: 'https://openstax.org/books/university-physics-volume-1/pages/5-1-forces',
    chapter: 'Chapter 5: Newton’s Laws of Motion',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)'
  }
];
