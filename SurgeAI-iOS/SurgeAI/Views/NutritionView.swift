import SwiftUI

struct NutritionView: View {
    @State private var waterMl = 250.0

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Text("0 Kcal")
                    .font(.largeTitle.bold())

                VStack {
                    Text("Voda: \(Int(waterMl)) ml")
                        .font(.title3)
                    Slider(value: $waterMl, in: 50...1000, step: 50)
                        .tint(.blue)
                }
                .padding()
                .background(Color.white.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .padding()

                Spacer()
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black)
            .navigationTitle("Nutrition")
        }
    }
}
