const TEST_PROMPT = `You are an expert Swift/SwiftUI architect analyzing both MVVM compliance AND code quality.
ANALYZE these two files for:
1. MVVM Architecture Compliance 
2. General Code Quality & Clean Code Principles

=== VIEW FILE ===
import SwiftUI

struct LoginView: View {
    @State private var username = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var errorMsg = ""
    
    var body: some View {
        VStack {
            TextField("Username", text: $username)
            SecureField("Password", text: $password)
            
            Button("Login") {
                doLogin()
            }
            .disabled(isLoading)
            
            if isLoading {
                ProgressView()
            }
            
            if !errorMsg.isEmpty {
                Text(errorMsg).foregroundColor(.red)
            }
        }
        .padding()
    }
    
    private func doLogin() {
        isLoading = true
        
        // Network call in View - VIOLATION
        URLSession.shared.dataTask(with: URL(string: "https://api.app.com/login")!) { data, response, error in
            DispatchQueue.main.async {
                self.isLoading = false
                
                if let error = error {
                    self.errorMsg = error.localizedDescription
                    return
                }
                
                // Business logic in View - VIOLATION
                if let data = data,
                   let result = try? JSONDecoder().decode([String: String].self, from: data),
                   let token = result["token"] {
                    UserDefaults.standard.set(token, forKey: "auth_token")
                    self.validateAndProcess(token)
                }
            }
        }.resume()
    }
    
    // More business logic in View - VIOLATION
    private func validateAndProcess(_ t: String) {
        if t.count > 10 && t.contains("jwt") {
            // validation logic
        }
    }
}

=== VIEWMODEL FILE ===
import Foundation

class LoginViewModel: ObservableObject {
    @Published var user: String = ""
    @Published var pass: String = ""
    @Published var loading = false
    
    // UI logic in ViewModel - VIOLATION
    func getButtonColor() -> String {
        return loading ? "gray" : "blue"
    }
    
    // Poor naming and unclear purpose
    func doStuff() {
        loading = !loading
    }
    
    // Proper ViewModel responsibility
    func authenticate() async {
        loading = true
        // Should contain the network logic from View
        loading = false
    }
}

EVALUATE against these criteria:

MVVM COMPLIANCE:
- Views: Only UI code, no business logic, no network calls, no data processing
- ViewModels: Handle state, business logic, data transformation, API calls  
- Proper separation: View observes ViewModel, correct @Published/@StateObject usage

CLEAN CODE QUALITY:
- Clear, descriptive naming (functions, variables, types)
- Single Responsibility Principle (functions do one thing)
- Proper function size (not too long/complex)
- No code duplication
- Appropriate comments where needed
- Consistent formatting and style
- Error handling where appropriate

GRADING: A file can have perfect MVVM separation but still get a low grade for poor code quality (unclear naming, massive functions, duplication, etc.)`;

module.exports = {
    TEST_PROMPT
};