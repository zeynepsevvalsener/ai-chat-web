const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const agent = require("./agent");

admin.initializeApp();
const db = admin.firestore();

exports.onMessage = functions.firestore
  .document("chats/{chatId}/messages/{msgId}")
  .onCreate(async (snap, context) => {
    const msg = snap.data();
    if (msg.sender !== "user") return;

    // İşleniyor durumuna al
    await snap.ref.update({ status: "processing" });

    // Intent/parametre çıkar
    const { intent, params } = await agent.parse(msg.text);
    const userToken = msg.token;  // React'ten geldi

    // Gateway’e gönder
    const res = await fetch("https://<your-gateway>.onrender.com/call-midterm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.GATEWAY_API_KEY,
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({ intent, params })
    });
    const payload = await res.json();

    // Bot yanıtını ekle
    await db
      .collection("chats").doc(context.params.chatId)
      .collection("messages")
      .add({
        sender: "bot",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        intent,
        raw: payload
      });
  });
