import UIKit
import FirebaseCore
import FirebaseFirestore

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        FirebaseApp.configure()
        
        // Firestore connectivity test
        let db = Firestore.firestore()
        db.collection("foundry_test").addDocument(data: ["connected": true]) { error in
            if let error = error {
                print("❌ Firebase connection failed: \(error.localizedDescription)")
            } else {
                print("✅ Firebase connection successful!")
            }
        }
        
        return true
    }
}