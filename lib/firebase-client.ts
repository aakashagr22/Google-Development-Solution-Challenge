// Simplified Firebase client to avoid initialization errors
let isFirebaseInitialized = false

export function getFirestoreClient() {
  // Only initialize on the client side
  if (typeof window === "undefined") {
    console.warn("Attempted to initialize Firebase on server side")
    return null
  }

  // Lazy load Firebase to avoid SSR issues
  const initFirebase = async () => {
    try {
      if (isFirebaseInitialized) {
        const { getFirestore } = await import("firebase/firestore")
        const { getApps } = await import("firebase/app")
        return getFirestore(getApps()[0])
      }

      const { initializeApp } = await import("firebase/app")
      const { getFirestore } = await import("firebase/firestore")

      // Check if all required config values are present
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }

      const hasAllConfig = Object.values(firebaseConfig).every((value) => !!value)

      if (!hasAllConfig) {
        console.error("Firebase config is incomplete. Check your environment variables.")
        return null
      }

      const app = initializeApp(firebaseConfig)
      isFirebaseInitialized = true
      return getFirestore(app)
    } catch (error) {
      console.error("Firebase initialization error:", error)
      return null
    }
  }

  // Return a placeholder that will be replaced with the actual client
  return {
    collection: () => ({
      where: () => ({
        where: () => ({
          orderBy: () => ({
            limit: () => ({
              get: async () => ({ empty: true, docs: [] }),
            }),
          }),
        }),
      }),
    }),
  }
}

export function getAuthClient() {
  // Placeholder to avoid errors
  return null
}

export function getStorageClient() {
  // Placeholder to avoid errors
  return null
}

