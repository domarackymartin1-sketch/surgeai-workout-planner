import SwiftUI

@main
struct SurgeAIApp: App {
    @AppStorage("onboardingComplete") private var onboardingComplete = false

    var body: some Scene {
        WindowGroup {
            if onboardingComplete {
                ContentView()
            } else {
                OnboardingView(onComplete: { onboardingComplete = true })
            }
        }
    }
}
