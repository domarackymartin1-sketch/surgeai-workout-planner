import SwiftUI

struct ProfileView: View {
    @AppStorage("userName") private var userName = "Atleta"

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Circle()
                    .fill(Color.green.opacity(0.2))
                    .frame(width: 80, height: 80)
                    .overlay(Text(String(userName.prefix(1))).font(.title.bold()).foregroundStyle(.green))

                Text(userName)
                    .font(.title.bold())

                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black)
            .navigationTitle("Profile")
        }
    }
}
