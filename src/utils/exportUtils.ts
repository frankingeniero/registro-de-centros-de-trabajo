import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { WorkCenterData, Worker, User } from '../types';

export function exportWorkCenterToPDF(wc: WorkCenterData, workers: Worker[]): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('Registro de Centro de Trabajo', 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text('República Bolivariana de Venezuela', 105, 23, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  let y = 40;

  // Datos del centro
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Datos del Centro de Trabajo', 14, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const centerData = [
    ['Razón Social:', wc.razonSocial],
    ['RIF:', wc.rif],
    ['Tipo de Centro:', wc.tipoCentro],
    ['Estado:', wc.estado],
    ['Municipio:', wc.municipio],
    ['Parroquia:', wc.parroquia],
    ['Sector:', wc.sector],
    ['Calle:', wc.calle],
    ['N° Local/Galpón:', wc.numeroLocal],
    ['Centro Comercial:', wc.centroComercial],
    ['Es Sucursal:', wc.esSucursal],
  ];

  if (wc.esSucursal === 'Si') {
    centerData.push(['Ubicación Sede:', wc.ubicacionSucursal]);
  }

  centerData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value || 'N/A', 70, y);
    y += 6;
  });

  y += 5;

  // Persona a cargo
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Persona a Cargo', 14, y);
  y += 8;
  
  doc.setFontSize(10);
  const personData = [
    ['Nombre:', `${wc.personInCharge.nombre} ${wc.personInCharge.apellido}`],
    ['Cédula:', wc.personInCharge.cedula],
    ['Cargo:', wc.personInCharge.cargo],
    ['Teléfono:', wc.personInCharge.telefono],
    ['Email:', wc.personInCharge.email],
  ];

  personData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value || 'N/A', 70, y);
    y += 6;
  });

  y += 5;

  // Afirmaciones
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Afirmaciones o Negaciones', 14, y);
  y += 8;
  
  doc.setFontSize(10);
  const afirmData = [
    ['Elección de Delegados:', wc.eleccionDelegados],
    ['Existe Comité:', wc.existeComite],
    ['Comité Activo:', wc.comiteActivo],
  ];

  afirmData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value || 'N/A', 70, y);
    y += 6;
  });

  // Trabajadores
  if (workers.length > 0) {
    y += 10;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Listado de Trabajadores', 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Nombre y Apellido', 'Cédula', 'Cargo', 'Fecha Ingreso']],
      body: workers.map((w, i) => [
        (i + 1).toString(),
        w.nombreApellido,
        w.cedulaIdentidad,
        w.cargo,
        w.fechaIngreso,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 139, 34] },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-VE')} - Página ${i} de ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save(`centro_trabajo_${wc.razonSocial.replace(/\s/g, '_')}.pdf`);
}

export function exportWorkCenterToExcel(wc: WorkCenterData, workers: Worker[]): void {
  const wb = XLSX.utils.book_new();

  // Hoja 1: Datos del centro
  const centerSheet = XLSX.utils.aoa_to_sheet([
    ['DATOS DEL CENTRO DE TRABAJO'],
    [],
    ['Razón Social:', wc.razonSocial],
    ['RIF:', wc.rif],
    ['Tipo de Centro:', wc.tipoCentro],
    ['Estado:', wc.estado],
    ['Municipio:', wc.municipio],
    ['Parroquia:', wc.parroquia],
    ['Sector:', wc.sector],
    ['Calle:', wc.calle],
    ['N° Local/Galpón:', wc.numeroLocal],
    ['Centro Comercial:', wc.centroComercial],
    ['Es Sucursal:', wc.esSucursal],
    ['Ubicación Sede:', wc.ubicacionSucursal],
    [],
    ['PERSONA A CARGO'],
    ['Nombre:', `${wc.personInCharge.nombre} ${wc.personInCharge.apellido}`],
    ['Cédula:', wc.personInCharge.cedula],
    ['Cargo:', wc.personInCharge.cargo],
    ['Teléfono:', wc.personInCharge.telefono],
    ['Email:', wc.personInCharge.email],
    [],
    ['AFIRMACIONES O NEGACIONES'],
    ['Elección de Delegados:', wc.eleccionDelegados],
    ['Existe Comité:', wc.existeComite],
    ['Comité Activo:', wc.comiteActivo],
  ]);

  XLSX.utils.book_append_sheet(wb, centerSheet, 'Centro de Trabajo');

  // Hoja 2: Trabajadores
  if (workers.length > 0) {
    const workersSheet = XLSX.utils.aoa_to_sheet([
      ['#', 'Nombre y Apellido', 'Cédula de Identidad', 'Cargo', 'Fecha de Ingreso'],
      ...workers.map((w, i) => [i + 1, w.nombreApellido, w.cedulaIdentidad, w.cargo, w.fechaIngreso]),
    ]);
    XLSX.utils.book_append_sheet(wb, workersSheet, 'Trabajadores');
  }

  XLSX.writeFile(wb, `centro_trabajo_${wc.razonSocial.replace(/\s/g, '_')}.xlsx`);
}

