import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem { Label("Home", systemImage: "house.fill") }
                .tag(0)

            WorkoutView()
                .tabItem { Label("Workout", systemImage: "dumbbell.fill") }
                .tag(1)

            AIChatView()
                .tabItem { Label("Surge AI", systemImage: "wand.and.stars") }
                .tag(2)

            NutritionView()
                .tabItem { Label("Nutrition", systemImage: "leaf.fill") }
                .tag(3)

            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.fill") }
                .tag(4)
        }
        .tint(Color(red: 0, green: 1, blue: 0.4))
    }
}

#Preview {
    ContentView()
}
