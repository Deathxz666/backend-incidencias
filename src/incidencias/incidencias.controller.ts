import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IncidenciasService } from './incidencias.service';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { QueryIncidenciasDto } from './dto/query-incidencias.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('incidencias')
@UseGuards(AuthGuard('jwt'))
export class IncidenciasController {
  constructor(private readonly incidenciasService: IncidenciasService) {}

  @Post()
  create(@Body() dto: CreateIncidenciaDto, @Req() req) {
    return this.incidenciasService.create(dto, req.user.email);
  }

  @Get()
  findAll(@Req() req, @Query() query: QueryIncidenciasDto) {
    return this.incidenciasService.findAll(req.user.role, req.user.email, query);
  }

  @Get('soluciones')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findSoluciones(@Req() req, @Query() query: QueryIncidenciasDto) {
    return this.incidenciasService.getSoluciones(req.user.role, req.user.email, query);
  }

  @Get('reportes')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getReportes(@Req() req, @Query() query: QueryIncidenciasDto) {
    return this.incidenciasService.getReportes(req.user.role, query, req.user.email);
  }

  @Get('reportes/pdf')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getReportesPdf(@Req() req, @Query() query: QueryIncidenciasDto, @Res() res: Response) {
    const pdfBuffer = await this.incidenciasService.getReportesPdf(
      req.user.role,
      query,
      req.user.email,
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=\"reporte-incidencias-${Date.now()}.pdf\"`,
    );
    return res.send(pdfBuffer);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIncidenciaDto, @Req() req) {
    return this.incidenciasService.update(id, dto, req.user.email, req.user.role);
  }

  @Patch(':id/estado')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateEstado(@Param('id') id: string, @Body() dto: UpdateEstadoDto, @Req() req) {
    return this.incidenciasService.updateEstado(id, dto, req.user.email, req.user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string, @Req() req) {
    return this.incidenciasService.remove(id, req.user.role);
  }
}