export function exportAllToPDF(users: User[], workCenters: WorkCenterData[], workers: Worker[]): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('Reporte General - Todos los Registros', 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Sistema de Gestión de Centros de Trabajo', 105, 23, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  let y = 40;

  // Usuarios
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Usuarios Registrados', 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [['#', 'Correo', 'Razón Social', 'Estado', 'Fecha Registro']],
    body: users.map((u, i) => [
      (i + 1).toString(),
      u.email,
      u.razonSocial,
      u.status === 'approved' ? 'Aprobado' : u.status === 'pending' ? 'Pendiente' : 'Suspendido',
      new Date(u.createdAt).toLocaleDateString('es-VE'),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [34, 139, 34] },
  });

  // @ts-ignore
  y = doc.lastAutoTable.finalY + 15;

  // Centros de trabajo
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Centros de Trabajo', 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [['#', 'Razón Social', 'RIF', 'Tipo', 'Estado', 'Municipio']],
    body: workCenters.map((wc, i) => [
      (i + 1).toString(),
      wc.razonSocial,
      wc.rif,
      wc.tipoCentro,
      wc.estado,
      wc.municipio,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [34, 139, 34] },
  });

  // @ts-ignore
  y = doc.lastAutoTable.finalY + 15;

  // Trabajadores
  if (workers.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Todos los Trabajadores', 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Nombre y Apellido', 'Cédula', 'Cargo', 'Fecha Ingreso', 'Centro']],
      body: workers.map((w, i) => {
        const wc = workCenters.find(c => c.userId === w.userId);
        return [
          (i + 1).toString(),
          w.nombreApellido,
          w.cedulaIdentidad,
          w.cargo,
          w.fechaIngreso,
          wc?.razonSocial || 'N/A',
        ];
      }),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 139, 34] },
    });
  }

  doc.save('reporte_general_registros.pdf');
}

export function exportAllToExcel(users: User[], workCenters: WorkCenterData[], workers: Worker[]): void {
  const wb = XLSX.utils.book_new();

  // Hoja Usuarios
  const usersSheet = XLSX.utils.aoa_to_sheet([
    ['#', 'Correo', 'Razón Social', 'Estado', 'Fecha Registro', 'Último Acceso'],
    ...users.map((u, i) => [
      i + 1,
      u.email,
      u.razonSocial,
      u.status === 'approved' ? 'Aprobado' : u.status === 'pending' ? 'Pendiente' : 'Suspendido',
      new Date(u.createdAt).toLocaleDateString('es-VE'),
      u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('es-VE') : 'N/A',
    ]),
  ]);
  XLSX.utils.book_append_sheet(wb, usersSheet, 'Usuarios');

  // Hoja Centros
  const centersSheet = XLSX.utils.aoa_to_sheet([
    ['#', 'Razón Social', 'RIF', 'Tipo', 'Estado', 'Municipio', 'Parroquia', 'Sector', 'Calle', 'N° Local'],
    ...workCenters.map((wc, i) => [
      i + 1,
      wc.razonSocial,
      wc.rif,
      wc.tipoCentro,
      wc.estado,
      wc.municipio,
      wc.parroquia,
      wc.sector,
      wc.calle,
      wc.numeroLocal,
    ]),
  ]);
  XLSX.utils.book_append_sheet(wb, centersSheet, 'Centros de Trabajo');

  // Hoja Trabajadores
  if (workers.length > 0) {
    const workersSheet = XLSX.utils.aoa_to_sheet([
      ['#', 'Nombre y Apellido', 'Cédula', 'Cargo', 'Fecha Ingreso', 'Centro'],
      ...workers.map((w, i) => {
        const wc = workCenters.find(c => c.userId === w.userId);
        return [i + 1, w.nombreApellido, w.cedulaIdentidad, w.cargo, w.fechaIngreso, wc?.razonSocial || 'N/A'];
      }),
    ]);
    XLSX.utils.book_append_sheet(wb, workersSheet, 'Trabajadores');
  }

  XLSX.writeFile(wb, 'reporte_general_registros.xlsx');
}
