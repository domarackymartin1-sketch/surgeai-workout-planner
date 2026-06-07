import SwiftUI

struct AIChatView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var input = ""
    @State private var messages: [(String, Bool)] = [
        ("Ahoj! Som Surge AI, tvoj tréningový asistent. Na čo sa chceš spýtať?", false)
    ]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 12) {
                        ForEach(Array(messages.enumerated()), id: \.offset) { _, msg in
                            HStack {
                                if msg.1 { Spacer() }
                                Text(msg.0)
                                    .padding(12)
                                    .background(msg.1 ? Color.white : Color.white.opacity(0.1))
                                    .foregroundStyle(msg.1 ? .black : .white)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                if !msg.1 { Spacer() }
                            }
                        }
                    }
                    .padding()
                }

                HStack {
                    TextField("Správa pre Surge AI...", text: $input)
                        .textFieldStyle(.roundedBorder)
                    Button(action: send) {
                        Image(systemName: "paperplane.fill")
                    }
                    .disabled(input.isEmpty)
                }
                .padding()
            }
            .background(Color.black)
            .navigationTitle("Surge AI")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private func send() {
        let text = input.trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return }
        messages.append((text, true))
        input = ""
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            messages.append(("Skvelá otázka! Odporúčam kombinovať compound cviky s progresívnym zaťažením 3–4× týždenne.", false))
        }
    }
}
