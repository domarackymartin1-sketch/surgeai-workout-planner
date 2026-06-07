import SwiftUI

struct HomeView: View {
    @AppStorage("userName") private var userName = "Atleta"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    HStack {
                        Image(systemName: "bolt.fill")
                            .foregroundStyle(.green)
                        Text("SURGEAI")
                            .font(.headline.bold())
                        Spacer()
                    }
                    .padding(.horizontal)

                    Text("Ahoj, \(userName)! 👋")
                        .font(.title2.bold())
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal)

                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.white.opacity(0.08))
                        .frame(height: 120)
                        .overlay(Text("Týždenný kalendár").foregroundStyle(.secondary))

                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.white.opacity(0.08))
                        .frame(height: 100)
                        .overlay(Text("Týždenný prehľad").foregroundStyle(.secondary))
                }
                .padding(.vertical)
            }
            .background(Color.black)
            .navigationBarHidden(true)
        }
    }
}
