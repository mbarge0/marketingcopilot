"use strict";
/**
 * Foundry Messaging Submodule
 * Provides presence management, read receipts, and message delivery utilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.setReadReceipt = exports.updatePresence = void 0;
/// <reference path="./firebase-stubs.d.ts" />
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
// ✅ Ensure Firebase Admin is initialized exactly once
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)();
}
const db = (0, firestore_1.getFirestore)();
/**
 * Update a user's presence status.
 * Called when user connects or disconnects.
 */
const updatePresence = async (userId, status) => {
    const ref = db.collection("presence").doc(userId);
    await ref.set({
        status,
        lastSeen: firestore_1.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log(`✅ Presence updated for ${userId}: ${status}`);
};
exports.updatePresence = updatePresence;
/**
 * Update read receipts for a message.
 */
const setReadReceipt = async (conversationId, messageId, userId) => {
    const ref = db
        .collection("conversations")
        .doc(conversationId)
        .collection("messages")
        .doc(messageId);
    await ref.update({
        [`readBy.${userId}`]: firestore_1.FieldValue.serverTimestamp(),
    });
    console.log(`✅ Read receipt set for message ${messageId} by ${userId}`);
};
exports.setReadReceipt = setReadReceipt;
/**
 * Send a message to a conversation.
 * Handles message creation with timestamp and optional metadata.
 */
const sendMessage = async (conversationId, senderId, text, metadata = {}) => {
    const ref = db.collection("conversations").doc(conversationId).collection("messages").doc();
    const payload = {
        senderId,
        text,
        timestamp: firestore_1.FieldValue.serverTimestamp(),
        ...metadata,
    };
    await ref.set(payload);
    console.log(`💬 Message sent to ${conversationId} by ${senderId}`);
    return ref.id;
};
exports.sendMessage = sendMessage;
