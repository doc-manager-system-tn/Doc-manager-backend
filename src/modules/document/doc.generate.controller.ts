import { Controller, Post, Body ,Get} from '@nestjs/common';
import { IResponse } from 'src/common/response.interface';
import { Public } from '../auth/decorateur/public.decorateur';
import { OpenRouterService } from './doc.generate.service';

@Controller('docGenerate')
export class OpenRouterController {
  constructor(private readonly openRouterService: OpenRouterService) {}

  
  @Post()
  async chat(@Body('prompt') prompt: string): Promise<IResponse<any>> {
    const response = await this.openRouterService.ask(prompt);
    //const body=this.openRouterService.getBody(response?.data?.choices[0]?.message?.content)
    return {
        data:response.data,
        status:{
            code :200,
            message:"le generation des documents avec ai est active"
        }
    }
  }
}
