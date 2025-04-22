// src/chat/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FirebaseService } from './firebase/firebase.service';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true, namespace: '/' })
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  // Connexion d'un utilisateur
  handleConnection(client: Socket) {
    this.logger.log(`Client connecté: ${client.id}`);
  }

  // Déconnexion d'un utilisateur
  handleDisconnect(client: Socket) {
    this.logger.log(`Client déconnecté: ${client.id}`);
  }

  // Joindre une room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { senderId: string; receiverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = this.generateRoomName(data.senderId, data.receiverId);
    client.join(roomName);
    this.logger.log(`Client ${client.id} a rejoint la room ${roomName}`);
  }

  // Récupérer les anciens messages
  @SubscribeMessage('loadMessages')
  async handleLoadMessages(
    @MessageBody() data: { senderId: string; receiverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.firebaseService.getMessages(data.senderId, data.receiverId);
    client.emit('messagesLoaded', messages);
  }

  // Envoyer un message
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: { senderId: string; receiverId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = this.generateRoomName(data.senderId, data.receiverId);

    // Sauvegarder dans Firestore
    await this.firebaseService.saveMessage(data.senderId, data.receiverId, data.content);

    // Émettre dans la room
    this.server.to(roomName).emit('newMessage', {
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content,
    });
  }

  // Génère un nom unique de room basé sur les deux IDs
  private generateRoomName(senderId: string, receiverId: string): string {
    const sorted = [senderId, receiverId].sort();
    return `room-${sorted[0]}-${sorted[1]}`;
  }
}

  