const admin = require("firebase-admin");
const serviceAccount = require("./permissions.json");

// Initialize Firebase Admin SDK if it hasn't been already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const app = admin.app(); // Get the default app

module.exports = { db, app, admin }; // Export admin too, might be useful
