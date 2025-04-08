import { Request ,Response} from 'express';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/jwt-access.guard';
import { AuthenticatedRequest } from 'src/common/response.interface';
import { GroupeService } from './groupe.service';


@Controller("groupe")
export class GroupeController {
  constructor(private readonly groupeService: GroupeService) {} 





}