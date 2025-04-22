import { Controller, Get ,Post,Put,Delete,Req, Param} from '@nestjs/common';
import { Request ,Response} from 'express';
import { CategorieService } from './categorie.service';


@Controller("Categorie")
export class CategorieController {
    constructor(private readonly userService: CategorieService)
    {}


@Post("/:id")
async creatCategorie(@Req() req:Request,@Param("id") id:string){

    try{
const newCategorie=this.userService.createCat(req.body,id);

return newCategorie;


    }catch(err){
        return err;
    }    

}



}
