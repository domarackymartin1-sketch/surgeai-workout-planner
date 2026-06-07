import SwiftUI

struct OnboardingView: View {
    let onComplete: () -> Void
    @State private var name = ""
    @State private var step = 0

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            Image(systemName: "bolt.fill")
                .font(.system(size: 48))
                .foregroundStyle(.green)

            Text(step == 0 ? "Silnejší každý deň." : "Ako sa voláš?")
                .font(.largeTitle.bold())
                .multilineTextAlignment(.center)

            if step == 1 {
                TextField("Tvoje meno", text: $name)
                    .textFieldStyle(.roundedBorder)
                    .padding(.horizontal, 32)
            }

            Spacer()

            Button(action: advance) {
                Text(step == 0 ? "Začať" : "Pokračovať")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .foregroundStyle(.black)
                    .clipShape(Capsule())
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 32)
            .disabled(step == 1 && name.isEmpty)
        }
        .background(Color.black)
        .foregroundStyle(.white)
    }

    private func advance() {
        if step == 0 {
            step = 1
        } else {
            UserDefaults.standard.set(name, forKey: "userName")
            onComplete()
        }
    }
}
