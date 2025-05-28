import { Body, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenRouterService {
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  // remplace par ton token

  async ask(prompt: string)/*: Promise<string>*/ {
    const details:string=`Génère uniquement le contenu HTML suivant le format demandé :Donne-moi uniquement un bloc HTML contenant la balise <body> avec à l’intérieur du texte de ${prompt}. Utilise des balises <h2> et <p> avec des styles CSS directement dans chaque balise (ex: <h2 style=>, <p style=>).Aucune autre balise ne doit être incluse, pas de <html>, <head> ou <!DOCTYPE html>.N'inclus aucun commentaire, aucune explication, aucun message supplémentaire.Réponds uniquement avec le code HTML comme dans l'exemple <body> ... </body>`;
    try {
      const response = await axios.post(
        this.API_URL,
        {
          model: /*'mistralai/mixtral-8x7b   openrouter/auto'*/'mistralai/mistral-7b-instruct',
          messages: [
            { role: 'user', content: details }
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
    const body=content?.split("<body")[1];
    console.log(content)

   return body
  }



}



