import SwiftUI

struct WorkoutView: View {
    var body: some View {
        NavigationStack {
            List {
                Section("Plány") {
                    Label("Push Day", systemImage: "figure.strengthtraining.traditional")
                    Label("Pull Day", systemImage: "figure.strengthtraining.functional")
                    Label("Leg Day", systemImage: "figure.run")
                }
            }
            .scrollContentBackground(.hidden)
            .background(Color.black)
            .navigationTitle("Workout")
        }
    }
}
