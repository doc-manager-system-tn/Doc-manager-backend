import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.getway';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  providers: [ SocketGateway, FirebaseService],
})
export class SocketModule {}
