# SurgeAI – iOS (SwiftUI)

Natívna iOS verzia SurgeAI Workout Planner. Toto je štartovací scaffold – otvor v Xcode a spusti na iPhone.

## Ako spustiť v Xcode

1. Otvor **Xcode** (15+)
2. **File → New → Project → iOS → App**
3. Product Name: `SurgeAI`
4. Interface: **SwiftUI**, Language: **Swift**
5. Ulož projekt do priečinka `SurgeAI-iOS/`
6. Nahraď vygenerované súbory obsahom z `SurgeAI-iOS/SurgeAI/`:
   - `SurgeAIApp.swift`
   - `ContentView.swift`
   - priečinok `Views/`
7. V **Signing & Capabilities** vyber svoj Apple Team (aj free účet stačí na simulátor)
8. Vyber iPhone simulátor alebo pripojený iPhone → **Run (⌘R)**

## Štruktúra

- `SurgeAIApp.swift` – vstupný bod
- `ContentView.swift` – tab navigácia (Home, Workout, Surge AI, Nutrition, Profile)
- `Views/HomeView.swift` – dashboard
- `Views/WorkoutView.swift` – tréningy
- `Views/NutritionView.swift` – výživa + voda
- `Views/AIChatView.swift` – Surge AI asistent
- `Views/OnboardingView.swift` – onboarding flow

## Poznámka

Webová verzia (Next.js) zostáva hlavná a je nasaditeľná na Vercel. iOS scaffold zdieľa rovnakú logiku UI – dáta zatiaľ lokálne v `@AppStorage`. Pre sync s webom bude potrebné API backend.
