import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorieEntity } from 'src/models/categorie.entity';
import { createSecureServer } from 'node:http2';
import { UserEntity } from 'src/models/user.entity';
import { DocEntity } from 'src/models/document.entity';
import { error } from 'node:console';

@Injectable()
export class CategorieService {

    constructor(@InjectRepository(CategorieEntity) private readonly categorieRepository: Repository<CategorieEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity> ,
        @InjectRepository(DocEntity) private readonly docRepository: Repository<DocEntity>
          
            )
    {}

async createCat(categorie:Partial<CategorieEntity>,id:string){
   
    try{
         if(categorie.name){
 const CategorieExiste=await this.verifCat(categorie.name);
    
        
        if(CategorieExiste){
        throw new Error("cette categorie il est deja crée !");
        }
const categorieComplet={
    ...categorie,
    user:{
        id
    }
}
        const newCategorie=this.categorieRepository.create(categorieComplet);
        const newCategorie1=await  this.categorieRepository.save(newCategorie);

         return newCategorie1

    }else{
        throw new Error("le non de categorie est undefined ")}
   
    }catch(err){
        throw err;
    }
}

async verifCat(name:string):Promise<boolean>
{
    try{
const categorie=await this.categorieRepository.findOne({
    where:{name}
});

if(categorie){
    return true;
}
return false ;
    }catch(err){
        throw err;
    }



}

async getMesCat(userId: string): Promise<CategorieEntity[]> {
  try {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['memberGroups'],
    });

    if (!user) throw new Error("Utilisateur non trouvé");

    const groupIds = user.memberGroups.map((g) => g.id);

    const cats = await this.categorieRepository
      .createQueryBuilder('categorie')
      .leftJoinAndSelect('categorie.docs', 'doc')
      .leftJoinAndSelect('categorie.user', 'user')
      .leftJoin('doc.groupes', 'groupe')
      .where('user.id = :userId', { userId })
      .orWhere('groupe.id IN (:...groupIds)', { groupIds: groupIds.length ? groupIds : ['null'] })
      .getMany();

    if (cats.length === 0) throw new Error("Aucune catégorie trouvée");

    return cats;
  } catch (err) {
    throw err;
  }
}
async addCat(docId:string,catId:string):Promise<void>
{
try{
const doc=await this.docRepository.findOne({
    where:{id:docId},
    relations:['categories']
});
const cat=await this.categorieRepository.findOne({
    where:{
        id:catId}
});
if(!doc) throw new Error("doc not found");
if(!cat) throw new Error("cat not found");
if(doc.categories.some(cat=>cat.id===catId)) throw new Error("ce document est deja ajouter sur cette catégorie");
doc.categories.push(cat);
 await this.docRepository.save(doc);

}catch(err){
    throw err;
}
}

}