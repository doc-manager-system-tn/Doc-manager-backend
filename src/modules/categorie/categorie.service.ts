import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorieEntity } from 'src/models/categorie.entity';

@Injectable()
export class CategorieService {

    constructor(@InjectRepository(CategorieEntity) private readonly categorieRepository: Repository<CategorieEntity>)
    {}

async createCat(categorie:CategorieEntity,id:string){
    const CategorieExiste=await this.verifCat(categorie.name);
    try{
        
        if(CategorieExiste){
        return "cette categorie il est deja crée !";
        }
const categorieComplet={
    ...categorie,
    user:{
        id
    }
}
        const newCategorie=this.categorieRepository.create(categorieComplet);
         this.categorieRepository.save(newCategorie);

         return newCategorie

    }catch(err){
        return err;
    }
}

async verifCat(name:string):Promise<boolean>
{
const categorie=await this.categorieRepository.findOne({
    where:{name}
});

if(categorie){
    return true;
}
return false ;


}



}