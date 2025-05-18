import { Body, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenRouterService {
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  // remplace par ton token

  async ask(prompt: string)/*: Promise<string>*/ {
    const details:string="en utilisant le format HTML avec des balises , et en incluant des styles CSS pour la couleur et la taille du texte directement dans les balises du <body> (comme <h2 style='color: #e67e23; font-weight: bold;'>, <p style='font-size: 10pt;'> et autres) ? et tu peux utliser n'import quel coleur il n' ya un couleur spécifique et dans la balise body je veux pas des style je veux a l'interieur de body comme ca <body>//code  </body> et je veux pas voir le <!DOCTYPE html> ,<html>,<head> juste le <body>//code  </body> ";
    try {
      const response = await axios.post(
        this.API_URL,
        {
          model: /*'mistralai/mixtral-8x7b'*/'openrouter/auto',
          messages: [
            { role: 'user', content: `${prompt}  ${details}` }
          ],
          max_tokens: 800
        },
        {
          headers: {
            'Authorization': `Bearer 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`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000', // optionnel, mais recommandé
            'X-Title': 'MyApp', 
          }
        }
      );

     /* if (response?.data?.choices[0]) {
        return response.data.choices[0].message?.content;
      } else {
        throw new Error('La réponse ne contient pas de données attendues '+response);
      }*/
     return response;
    } catch (error) {
      console.error('Erreur OpenRouter:', error?.response?.data || error.message);
      throw new Error('Erreur lors de la génération AI');
    }
  }
 async getBody(content:string){
    const body=content?.split("<body>")[1];
    console.log(content)

   return body
  }



}



