const Q = ['A', 'B', 'C'] as const;
const Σ = ['a', 'b'] as const;

type State = (typeof Q)[number];
type Alphabet = (typeof Σ)[number];
type Transition = [State, Alphabet, State[]];
type Sigma = Transition[];

const q0: State = 'A';
const F: State = 'C';
const δ: Sigma = [
  ['A', 'a', ['A', 'B']],
  ['A', 'b', ['C']],
  ['B', 'a', ['A']],
  ['B', 'b', ['B']],
  ['C', 'a', []],
  ['C', 'b', ['A', 'B']],
];

const TRAP = 'TRAP';

type Transition2 = [string, string, string];
type Sigma2 = Transition2[];

function convert() {
  const Q2: string[] = structuredClone(Q);
  const δ2: Sigma2 = [];
  const queue: string[] = Q.toReversed();

  while (queue.length > 0) {
    // console.log({ queue });

    const q = queue.pop()!;

    if (Q.includes(q as State)) {
      for (const alphabet of Σ) {
        const transition = δ.find((t) => t[0] === q && t[1] === alphabet);
        if (!transition) return err();
        const dests = transition[2];
        const dest = dests.join('');
        if (!Q2.includes(dest)) {
          Q2.push(dest);
          queue.push(dest);
        }
        δ2.push([q, alphabet, dest]);
      }
    } else {
      const parentQs = q.split('');

      for (const alphabet of Σ) {
        const dests: Set<State> = new Set([]);

        for (const q of parentQs) {
          const transition = δ.find((t) => t[0] === q && t[1] === alphabet);
          if (!transition) return err();
          transition[2].forEach((d) => dests.add(d));
        }

        const dest = Array.from(dests).join('');
        if (!Q2.includes(dest)) {
          Q2.push(dest);
          queue.push(dest);
        }
        δ2.push([q, alphabet, dest]);
      }
    }
  }

  const F2 = Q2.filter((q) => q.includes(F));
  Q2[Q2.findIndex((q) => q === '')] = TRAP;

  const log = δ2
    .map(
      (t) =>
        `${t[0] === '' ? TRAP : t[0]} ---${t[1]}--> ${
          t[2] === '' ? TRAP : t[2]
        }`
    )
    .join('\n');
  console.log(log);
  console.log({ q02: q0, Q2, F2 });
}

function err() {
  console.error('Wrong input');
  Deno.exit();
}

if (import.meta.main) {
  convert();
}
