import { Request } from 'express';


export interface IResponse<T> {
    data?: T[] | T;//any
    count?: number;
    totalPages?: number;
    currentPage?: number;
    status: IMessage;
    [key: string]: any;
  }
  
  
  export interface IMessage {
    message: string;
    code: number;
  }

  // src/interfaces/request.interface.ts


export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    // Ajoutez toutes les autres propriétés nécessaires
    refreshToken: string; // Optionnel si utilisé pour le refresh
    
  };
}