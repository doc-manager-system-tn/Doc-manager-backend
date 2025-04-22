// src/firebase/firebase.service.ts
import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { service_account } from 'src/common/service.accountkey';

@Injectable()
export class FirebaseService {
  private db: FirebaseFirestore.Firestore;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(service_account as admin.ServiceAccount),
    });

    this.db = admin.firestore();
  }

  async saveMessage(senderId: string, receiverId: string, content: string) {
    const roomName = generateRoomName(senderId, receiverId);
    const message = {
      senderId,
      receiverId,
      content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    await this.db.collection('chats').doc(roomName).collection('messages').add(message);
  }

  async getMessages(senderId: string, receiverId: string) {
    const roomName = generateRoomName(senderId, receiverId);
    const snapshot = await this.db
      .collection('chats')
      .doc(roomName)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get();
    return snapshot.docs.map((doc) => doc.data());
  }
}

function generateRoomName(senderId: string, receiverId: string): string {
  const sorted = [senderId, receiverId].sort();
  return `room-${sorted[0]}-${sorted[1]}`;
}

