import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PDFDocument from 'pdfkit';
import { Incidencia } from './incidencia.entity';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { QueryIncidenciasDto } from './dto/query-incidencias.dto';
import { Estado } from '../estados/estado.entity';
import { User } from '../users/user.entity';

@Injectable()
export class IncidenciasService {
  constructor(
    @InjectRepository(Incidencia)
    private incidenciaRepository: Repository<Incidencia>,

    @InjectRepository(Estado)
    private estadoRepository: Repository<Estado>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateIncidenciaDto, userEmail: string) {
    const user = await this.userRepository.findOne({ where: { email: userEmail } });

    if (!user) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    const estadoPendiente = await this.estadoRepository.findOne({
      where: { nombre_estado: 'pendiente' },
    });

    if (!estadoPendiente) {
      throw new ForbiddenException('Estado pendiente no configurado');
    }

    const nuevaIncidencia = this.incidenciaRepository.create({
      ...createDto,
      usuario: { id_usuario: user.id_usuario },
      estado: { id_estado: estadoPendiente.id_estado },
      created_by: userEmail,
      updated_by: userEmail,
    });

    return await this.incidenciaRepository.save(nuevaIncidencia);
  }

  async findAll(role: string, userEmail: string, query: QueryIncidenciasDto) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const qb = this.incidenciaRepository
      .createQueryBuilder('incidencia')
      .leftJoinAndSelect('incidencia.usuario', 'usuario')
      .leftJoinAndSelect('incidencia.estado', 'estado');

    if (role !== 'admin') {
      qb.andWhere('usuario.email = :userEmail', { userEmail });
    }

    if (query.search) {
      const search = `%${query.search.toLowerCase()}%`;
      if (role === 'admin') {
        qb.andWhere(
          `(
            LOWER(incidencia.titulo) LIKE :search OR
            LOWER(incidencia.descripcion) LIKE :search OR
            LOWER(incidencia.clasificacion) LIKE :search OR
            LOWER(incidencia.tipo_mantenimiento) LIKE :search OR
            LOWER(COALESCE(incidencia.descripcion_solucion, '')) LIKE :search OR
            LOWER(usuario.email) LIKE :search OR
            LOWER(usuario.nombres) LIKE :search OR
            LOWER(usuario.apellido_paterno) LIKE :search OR
            LOWER(usuario.apellido_materno) LIKE :search
          )`,
          { search },
        );
      } else {
        qb.andWhere(
          `(
            LOWER(incidencia.titulo) LIKE :search OR
            LOWER(incidencia.descripcion) LIKE :search OR
            LOWER(incidencia.clasificacion) LIKE :search OR
            LOWER(incidencia.tipo_mantenimiento) LIKE :search OR
            LOWER(COALESCE(incidencia.descripcion_solucion, '')) LIKE :search
          )`,
          { search },
        );
      }
    }

    if (query.estado) {
      qb.andWhere('estado.nombre_estado = :estado', { estado: query.estado });
    }

    if (query.clasificacion) {
      qb.andWhere('incidencia.clasificacion = :clasificacion', {
        clasificacion: query.clasificacion,
      });
    }

    if (query.tipo_mantenimiento) {
      qb.andWhere('incidencia.tipo_mantenimiento = :tipoMantenimiento', {
        tipoMantenimiento: query.tipo_mantenimiento,
      });
    }

    const { fromDate, toDate } = this.getDateRange(query.from, query.to);
    if (fromDate) qb.andWhere('incidencia.fecha_creacion >= :fromDate', { fromDate });
    if (toDate) qb.andWhere('incidencia.fecha_creacion <= :toDate', { toDate });

    qb.orderBy(`incidencia.${query.sortBy || 'fecha_creacion'}`, query.sortOrder || 'DESC');

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getSoluciones(role: string, userEmail: string, query: QueryIncidenciasDto) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const qb = this.incidenciaRepository
      .createQueryBuilder('incidencia')
      .leftJoinAndSelect('incidencia.usuario', 'usuario')
      .leftJoinAndSelect('incidencia.estado', 'estado')
      .where('estado.nombre_estado = :estadoResuelta', { estadoResuelta: 'resuelta' })
      .andWhere('incidencia.descripcion_solucion IS NOT NULL')
      .andWhere("TRIM(incidencia.descripcion_solucion) <> ''");

