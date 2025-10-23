/**
 * Foundry Messaging Submodule
 * Provides presence management, read receipts, and message delivery utilities.
 */

/// <reference path="./firebase-stubs.d.ts" />

import { getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

// ✅ Ensure Firebase Admin is initialized exactly once
if (!getApps().length) {
    initializeApp();
}

const db = getFirestore();

/**
 * Update a user's presence status.
 * Called when user connects or disconnects.
 */
export const updatePresence = async (userId: string, status: "online" | "offline") => {
    const ref = db.collection("presence").doc(userId);
    await ref.set(
        {
            status,
            lastSeen: FieldValue.serverTimestamp(),
        },
        { merge: true }
    );
    console.log(`✅ Presence updated for ${userId}: ${status}`);
};

/**
 * Update read receipts for a message.
 */
export const setReadReceipt = async (conversationId: string, messageId: string, userId: string) => {
    const ref = db
        .collection("conversations")
        .doc(conversationId)
        .collection("messages")
        .doc(messageId);

    await ref.update({
        [`readBy.${userId}`]: FieldValue.serverTimestamp(),
    });

    console.log(`✅ Read receipt set for message ${messageId} by ${userId}`);
};

/**
 * Send a message to a conversation.
 * Handles message creation with timestamp and optional metadata.
 */
export const sendMessage = async (
    conversationId: string,
    senderId: string,
    text: string,
    metadata: Record<string, any> = {}
) => {
    const ref = db.collection("conversations").doc(conversationId).collection("messages").doc();

    const payload = {
        senderId,
        text,
        timestamp: FieldValue.serverTimestamp(),
        ...metadata,
    };

    await ref.set(payload);
    console.log(`💬 Message sent to ${conversationId} by ${senderId}`);
    return ref.id;
};