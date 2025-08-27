import ExcelJS from 'exceljs';

// Add this method to your customerService object
export const customerExportService = {
  async exportToExcel(data, filename = 'Customer_Information.xlsx') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Customer Information');


    worksheet.mergeCells('B1:C6');
    worksheet.getCell('B1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getCell('B1').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    // Set up the document header section (rows 1-6)
    worksheet.mergeCells('D1:F2');
    worksheet.getCell('D1').value = 'Integrated Management System';
    worksheet.getCell('D1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('D1').font = { bold: true, size: 14 };
    worksheet.getCell('D1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFb4c6e7' }
    };
    worksheet.mergeCells('D3:F6');
    worksheet.getCell('D3').value = 'Customer Information';
    worksheet.getCell('D3').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('D3').font = { bold: true, size: 22 };
    worksheet.getCell('D3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB4C6E7' }
    };

    // Document metadata in the top right
    const metadataFields = [
      'Document Number:',
      'Classification:',
      'Version Number:',
      'Date:',
      'Prepared by:',
      'Reviewed and Approved by:'
    ];

    metadataFields.forEach((field, index) => {
      const row = index + 1;
      worksheet.getCell(`G${row}`).value = field;
      worksheet.getCell(`G${row}`).font = { size: 11 };
      worksheet.getCell(`G${row}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      worksheet.getCell(`G${row}`).font.color = { argb: 'FF000000' };
      
      // Add borders to metadata cells
      ['F', 'G', 'H', 'I', 'J', 'K'].forEach(col => {
        worksheet.getCell(`${col}${row}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        worksheet.getCell(`${col}${row}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4472C4' }
        };
      });
    });

    // Column headers (row 7)
    const headers = [
      { key: '#', header: '#', width: 3 },
      { key: 'company_name', header: 'Company Name', width: 27 },
      { key: 'address', header: 'Address', width: 99 },
      { key: 'industry', header: 'Industry', width: 22 },
      { key: 'location', header: 'Location', width: 17 },
      { key: 'contact_person', header: 'Contact Person', width: 27 },
      { key: 'designation', header: 'Designation', width: 44 },
      { key: 'email_address', header: 'Email Address', width: 66 },
      { key: 'contact_number', header: 'Contact Number', width: 21 },
      { key: 'website', header: 'Website', width: 33 },
      { key: 'account_manager', header: 'Account Manager', width: 22 }
    ];

    // Set column widths
    headers.forEach((header, index) => {
      worksheet.getColumn(index + 1).width = header.width;
    });

    // Add header row
    const headerRow = worksheet.getRow(7);
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header.header;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF002060' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add data rows starting from row 8
    data.forEach((customer, index) => {
      const row = worksheet.getRow(index + 8);
      
      // Map your customer data to the expected columns
      const rowData = [
        index + 1, // Row number
        customer.company_name || '',
        customer.address || '',
        customer.industry || '',
        customer.location || '', // Adjust field name as needed
        customer.contact_person || '', // Adjust field name as needed
        customer.designation || '', // Adjust field name as needed
        customer.email || '', // Adjust field name as needed
        customer.contact_number || '', // Adjust field name as needed
        customer.website || '',
        customer.account_manager?.name || '' // From your joined data
      ];

      rowData.forEach((value, colIndex) => {
        const cell = row.getCell(colIndex + 1);
        cell.value = value;
        // cell.alignment = { wrapText:true }; uncomment if want wrapped text
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Alternate row coloring
        if (index % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9E1F2' }
          };
        }
      });
    });

    // Add borders to the main table area
    const tableRange = `A8:K${data.length + 9}`;
    const range = worksheet.getCell(tableRange.split(':')[0]).address + ':' + 
                 worksheet.getCell(tableRange.split(':')[1]).address;
  
    
    // Style the blue sidebar (column A, rows 1-6)
    for (let row = 1; row <= 6; row++) {
      const cell = worksheet.getCell(`A${row}`);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      cell.border = {right: { style: 'thin' }};
    }
    

    // Generate and download the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};