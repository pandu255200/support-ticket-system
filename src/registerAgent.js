import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export const registerAgent = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Ensure the document is created in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "agent",
    });

    console.log("Agent registered successfully:", user.uid);
  } catch (error) {
    console.error("Error registering agent:", error.message);
  }
};
