// api/excelExport.js
import ExcelJS from 'exceljs';

export const excelExportService = {
  /**
   * Export activities data to Excel with multiple worksheets
   * @param {Array} data - Filtered activities data
   * @param {Object} filters - Applied filters
   * @param {Object} summary - Summary statistics
   * @param {Array} breakdown - Category breakdown
   * @param {Array} customerStats - Customer statistics
   */
  exportActivitiesToExcel: async (data, filters, summary, breakdown, customerStats) => {
    if (!data.length) {
      alert('No data to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const currentDate = new Date().toLocaleDateString();
    const filterText = excelExportService._generateFilterText(filters);

    // Set workbook properties
    workbook.creator = 'Activity Tracking System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Group data by Solution Architect
    const groupedBySolarch = excelExportService._groupBySolutionArchitect(data);

    // Create worksheets for each Solution Architect and Category
    for (const [solarch, activities] of Object.entries(groupedBySolarch)) {
      await excelExportService._createSolutionArchitectWorksheets(
        workbook, 
        solarch, 
        activities, 
        currentDate, 
        filterText
      );
    }

    // Create summary worksheet
    await excelExportService._createSummaryWorksheet(
      workbook, 
      summary, 
      breakdown, 
      customerStats, 
      groupedBySolarch, 
      currentDate, 
      filterText
    );

    // Generate and download the file
    const filename = `activity-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create blob and download
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
  },

  /**
   * Generate filter description text
   */
  _generateFilterText: (filters) => {
    const appliedFilters = Object.entries(filters)
      .filter(([key, value]) => value && value !== '')
      .map(([key, value]) => `${key}: ${value}`);
    
    return `Filtered by: ${appliedFilters.join(', ') || 'No filters applied'}`;
  },

  /**
   * Group activities by Solution Architect
   */
  _groupBySolutionArchitect: (data) => {
    return data.reduce((acc, activity) => {
      if (!acc[activity.user_profile?.full_name]) {
        acc[activity.user_profile?.full_name] = [];
      }
      acc[activity.user_profile?.full_name].push(activity);
      return acc;
    }, {});
  },

  /**
   * Create worksheets for a Solution Architect grouped by categories
   */
  _createSolutionArchitectWorksheets: async (workbook, solarch, activities, currentDate, filterText) => {
    // Group activities by category for this solution architect
    const categoriesForSolarch = activities.reduce((acc, activity) => {
      const categoryName = activity.category?.category_name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(activity);
      return acc;
    }, {});

    // Create a sheet for each category under this solution architect
    for (const [categoryName, categoryActivities] of Object.entries(categoriesForSolarch)) {
      const sheetName = excelExportService._generateSheetName(solarch, categoryName);
      
      const worksheet = workbook.addWorksheet(sheetName);
      
      await excelExportService._setupCategoryWorksheet(
        worksheet,
        solarch, 
        categoryName, 
        categoryActivities, 
        currentDate, 
        filterText
      );
    }
  },

  /**
   * Setup individual category worksheet with styling and data
   */
  _setupCategoryWorksheet: async (worksheet, solarch, categoryName, activities, currentDate, filterText) => {
    // Get category-specific headers first to determine column count
    const headers = excelExportService._getCategoryHeaders(categoryName);
    const columnCount = headers.length;
    const lastColumn = String.fromCharCode(64 + columnCount); // Convert to Excel column letter
    
    // Set page setup for single page
    worksheet.pageSetup = {
      paperSize: 9, // A4
      orientation: 'landscape',
      fitToPage: true,
      fitToHeight: 1,
      fitToWidth: 1,
      margins: {
        left: 0.5, right: 0.5, top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      }
    };

    // Set up header styling
    worksheet.getRow(1).height = 25;
    worksheet.getRow(2).height = 20;
    worksheet.getRow(3).height = 20;
    
    // Title row - merge across all columns
    worksheet.mergeCells(`A1:${lastColumn}1`);
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Activity Report - ${solarch} - ${categoryName}`;
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF305496' } // Blue background
    };

    // Date row - merge across all columns
    worksheet.mergeCells(`A2:${lastColumn}2`);
    const dateCell = worksheet.getCell('A2');
    dateCell.value = `Generated on: ${currentDate}`;
    dateCell.font = { size: 11, italic: true };
    dateCell.alignment = { horizontal: 'center' };

    // Filter row - merge across all columns
    worksheet.mergeCells(`A3:${lastColumn}3`);
    const filterCell = worksheet.getCell('A3');
    filterCell.value = filterText;
    filterCell.font = { size: 10, italic: true, color: { argb: 'FF6B7280' } };
    filterCell.alignment = { horizontal: 'center' };

    // Header row
    const headerRow = worksheet.getRow(5);
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF374151' } // Dark gray background
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Set header row height
    headerRow.height = 20;

    // Calculate minimum rows needed (15 minimum)
    const minRows = 15;
    const dataRowsNeeded = Math.max(activities.length, minRows);
    
    // Add data rows and empty rows to reach minimum
    for (let i = 0; i < dataRowsNeeded; i++) {
      const activity = activities[i]; // Will be undefined for empty rows
      const dataRow = worksheet.getRow(6 + i);
      
      if (activity) {
        const rowData = excelExportService._getCategoryRowData(activity, categoryName);
        rowData.forEach((value, colIndex) => {
          const cell = dataRow.getCell(colIndex + 1);
          cell.value = value;
          
          // Alternate row coloring
          if (i % 2 === 1) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF9FAFB' }
            };
          }
          
          // Add borders
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
          };

          // Enable text wrapping for empty rows too
          cell.alignment = { wrapText: true, vertical: 'top' };
          
          // Enable text wrapping
          cell.alignment = { ...cell.alignment, wrapText: true, vertical: 'center' };
          
          
          // Format dates
          if (colIndex === 0 && value instanceof Date) {
            cell.numFmt = 'mm/dd/yyyy';
          }
        });
      } else {
        // Empty row with borders
        for (let colIndex = 0; colIndex < columnCount; colIndex++) {
          const cell = dataRow.getCell(colIndex + 1);
          cell.value = '';
          
          // Alternate row coloring
          if (i % 2 === 1) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF9FAFB' }
            };
          }
          
          // Add borders
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
          };
        }
      }
      
      dataRow.height = 30;
    }

    // Add total row
    const totalRow = worksheet.getRow(6 + dataRowsNeeded);
    const certificationCount = activities.filter(a => a.certifications_earned).length;
    
    // Style total row
    for (let colIndex = 0; colIndex < columnCount; colIndex++) {
      const cell = totalRow.getCell(colIndex + 1);
      
      if (colIndex === columnCount - 2) { // Second to last column
        cell.value = 'Total Activities:';
        cell.font = { bold: true };
      } else if (colIndex === columnCount - 1) { // Last column
        cell.value = activities.length;
        cell.font = { bold: true };
      } else {
        cell.value = '';
      }
      
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' }
      };
      
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    
    // Add certification total row if category has certifications
    if (categoryName.toLowerCase() === 'technical training') {
      const certRow = worksheet.getRow(7 + dataRowsNeeded);
      
      for (let colIndex = 0; colIndex < columnCount; colIndex++) {
        const cell = certRow.getCell(colIndex + 1);
        
        if (colIndex === columnCount - 2) { // Second to last column
          cell.value = 'Total Certifications:';
          cell.font = { bold: true };
        } else if (colIndex === columnCount - 1) { // Last column
          cell.value = certificationCount;
          cell.font = { bold: true };
        } else {
          cell.value = '';
        }
        
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFEF3C7' }
        };
        
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'medium' },
          right: { style: 'thin' }
        };
      }
    }

    // Set column widths based on category
    excelExportService._setCategoryColumnWidths(worksheet, categoryName);
    
    // Set print area to include all content
    const printEndRow = 7 + dataRowsNeeded + (categoryName.toLowerCase() === 'technical training' ? 1 : 0);
    worksheet.pageSetup.printArea = `A1:${lastColumn}${printEndRow}`;
  },

  /**
   * Get category-specific headers
   */
  _getCategoryHeaders: (categoryName) => {
    // Base headers for all categories
    const baseHeaders = [
      'Date', 'Activity', 'Company Name', 'Location', 
      'Account Manager', 'Mode', 'Participants'
    ];

    // Category-specific additional headers
    switch (categoryName.toLowerCase()) {
      case 'client visit':
      case 'meetings attended':
        return [...baseHeaders, 'Meeting Participants', 'Technologies Discussed', 'Outcomes', 'Action Items'];
      
      case 'technical training':
        return [...baseHeaders, 'Training Provider', 'Certifications Earned'];
      
      case 'knowledge transfer':
      case 'enablement':
        return [...baseHeaders, 'Knowledge Area'];
      
      case 'attended event':
      default:
        return baseHeaders;
    }
  },

  /**
   * Get category-specific row data
   */
  _getCategoryRowData: (activity, categoryName) => {
    // Base data for all categories
    const activityDescription = activity.description ? 
      `${activity.title} | ${activity.description} | ${activity.start_time}-${activity.end_time}`.replace(/\|\s*$/, '') : 
      `${activity.title} | ${activity.start_time}-${activity.end_time}`.replace(/\|\s*$/, '');

    const baseData = [
      new Date(activity.date),
      activityDescription,
      activity.customer?.company_name || 'No customer',
      activity.customer?.location || '',
      activity.customer?.account_manager || '',
      activity.mode || '',
      activity.participants || '',
    ];

    // Category-specific additional data
    switch (categoryName.toLowerCase()) {
      case 'client visit':
      case 'meetings attended':
        return [
          ...baseData,
          activity.meeting_participants || '',
          activity.technologies_discussed || '',
          activity.outcomes || '',
          activity.action_items || ''
        ];
      
      case 'technical training':
        return [
          ...baseData,
          activity.training_provider || '',
          activity.certifications_earned || ''
        ];
      
      case 'knowledge transfer':
      case 'enablement':
        return [
          ...baseData,
          activity.knowledge_area || ''
        ];
      
      case 'attended event':
      default:
        return baseData;
    }
  },

  /**
   * Set category-specific column widths
   */
  _setCategoryColumnWidths: (worksheet, categoryName) => {
    const baseWidths = [12, 35, 35, 15, 20, 20, 20]; // Base column widths

    switch (categoryName.toLowerCase()) {
      case 'client visit':
      case 'meetings attended':
        worksheet.columns = [
          ...baseWidths.map(width => ({ width })),
          { width: 25 }, // Meeting Participants
          { width: 25 }, // Technologies Discussed
          { width: 30 }, // Outcomes
          { width: 30 }  // Action Items
        ];
        break;
      
      case 'technical training':
        worksheet.columns = [
          ...baseWidths.map(width => ({ width })),
          { width: 20 }, // Training Provider
          { width: 25 }  // Certifications Earned
        ];
        break;
      
      case 'knowledge transfer':
      case 'enablement':
        worksheet.columns = [
          ...baseWidths.map(width => ({ width })),
          { width: 25 }  // Knowledge Area
        ];
        break;
      
      case 'attended event':
      default:
        worksheet.columns = baseWidths.map(width => ({ width }));
    }
  },

  /**
   * Generate sheet name with length limit for Excel
   */
  _generateSheetName: (solarch, categoryName) => {
    const sheetName = `${solarch}-${categoryName}`;
    return sheetName.length > 31 ? sheetName.substring(0, 31) : sheetName;
  },

  /**
   * Create summary worksheet
   */
  _createSummaryWorksheet: async (workbook, summary, breakdown, customerStats, groupedBySolarch, currentDate, filterText) => {
    const worksheet = workbook.addWorksheet('Summary');

    // Set page setup for single page
    worksheet.pageSetup = {
      paperSize: 9, // A4
      orientation: 'landscape',
      fitToPage: true,
      fitToHeight: 1,
      fitToWidth: 1,
      margins: {
        left: 0.5, right: 0.5, top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      }
    };

    // Title styling - merge across all columns (A to H)
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Activity Summary Report';
    titleCell.font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F2937' }
    };
    worksheet.getRow(1).height = 30;

    // Date and filter info - merge across all columns
    worksheet.mergeCells('A2:H2');
    const dateCell = worksheet.getCell('A2');
    dateCell.value = `Generated on: ${currentDate}`;
    dateCell.font = { italic: true };
    dateCell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('A3:H3');
    const filterCell = worksheet.getCell('A3');
    filterCell.value = filterText;
    filterCell.font = { italic: true, color: { argb: 'FF6B7280' } };
    filterCell.alignment = { horizontal: 'center' };

    // Define category columns
    const categories = ['Client Visit', 'Meetings Attended', 'Enablement', 'Attended Event', 'Technical Training', 'Knowledge Transfer'];
    const headers = ['Solution Architect', ...categories, 'Total'];

    // Header row (row 5)
    const headerRow = worksheet.getRow(5);
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF374151' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    headerRow.height = 20;

    // Data rows - populate with solution architect data
    let currentRow = 6;
    const solarchTotals = {};
    const categoryTotals = categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});
    let grandTotal = 0;

    Object.entries(groupedBySolarch).forEach(([solarch, activities]) => {
      const dataRow = worksheet.getRow(currentRow);
      
      // Solution Architect name
      dataRow.getCell(1).value = solarch;
      dataRow.getCell(1).font = { bold: true };
      
      // Count activities by category for this solution architect
      const categoryCounts = categories.reduce((acc, category) => {
        const count = activities.filter(activity => 
          activity.category?.category_name === category
        ).length;
        acc[category] = count;
        categoryTotals[category] += count;
        return acc;
      }, {});
      
      // Fill category columns
      let solarchTotal = 0;
      categories.forEach((category, index) => {
        const count = categoryCounts[category];
        dataRow.getCell(index + 2).value = count;
        dataRow.getCell(index + 2).alignment = { horizontal: 'center' };
        solarchTotal += count;
      });
      
      // Total column
      dataRow.getCell(8).value = solarchTotal;
      dataRow.getCell(8).font = { bold: true };
      dataRow.getCell(8).alignment = { horizontal: 'center' };
      grandTotal += solarchTotal;
      
      // Styling for data rows
      for (let i = 1; i <= 8; i++) {
        const cell = dataRow.getCell(i);
        
        // Alternate row coloring
        if ((currentRow - 6) % 2 === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' }
          };
        }
        
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
      }
      
      dataRow.height = 18;
      currentRow++;
    });

    // Total row
    const totalRow = worksheet.getRow(currentRow + 1);
    totalRow.getCell(1).value = 'TOTAL';
    totalRow.getCell(1).font = { bold: true, size: 12 };
    
    categories.forEach((category, index) => {
      totalRow.getCell(index + 2).value = categoryTotals[category];
      totalRow.getCell(index + 2).font = { bold: true };
      totalRow.getCell(index + 2).alignment = { horizontal: 'center' };
    });
    
    totalRow.getCell(8).value = grandTotal;
    totalRow.getCell(8).font = { bold: true, size: 12 };
    totalRow.getCell(8).alignment = { horizontal: 'center' };
    
    // Style total row
    for (let i = 1; i <= 8; i++) {
      const cell = totalRow.getCell(i);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' }
      };
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'thin' },
        bottom: { style: 'medium' },
        right: { style: 'thin' }
      };
    }
    totalRow.height = 20;

    // Set column widths
    worksheet.columns = [
      { width: 20 }, // Solution Architect
      { width: 15 }, // Client Visit
      { width: 18 }, // Meetings Attended
      { width: 15 }, // Enablement
      { width: 16 }, // Attended Event
      { width: 18 }, // Technical Training
      { width: 18 }, // Knowledge Transfer
      { width: 12 }  // Total
    ];

    // Set print area
    worksheet.pageSetup.printArea = `A1:H${currentRow + 1}`;
  },

  /**
   * Export simple CSV (fallback option)
   */
  exportToCSV: (data, filename = 'activities-report.csv') => {
    if (!data.length) {
      alert('No data to export');
      return;
    }

    const csvRows = [];
    const headers = [
      'Date', 'Solution Architect', 'Activity', 'Category', 
      'Customer Company', 'Customer Location', 'Account Manager',
      'Mode', 'Participants',
      'Meeting Participants', 'Technologies Discussed', 'Outcomes', 
      'Action Items', 'Knowledge Area', 'Training Provider', 'Certifications Earned'
    ];
    csvRows.push(headers.join(","));

    data.forEach(activity => {
      const activityDescription = activity.description ? 
        `${activity.title} | ${activity.description} | ${activity.start_time}-${activity.end_time}`.replace(/\|\s*$/, '') : 
        `${activity.title} | ${activity.start_time}-${activity.end_time}`.replace(/\|\s*$/, '');

      const values = [
        new Date(activity.date).toLocaleDateString(),
        activity.user_profile?.full_name,
        activityDescription,
        activity.category?.category_name || '',
        activity.customer?.company_name || 'No customer',
        activity.customer?.location || '',
        activity.account_manager.name || '',
        activity.mode || '',
        activity.participants || '',
        activity.meeting_participants || '',
        activity.technologies_discussed || '',
        activity.outcomes || '',
        activity.action_items || '',
        activity.knowledge_area || '',
        activity.training_provider || '',
        activity.certifications_earned || ''
      ].map(value => `"${value}"`);
      
      csvRows.push(values.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};