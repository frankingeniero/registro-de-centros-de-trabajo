import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CentroTrabajo, Trabajador, Usuario } from '../types';

export function exportarCentroTrabajoPDF(centro: CentroTrabajo, trabajadores: Trabajador[]) {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.setTextColor(34, 139, 34);
  doc.text('Registro de Centro de Trabajo', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-VE')}`, 105, 28, { align: 'center' });
  
  // Datos del centro
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Datos del Centro de Trabajo', 14, 42);
  
  autoTable(doc, {
    startY: 46,
    head: [],
    body: [
      ['Razón Social', centro.razonSocial],
      ['RIF', centro.rif],
      ['Tipo de Centro', centro.tipoCentro],
      ['Estado', centro.estado],
      ['Municipio', centro.municipio],
      ['Parroquia', centro.parroquia],
      ['Sector', centro.sector],
      ['Calle', centro.calle],
      ['N° Local/Galpón', centro.numeroLocal],
      ['Centro Comercial', centro.centroComercial || 'No especificado'],
      ['Es Sucursal', centro.esSucursal || 'No especificado'],
      ['Ubicación Sucursal', centro.ubicacionSucursal || 'N/A'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    styles: { fontSize: 9 },
  });

  // Persona a cargo
  doc.setFontSize(14);
  doc.text('Persona a Cargo', 14, (doc as any).lastAutoTable.finalY + 12);
  
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 16,
    body: [
      ['Nombre', `${centro.personaACargo.nombre} ${centro.personaACargo.apellido}`],
      ['Cédula', centro.personaACargo.cedula],
      ['Cargo', centro.personaACargo.cargo],
      ['Teléfono', centro.personaACargo.telefono],
      ['Correo', centro.personaACargo.correo],
    ],
    theme: 'grid',
    styles: { fontSize: 9 },
  });

  // Afirmaciones
  doc.setFontSize(14);
  doc.text('Afirmaciones / Negaciones', 14, (doc as any).lastAutoTable.finalY + 12);
  
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 16,
    body: [
      ['Elección de delegados (último trimestre)', centro.eleccionDelegados || 'No indicado'],
      ['Existe comité en el centro', centro.existeComite || 'No indicado'],
      ['¿Está activo el comité?', centro.comiteActivo || 'N/A'],
    ],
    theme: 'grid',
    styles: { fontSize: 9 },
  });

  // Trabajadores
  if (trabajadores.length > 0) {
    doc.setFontSize(14);
    doc.text('Listado de Trabajadores', 14, (doc as any).lastAutoTable.finalY + 12);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [['N°', 'Nombre y Apellido', 'Cédula', 'Cargo', 'Fecha Ingreso']],
      body: trabajadores.map((t, i) => [
        (i + 1).toString(),
        t.nombreApellido,
        t.cedulaIdentidad,
        t.cargo,
        new Date(t.fechaIngreso).toLocaleDateString('es-VE'),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [34, 139, 34] },
      styles: { fontSize: 8 },
    });
  }

  doc.save(`centro_trabajo_${centro.razonSocial.replace(/\s/g, '_')}.pdf`);
}

