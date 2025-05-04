import { Request } from 'express';
import { DocFormat } from 'src/models/document.entity';


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
  export interface IDataFile {
    path:string,
    format:DocFormat|null,
    titre:string
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
export interface GroupeComplet<T> {
 courrentGroupe:T|null,
 parentGroupeN:string|null,
 companyGroupe:T|null

}