import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class MailService {
   private apiKey:string=String(process.env.SENDGRID_API_KEY)
  constructor() {
    sgMail.setApiKey(this.apiKey); // Stocke ta clé en sécurité dans .env
  }

  async sendEmail(to: string,username:string,companyName:string) {
    try{
    // Charger le modèle HTML
    const templatePath = "C:\\Users\\moham\\OneDrive\\Documents\\DocManager\\server\\src\\modules\\mailer\\welcome.html"
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    console.log(templateSource);
    // Compiler le template Handlebars avec les variables dynamiques
    const template = handlebars.compile(templateSource);
    const htmlContent = template({ username, companyName });

      const msg = {
        to,
        from: 'mohamedaziz.werhani@eniso.u-sousse.tn', // doit être vérifiée ou appartenir à un domaine authentifié
        subject:"Accès accordé - DocManager",
        html:htmlContent,
      };
      await sgMail.send(msg);
    }catch(err){
      throw err;
    }
    
  }
}