    if (role !== 'admin') {
      qb.andWhere('usuario.email = :userEmail', { userEmail });
    }

    if (query.search) {
      const search = `%${query.search.toLowerCase()}%`;
      if (role === 'admin') {
        qb.andWhere(
          `(
            LOWER(incidencia.titulo) LIKE :search OR
            LOWER(incidencia.descripcion) LIKE :search OR
            LOWER(incidencia.descripcion_solucion) LIKE :search OR
            LOWER(usuario.email) LIKE :search OR
            LOWER(usuario.nombres) LIKE :search OR
            LOWER(usuario.apellido_paterno) LIKE :search OR
            LOWER(usuario.apellido_materno) LIKE :search
          )`,
          { search },
        );
      } else {
        qb.andWhere(
          `(
            LOWER(incidencia.titulo) LIKE :search OR
            LOWER(incidencia.descripcion) LIKE :search OR
            LOWER(incidencia.descripcion_solucion) LIKE :search
          )`,
          { search },
        );
      }
    }

    if (query.clasificacion) {
      qb.andWhere('incidencia.clasificacion = :clasificacion', {
        clasificacion: query.clasificacion,
      });
    }

    if (query.tipo_mantenimiento) {
      qb.andWhere('incidencia.tipo_mantenimiento = :tipoMantenimiento', {
        tipoMantenimiento: query.tipo_mantenimiento,
      });
    }

    const { fromDate, toDate } = this.getDateRange(query.from, query.to);
    if (fromDate) qb.andWhere('incidencia.fecha_creacion >= :fromDate', { fromDate });
    if (toDate) qb.andWhere('incidencia.fecha_creacion <= :toDate', { toDate });

    qb.orderBy('incidencia.fecha_actualizacion', 'DESC');

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async update(idIncidencia: string, updateDto: UpdateIncidenciaDto, userEmail: string, role: string) {
    const incidencia = await this.incidenciaRepository.findOne({
      where: { id_incidencia: idIncidencia },
      relations: ['usuario', 'estado'],
    });

    if (!incidencia) {
      throw new NotFoundException('Incidencia no encontrada');
    }

    this.ensureCanEdit(incidencia, userEmail, role);

    if (updateDto.descripcion_solucion !== undefined && role !== 'admin') {
      throw new ForbiddenException(
        'Solo el administrador puede registrar o editar la descripcion de solucion',
      );
    }

    incidencia.titulo = updateDto.titulo ?? incidencia.titulo;
    incidencia.descripcion = updateDto.descripcion ?? incidencia.descripcion;
    incidencia.clasificacion = updateDto.clasificacion ?? incidencia.clasificacion;
    incidencia.tipo_mantenimiento = updateDto.tipo_mantenimiento ?? incidencia.tipo_mantenimiento;
    incidencia.descripcion_solucion = updateDto.descripcion_solucion ?? incidencia.descripcion_solucion;
    incidencia.updated_by = userEmail;

    return this.incidenciaRepository.save(incidencia);
  }

  async updateEstado(idIncidencia: string, updateEstadoDto: UpdateEstadoDto, userEmail: string, role: string) {
    if (role !== 'admin') {
      throw new ForbiddenException(
        'Solo el administrador puede cambiar el estado y registrar la solucion',
      );
    }

    const incidencia = await this.incidenciaRepository.findOne({
      where: { id_incidencia: idIncidencia },
      relations: ['usuario', 'estado'],
    });

    if (!incidencia) {
      throw new NotFoundException('Incidencia no encontrada');
    }

    this.ensureCanEdit(incidencia, userEmail, role);

    const estado = await this.estadoRepository.findOne({
      where: { nombre_estado: updateEstadoDto.estado },
    });

    if (!estado) {
      throw new NotFoundException('Estado no encontrado');
    }

    if (estado.nombre_estado === 'resuelta' && !updateEstadoDto.descripcion_solucion?.trim()) {
      throw new BadRequestException(
        'La descripcion de solucion es obligatoria cuando la incidencia pasa a resuelta',
      );
    }

    incidencia.estado = estado;
    if (updateEstadoDto.descripcion_solucion !== undefined) {
      incidencia.descripcion_solucion = updateEstadoDto.descripcion_solucion.trim();
    }
    incidencia.updated_by = userEmail;

    return this.incidenciaRepository.save(incidencia);
  }

