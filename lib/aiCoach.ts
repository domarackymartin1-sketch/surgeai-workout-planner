import type { UserProfile } from './types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const WELCOME =
  'Ahoj! Som **Surge AI**, tvoj osobný tréningový asistent. Môžem ti poradiť s tréningom, technikou cvikov, regeneráciou, rozvrhom alebo výživou. Na čo sa chceš spýtať?';

export function getWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    content: WELCOME,
    timestamp: new Date().toISOString(),
  };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCoachReply(
  userMessage: string,
  profile: UserProfile | null
): string {
  const msg = userMessage.toLowerCase();
  const name = profile?.name?.split(' ')[0] ?? 'atlet';
  const goal = profile?.goal ?? 'maintain';
  const level = profile?.experienceLevel ?? 'beginner';

  if (/ahoj|hello|hi|čau|zdrav/.test(msg)) {
    return `Ahoj ${name}! 👋 Som pripravený ti pomôcť s tréningom. Môžeš sa ma spýtať na konkrétny cvik, rozvrh, regeneráciu alebo techniku.`;
  }

  if (/bench|tlak.*hrud|bench press/.test(msg)) {
    return `**Bench Press – tipy:**\n\n1. **Stabilita:** Stiahnuté lopatky, mierny oblúk v chrbte, nohy pevne na zemi.\n2. **Dráha:** Tyč smeruje k spodnej časti hrudníka, nie k brade.\n3. **Objem:** Pre ${level === 'beginner' ? 'začiatočníka' : 'tvoju úroveň'} odporúčam 3–4 série × 6–10 opakovaní.\n4. **Progresia:** Pridávaj 2.5 kg až keď zvládneš všetky série s dobrou technikou.\n\nChceš aj alternatívy ak nemáš lavicu?`;
  }

  if (/deadlift|mŕtvy|dead lift/.test(msg)) {
    return `**Deadlift:**\n\n- Začni s **správnym setupom** – tyč nad stredom chodidiel, boky nie príliš nízko.\n- Brus a lopatky zapojené pred zdvihom.\n- **1–2× týždenne** stačí, je to náročný cvik na CNS.\n- Pre techniku skús najprv rumunský deadlift s nižšou váhou.\n\nAký je tvoj aktuálny pracovný max?`;
  }

  if (/squat|drep|nohe/.test(msg)) {
    return `**Drepy:**\n\n1. Hlbka: aspoň paralela, ak mobilita dovoľuje.\n2. Kolená v línii s chodidlami, jadro zapnuté.\n3. Push/Pull/Legs: drepy patria na **Leg day** – 4 série × 6–8 pre silu, 3×10–12 pre hypertrofiu.\n4. Regenerácia: 48–72 h medzi ťažkými leg day.\n\nTrénuješ v posilňovni alebo doma?`;
  }

  if (/push|pull|split|rozvrh|plán|plan/.test(msg)) {
    return `**Odporúčaný rozvrh (${goal}):**\n\n- **Push/Pull/Legs** – 3× týždenne, ideálne pre ${level}.\n- **Upper/Lower** – 4× týždenne, dobrá rovnováha objemu a regenerácie.\n- Medzi rovnakými partiami nechaj **min. 48 h**.\n\nTvoja frekvencia: ${profile?.workoutFrequency ?? '2-3'}× týždenne. Chceš konkrétny týždenný plán?`;
  }

  if (/regener|oddych|rest|spať|spánok|sleep/.test(msg)) {
    return `**Regenerácia je kľúčová:**\n\n- Spánok **7–9 h** denne.\n- Medzi ťažkými tréningmi rovnakej partie **48–72 h**.\n- Aktívny oddych: chôdza, strečing, ľahká mobilita.\n- Po tréningu: bielkoviny do 2 h + hydratácia.\n\nKoľko hodín obvykle spíš?`;
  }

  if (/bielkovin|protein|výživ|strav|kcal|kalóri/.test(msg)) {
    const kcal = profile?.dailyKcalTarget ?? 2500;
    const protein = profile?.dailyProteinTarget ?? Math.round((kcal * 0.3) / 4);
    return `**Výživa pre tvoj cieľ:**\n\n- Denný cieľ: **~${kcal} kcal**, bielkoviny **~${protein} g**.\n- Po tréningu: 25–40 g bielkovín do 2 hodín.\n- Pri ${goal === 'muscle' ? 'naberaní svalov' : goal === 'loss' ? 'chudnutí' : 'udržiavaní'} dávaj pozor na dostatočný príjem bielkovín aj pri deficite.\n\nChceš tipy na jedlá alebo timing?`;
  }

  if (/rpe|záťaž|intenzit/.test(msg)) {
    return `**RPE (Rate of Perceived Exertion):**\n\n- **RPE 7–8:** 2–3 opakovania v rezerve – ideálne pre hlavné cviky.\n- **RPE 9–10:** len občas, na test maxov alebo finálne série.\n- Začiatočníci: pracuj skôr na **RPE 6–7** a uč sa techniku.\n\nSleduj RPE v SurgeAI pri logovaní sérií – pomôže ti to progresovať bez pretrénovania.`;
  }

  if (/biceps|triceps|ramen|chrbát|hrud|nohy/.test(msg)) {
    return `Pre túto svalovú skupinu odporúčam:\n\n1. **1–2 hlavné cviky** (compound) + 1–2 izolačné.\n2. **3–4 série** × 8–12 rep pre hypertrofiu.\n3. Progresívne zaťaženie každý týždeň (váha, reps alebo série).\n\nPozri si **Knižnicu cvikov** v Workout sekcii – tam nájdeš cviky filtrované podľa svalovej skupiny.`;
  }

  if (/začiat|beginner|nováčik|prv/.test(msg)) {
    return `**Pre začiatočníkov:**\n\n1. Začni **3× týždenne** full body alebo PPL.\n2. Uč sa techniku s **ľahšími váhami** – RPE 6–7.\n3. Základné cviky: drepy, deadlift, bench, pull-up/row, OHP.\n4. Pridávaj objem postupne, nie naraz.\n\nSurgeAI ti pomôže logovať progres – dôležité je konzistencia! 💪`;
  }

  if (/ďak|dakuj|thanks/.test(msg)) {
    return `Nemáš za čo, ${name}! Držím ti palce. Ak budeš potrebovať ďalšiu radu, som tu. 🔥`;
  }

  return pick([
    `Dobrá otázka! Pre **${goal === 'muscle' ? 'naberanie svalov' : goal === 'loss' ? 'chudnutie' : goal === 'strength' ? 'silu' : 'udržanie formy'}** odporúčam kombinovať compound cviky s progresívnym zaťažením. Skús sa spýtať konkrétne – napr. „Ako cvičiť bench press?" alebo „Aký rozvrh pre 4 dni?"`,
    `Na základe tvojej úrovne (**${level}**) by som odporúčil sústrediť sa na techniku a konzistentný tréning 3–4× týždenne. Napíš mi konkrétny cvik alebo cieľ a pripravím ti detailnejšiu radu.`,
    `Tu je všeobecná rada: **kvalita > kvantita**. Lepšie 3 kvalitné tréningy týždenne ako 6 bez regenerácie. Čo ťa zaujíma – technika, rozvrh, výživa alebo regenerácia?`,
  ]);
}
