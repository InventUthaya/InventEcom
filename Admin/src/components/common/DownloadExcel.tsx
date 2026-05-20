import * as XLSX from 'xlsx';

export const downloadExcel = (data: any[], fileName: string, mergeFirstRow: boolean = false) => {
  const wb = XLSX.utils.book_new();
  
  let ws;
  if (Array.isArray(data[0]) && typeof data[0][0] !== 'object') {
    // Data is AoA (array of arrays)
    ws = XLSX.utils.aoa_to_sheet(data);
  } else {
    // Data is JSON (array of objects)
    ws = XLSX.utils.json_to_sheet(data);
  }
  
  // Style the first row (top agent info) only if mergeFirstRow is true
  if (mergeFirstRow) {
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }); // Merge first row columns
  }
  
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};