  async remove(idIncidencia: string, role: string) {
    if (role !== 'admin') {
      throw new ForbiddenException('Solo el administrador puede eliminar incidencias');
    }

    const result = await this.incidenciaRepository.delete({ id_incidencia: idIncidencia });

    if (!result.affected) {
      throw new NotFoundException('Incidencia no encontrada');
    }

    return { message: 'Incidencia eliminada correctamente' };
  }

  async getReportes(role: string, query: QueryIncidenciasDto, reportByEmail: string) {
    if (role !== 'admin') {
      throw new ForbiddenException('Solo el administrador puede ver reportes');
    }

    return this.buildReportData(query, reportByEmail);
  }

  async getReportesPdf(role: string, query: QueryIncidenciasDto, reportByEmail: string) {
    if (role !== 'admin') {
      throw new ForbiddenException('Solo el administrador puede ver reportes');
    }

    const report = await this.buildReportData(query, reportByEmail);
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    const pageWidth = doc.page.width;
    const left = 40;
    const right = pageWidth - 40;

    doc.fillColor('#111827').font('Helvetica-Bold').fontSize(19).text('REPORTE DE INCIDENCIAS', 0, 28, {
      align: 'center',
    });

    doc.y = 100;
    doc.fillColor('#111827').font('Helvetica').fontSize(10);
    doc.text(`Fecha y hora del reporte: ${new Date().toLocaleString()}`, left, doc.y);
    doc.text(`Periodo evaluado: ${report.rango.from || 'sin inicio'} - ${report.rango.to || 'sin fin'}`);
    doc.text(`Total de incidencias: ${report.total}`);

    doc.moveDown(0.8);
    const boxTop = doc.y;
    doc.roundedRect(left, boxTop, right - left, 70, 6).fillAndStroke('#EFF6FF', '#93C5FD');
    doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(11).text('Responsable del reporte', left + 10, boxTop + 10);
    doc.font('Helvetica').fontSize(10);
    doc.text(`Nombre completo: ${report.responsable.nombre_completo}`, left + 10, boxTop + 28);
    doc.text(`Correo: ${report.responsable.email}`, left + 10);
    doc.text(`Puesto: ${report.responsable.puesto} | Rol: ${report.responsable.rol}`, left + 10);

    doc.y = boxTop + 86;
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#111827').text('Resumen por estado');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10);
    Object.entries(report.por_estado).forEach(([estado, cantidad]) => {
      const color = report.estado_colores?.[estado] || '#111827';
      doc.fillColor(color).text(`- ${estado}: ${cantidad}`);
    });
    doc.fillColor('#111827');

    doc.moveDown(0.8);
    doc.font('Helvetica-Bold').fontSize(12).text('Detalle de incidencias');
    doc.moveDown(0.2);

    const columns = [
      { key: 'titulo', label: 'Titulo', width: 62 },
      { key: 'descripcion', label: 'Descripcion', width: 88 },
      { key: 'clasificacion', label: 'Clasif.', width: 48 },
      { key: 'tipo_mantenimiento', label: 'Mant.', width: 54 },
      { key: 'usuario', label: 'Usuario', width: 62 },
      { key: 'estado', label: 'Estado', width: 42 },
      { key: 'descripcion_solucion', label: 'Solucion', width: 69 },
      { key: 'fecha_creacion', label: 'Creacion', width: 45 },
      { key: 'fecha_actualizacion', label: 'Edicion', width: 45 },
    ];
    const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
    const headerHeight = 20;
    const minRowHeight = 20;
    const cellPaddingX = 4;
    const cellPaddingY = 4;
    const tableBottomLimit = doc.page.height - 40;
    const xPositions = columns.reduce<number[]>((acc, col, idx) => {
      if (idx === 0) {
        acc.push(left);
      } else {
        acc.push(acc[idx - 1] + columns[idx - 1].width);
      }
      return acc;
    }, []);

    const drawColumnSeparators = (y: number, height: number) => {
      doc.save();
      doc.strokeColor('#D1D5DB').lineWidth(0.5);
      xPositions.slice(1).forEach((x) => {
        doc.moveTo(x, y).lineTo(x, y + height).stroke();
      });
      doc.restore();
    };

    const drawTableHeader = (y: number) => {
      doc.save();
      doc.rect(left, y, tableWidth, headerHeight).fillAndStroke('#E5E7EB', '#D1D5DB');
      drawColumnSeparators(y, headerHeight);
      doc.fillColor('#111827').font('Helvetica-Bold').fontSize(7.2);
      columns.forEach((col, idx) => {
        doc.text(col.label, xPositions[idx] + cellPaddingX, y + 6, {
          width: col.width - cellPaddingX * 2,
          lineBreak: false,
        });
      });
      doc.restore();
    };

    const getRowHeight = (item: Record<string, string>) => {
      doc.font('Helvetica').fontSize(7.5);
      const heights = columns.map((col) =>
        doc.heightOfString((item[col.key] || '-').toString(), {
          width: col.width - cellPaddingX * 2,
          lineGap: 0,
        }),
      );
      return Math.max(minRowHeight, Math.ceil(Math.max(...heights) + cellPaddingY * 2));
    };

    const drawTableRow = (item: Record<string, string>, y: number, index: number, rowHeight: number) => {
      const rowColor = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
      doc.save();
      doc.rect(left, y, tableWidth, rowHeight).fillAndStroke(rowColor, '#E5E7EB');
      drawColumnSeparators(y, rowHeight);
      doc.font('Helvetica').fontSize(7.5);
      const estadoColor = item.estado_color || '#111827';
      columns.forEach((col, idx) => {
        doc.fillColor(col.key === 'estado' ? estadoColor : '#111827');
        doc.text((item[col.key] || '-').toString(), xPositions[idx] + cellPaddingX, y + cellPaddingY, {
          width: col.width - cellPaddingX * 2,
          lineGap: 0,
        });
      });
      doc.restore();
    };

    let currentY = doc.y;
    drawTableHeader(currentY);
    currentY += headerHeight;

    report.detalles.forEach((item, index) => {
      const rowHeight = getRowHeight(item as Record<string, string>);
      if (currentY + rowHeight > tableBottomLimit) {
        doc.addPage();
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#111827').text('Detalle de incidencias (continuacion)', left, 40);
        currentY = doc.y + 6;
        drawTableHeader(currentY);
        currentY += headerHeight;
      }

      drawTableRow(item as Record<string, string>, currentY, index, rowHeight);
      currentY += rowHeight;
    });

    doc.y = currentY;

    doc.end();

    return await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
    });
  }

  private async buildReportData(query: QueryIncidenciasDto, reportByEmail: string) {
    const qb = this.incidenciaRepository
      .createQueryBuilder('incidencia')
      .leftJoinAndSelect('incidencia.estado', 'estado')
      .leftJoinAndSelect('incidencia.usuario', 'usuario');

    const { fromDate, toDate } = this.getDateRange(query.from, query.to);
    if (fromDate) qb.andWhere('incidencia.fecha_creacion >= :fromDate', { fromDate });
    if (toDate) qb.andWhere('incidencia.fecha_creacion <= :toDate', { toDate });

    const incidencias = await qb.orderBy('incidencia.fecha_creacion', 'DESC').getMany();

    const porEstado = incidencias.reduce((acc, incidencia) => {
      const estado = incidencia.estado?.nombre_estado || 'sin_estado';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porUsuario = incidencias.reduce((acc, incidencia) => {
      const email = incidencia.usuario?.email || 'sin_usuario';
      acc[email] = (acc[email] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porClasificacion = incidencias.reduce((acc, incidencia) => {
      const clasificacion = incidencia.clasificacion || 'sin_clasificacion';
      acc[clasificacion] = (acc[clasificacion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porMantenimiento = incidencias.reduce((acc, incidencia) => {
      const mantenimiento = incidencia.tipo_mantenimiento || 'sin_tipo';
      acc[mantenimiento] = (acc[mantenimiento] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const reportByUser = await this.userRepository.findOne({
      where: { email: reportByEmail },
      relations: ['role'],
    });

    return {
      total: incidencias.length,
      generado_por: {
        email: reportByEmail,
        nombre: reportByUser
          ? `${reportByUser.nombres} ${reportByUser.apellido_paterno} ${reportByUser.apellido_materno}`.trim()
          : reportByEmail,
      },
      responsable: {
        id_usuario: reportByUser?.id_usuario || 'N/A',
        nombre_completo: reportByUser
          ? `${reportByUser.nombres} ${reportByUser.apellido_paterno} ${reportByUser.apellido_materno}`.trim()
          : reportByEmail,
        email: reportByUser?.email || reportByEmail,
        puesto: reportByUser?.puesto || 'No registrado',
        rol: reportByUser?.role?.nombre_rol || 'No registrado',
      },
      rango: {
        from: query.from || null,
        to: query.to || null,
      },
      por_estado: porEstado,
      estado_colores: incidencias.reduce((acc, incidencia) => {
        const estado = incidencia.estado?.nombre_estado || 'sin_estado';
        const color = incidencia.estado?.color || '#6B7280';
        acc[estado] = color;
        return acc;
      }, {} as Record<string, string>),
      por_usuario: porUsuario,
      por_clasificacion: porClasificacion,
      por_tipo_mantenimiento: porMantenimiento,
      detalles: incidencias.map((incidencia) => ({
        id_incidencia: incidencia.id_incidencia,
        titulo: incidencia.titulo,
        descripcion: incidencia.descripcion,
        clasificacion: incidencia.clasificacion || '-',
        tipo_mantenimiento: incidencia.tipo_mantenimiento || '-',
        descripcion_solucion: incidencia.descripcion_solucion || '-',
        usuario_nombre: this.formatUserName(incidencia.usuario),
        usuario: incidencia.usuario?.email || 'sin_usuario',
        estado: incidencia.estado?.nombre_estado || 'sin_estado',
        estado_color: incidencia.estado?.color || '#6B7280',
        fecha_creacion: incidencia.fecha_creacion?.toLocaleString() || '-',
        fecha_actualizacion: incidencia.fecha_actualizacion?.toLocaleString() || '-',
        updated_by: incidencia.updated_by,
      })),
    };
  }

  private formatUserName(usuario?: User | null) {
    if (!usuario) {
      return 'sin_usuario';
    }
    const parts = [usuario.nombres, usuario.apellido_paterno, usuario.apellido_materno]
      .filter(Boolean)
      .join(' ')
      .trim();
    return parts || usuario.email || 'sin_usuario';
  }

  private ensureCanEdit(incidencia: Incidencia, userEmail: string, role: string) {
    const isOwner = incidencia.usuario?.email === userEmail;
    if (role !== 'admin' && !isOwner) {
      throw new ForbiddenException('No tienes permisos para editar esta incidencia');
    }
  }

  private getDateRange(from?: string, to?: string) {
    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    if (from) {
      fromDate = new Date(from);
      if (Number.isNaN(fromDate.getTime())) {
        throw new BadRequestException('Parámetro from inválido (usa YYYY-MM-DD)');
      }
    }

    if (to) {
      toDate = new Date(to);
      if (Number.isNaN(toDate.getTime())) {
        throw new BadRequestException('Parámetro to inválido (usa YYYY-MM-DD)');
      }
      toDate.setHours(23, 59, 59, 999);
    }

    return { fromDate, toDate };
  }
}