export function exportarCentroTrabajoExcel(centro: CentroTrabajo, trabajadores: Trabajador[]) {
  const wb = XLSX.utils.book_new();
  
  // Hoja 1: Datos del centro
  const datosCentro = [
    ['DATOS DEL CENTRO DE TRABAJO'],
    [],
    ['Razón Social', centro.razonSocial],
    ['RIF', centro.rif],
    ['Tipo de Centro', centro.tipoCentro],
    ['Estado', centro.estado],
    ['Municipio', centro.municipio],
    ['Parroquia', centro.parroquia],
    ['Sector', centro.sector],
    ['Calle', centro.calle],
    ['N° Local/Galpón', centro.numeroLocal],
    ['Centro Comercial', centro.centroComercial || 'No especificado'],
    ['Es Sucursal', centro.esSucursal || 'No especificado'],
    [],
    ['PERSONA A CARGO'],
    ['Nombre', `${centro.personaACargo.nombre} ${centro.personaACargo.apellido}`],
    ['Cédula', centro.personaACargo.cedula],
    ['Cargo', centro.personaACargo.cargo],
    ['Teléfono', centro.personaACargo.telefono],
    ['Correo', centro.personaACargo.correo],
    [],
    ['AFIRMACIONES / NEGACIONES'],
    ['Elección de delegados', centro.eleccionDelegados || 'No indicado'],
    ['Existe comité', centro.existeComite || 'No indicado'],
    ['Comité activo', centro.comiteActivo || 'N/A'],
  ];
  
  const ws1 = XLSX.utils.aoa_to_sheet(datosCentro);
  XLSX.utils.book_append_sheet(wb, ws1, 'Centro de Trabajo');
  
  // Hoja 2: Trabajadores
  if (trabajadores.length > 0) {
    const datosTrabajadores = [
      ['N°', 'Nombre y Apellido', 'Cédula de Identidad', 'Cargo', 'Fecha de Ingreso'],
      ...trabajadores.map((t, i) => [
        i + 1,
        t.nombreApellido,
        t.cedulaIdentidad,
        t.cargo,
        new Date(t.fechaIngreso).toLocaleDateString('es-VE'),
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(datosTrabajadores);
    XLSX.utils.book_append_sheet(wb, ws2, 'Trabajadores');
  }
  
  XLSX.writeFile(wb, `centro_trabajo_${centro.razonSocial.replace(/\s/g, '_')}.xlsx`);
}

export function exportarTodosRegistrosPDF(centros: CentroTrabajo[], usuarios: Usuario[], trabajadores: Trabajador[]) {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(34, 139, 34);
  doc.text('Reporte General - Todos los Registros', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toLocaleString('es-VE')}`, 105, 28, { align: 'center' });
  
  // Usuarios
  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.text('Usuarios Registrados', 14, 40);
  
  autoTable(doc, {
    startY: 44,
    head: [['Correo', 'Razón Social', 'Estado', 'Fecha Registro']],
    body: usuarios.map(u => [u.correo, u.razonSocial, u.estado, new Date(u.fechaRegistro).toLocaleDateString('es-VE')]),
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    styles: { fontSize: 8 },
  });
  
  // Centros
  doc.setFontSize(13);
  doc.text('Centros de Trabajo', 14, (doc as any).lastAutoTable.finalY + 12);
  
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 16,
    head: [['Razón Social', 'RIF', 'Tipo', 'Estado', 'Municipio']],
    body: centros.map(c => [c.razonSocial, c.rif, c.tipoCentro, c.estado, c.municipio]),
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    styles: { fontSize: 8 },
  });
  
  // Trabajadores
  if (trabajadores.length > 0) {
    doc.setFontSize(13);
    doc.text('Todos los Trabajadores', 14, (doc as any).lastAutoTable.finalY + 12);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [['Nombre', 'Cédula', 'Cargo', 'Fecha Ingreso', 'Centro']],
      body: trabajadores.map(t => {
        const centro = centros.find(c => c.id === t.centroTrabajoId);
        return [t.nombreApellido, t.cedulaIdentidad, t.cargo, new Date(t.fechaIngreso).toLocaleDateString('es-VE'), centro?.razonSocial || 'N/A'];
      }),
      theme: 'grid',
      headStyles: { fillColor: [34, 139, 34] },
      styles: { fontSize: 8 },
    });
  }
  
  doc.save('reporte_general_registros.pdf');
}

export function exportarTodosRegistrosExcel(centros: CentroTrabajo[], usuarios: Usuario[], trabajadores: Trabajador[]) {
  const wb = XLSX.utils.book_new();
  
  // Hoja Usuarios
  const datosUsuarios = [
    ['Correo', 'Razón Social', 'Estado', 'Rol', 'Fecha Registro'],
    ...usuarios.map(u => [u.correo, u.razonSocial, u.estado, u.rol, new Date(u.fechaRegistro).toLocaleDateString('es-VE')]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosUsuarios), 'Usuarios');
  
  // Hoja Centros
  const datosCentros = [
    ['Razón Social', 'RIF', 'Tipo', 'Estado', 'Municipio', 'Parroquia', 'Persona a Cargo'],
    ...centros.map(c => [c.razonSocial, c.rif, c.tipoCentro, c.estado, c.municipio, c.parroquia, `${c.personaACargo.nombre} ${c.personaACargo.apellido}`]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosCentros), 'Centros de Trabajo');
  
  // Hoja Trabajadores
  if (trabajadores.length > 0) {
    const datosTrabajadores = [
      ['Nombre', 'Cédula', 'Cargo', 'Fecha Ingreso', 'Centro'],
      ...trabajadores.map(t => {
        const centro = centros.find(c => c.id === t.centroTrabajoId);
        return [t.nombreApellido, t.cedulaIdentidad, t.cargo, new Date(t.fechaIngreso).toLocaleDateString('es-VE'), centro?.razonSocial || 'N/A'];
      }),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosTrabajadores), 'Trabajadores');
  }
  
  XLSX.writeFile(wb, 'reporte_general_registros.xlsx');
}
