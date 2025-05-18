import { Controller, Get ,Post,Put,Delete,Req, Param, Patch} from '@nestjs/common';
import { Request ,Response} from 'express';
import { CategorieService } from './categorie.service';
import { CategorieEntity } from 'src/models/categorie.entity';
import { IResponse } from 'src/common/response.interface';
import { Public } from '../auth/decorateur/public.decorateur';


@Controller("categorie")
export class CategorieController {
    constructor(private readonly catService: CategorieService)
    {}


@Post("/:id")
async creatCategorie(@Req() req:Request,@Param("id") id:string):Promise<IResponse<CategorieEntity>>
{

  const {description,name}=req.body;
  const dataC:Partial<CategorieEntity>={
    description,
    name
  }
const newCategorie=await this.catService.createCat(dataC,id);


return {
    data:newCategorie,
    status:{
        code:201,
        message:"cette categroie est crée avec success"
    }
}
}

@Get("/:id")
async getCategories(@Param("id") id:string):Promise<IResponse<CategorieEntity>>
{
const cats=await this.catService.getMesCat(id);

return {
    data:cats,
    status:{
        code:200,
        message:"les informations des catégories sont bien extracter"
    }
}
}


@Patch()
async addCat(@Req() req:Request):Promise<IResponse<void>>
{
  const {catId,docId}=req.body;
await this.catService.addCat(docId,catId);

return {
    status:{
        code:200,
        message:"ce document est bien ajouté"
    }
}
}
}
