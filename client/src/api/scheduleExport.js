import ExcelJS from 'exceljs';

// Utility function to format date
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Get Monday of the week for a given date
const getMondayOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(d.setDate(diff));
};

// Get all weeks in a month
const getWeeksInMonth = (month, year) => {
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  let currentWeekStart = getMondayOfWeek(firstDay);
  
  while (currentWeekStart <= lastDay) {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Sunday
    
    weeks.push({
      start: new Date(currentWeekStart),
      end: new Date(weekEnd)
    });
    
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }
  
  return weeks;
};

// Format week name for worksheet
const formatWeekName = (startDate, endDate) => {
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
};

// Create worksheet for a single week
const createWeekWorksheet = (workbook, weekData, activities, solutionArchitects) => {
  const { start: weekStart, end: weekEnd } = weekData;
  const worksheetName = formatWeekName(weekStart, weekEnd);
  
  const worksheet = workbook.addWorksheet(worksheetName);
  
  // Set column widths
  worksheet.getColumn(1).width = 37; // TECHNICAL SUPPORT
  worksheet.getColumn(2).width = 23; // SCHEDULE
  for (let i = 3; i <= 9; i++) {
    worksheet.getColumn(i).width = 45; // Day columns (increased for more content)
  }
  worksheet.getRow(8).height =50;
  worksheet.getRow(9).height =50;
  worksheet.getRow(10).height =50;
  
  // Header styling
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
  const headerFont = { color: { argb: 'FF000000' }, bold: true, size: 16 };
  const headerFontBigger = { color: { argb: 'FF000000' }, bold: true, size: 22 };
  const headerAlignment = { horizontal: 'center', vertical: 'middle' };

  const rightAlignment = {horizontal:'right'};
  const thinBorder = {
    top: { style: 'thin' }, left: { style: 'thin' }, 
    bottom: { style: 'thin' }, right: { style: 'thin' }
  };
  
  
  // Add header - Integrated Management System
  worksheet.mergeCells('A1:B6');
  worksheet.mergeCells('I1:I6');
  worksheet.mergeCells('C1:F2');
  const headerCell = worksheet.getCell('C1');
  headerCell.value = 'Integrated Management System';
  headerCell.fill = headerFill;
  headerCell.font = headerFont;
  headerCell.alignment = headerAlignment;
  headerCell.border = thinBorder;
  
  // Add title - TECHNICAL SCHEDULE/MONITORING
  worksheet.mergeCells('C3:F6');
  const titleCell = worksheet.getCell('C3');
  titleCell.value = 'TECHNICAL SCHEDULE MONITORING';
  titleCell.fill = headerFill;
  titleCell.font = headerFontBigger;
  titleCell.alignment = headerAlignment;
  titleCell.border = thinBorder;

  worksheet.getCell('G1').value="Document No"
  worksheet.getCell('G2').value="Classification"
  worksheet.getCell('G3').value="Version Number"
  worksheet.getCell('G4').value="Date"
  worksheet.getCell('G5').value="Prepared by"
  worksheet.getCell('G6').value="Reviewed and Approved by"

  worksheet.getCell('G1').alignment= rightAlignment
  worksheet.getCell('G2').alignment= rightAlignment
  worksheet.getCell('G3').alignment= rightAlignment
  worksheet.getCell('G4').alignment= rightAlignment
  worksheet.getCell('G5').alignment= rightAlignment
  worksheet.getCell('G6').alignment= rightAlignment

  worksheet.mergeCells('A7:I7');
  const blankCell = worksheet.getCell('A7');
  blankCell.value = '';
  blankCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
  blankCell.alignment = headerAlignment;
  blankCell.border = {
    left: { style: 'thick' }, right: { style: 'thick' }
  };
  // Add week covered
  worksheet.mergeCells('B8:I8');
  const weekCell = worksheet.getCell('A8');
  weekCell.value = `WEEKLY COVERED:`;
  weekCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
  weekCell.font = { bold: true, size: 16 };
  weekCell.alignment = headerAlignment;
  weekCell.border = thinBorder;

  const weekDayCell = worksheet.getCell('B8');
  weekDayCell.value = ` ${weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} to ${weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  weekDayCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
  weekDayCell.font = { bold: true, size: 16 };
  weekDayCell.alignment =  { vertical: 'middle' }
  weekDayCell.border = thinBorder;
  
  // Generate week dates (Monday to Sunday)
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    weekDates.push(date);
  }
  
  // Day headers row
  const dayHeaderRow = worksheet.getRow(9);
  dayHeaderRow.getCell(1).value = 'TECHNICAL SUPPORT';
  dayHeaderRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' }  };
  dayHeaderRow.getCell(1).font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 16 };
  dayHeaderRow.getCell(1).alignment = headerAlignment;
  
  dayHeaderRow.getCell(2).value = 'SCHEDULE';
  dayHeaderRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' }  };
  dayHeaderRow.getCell(2).font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 16 };
  dayHeaderRow.getCell(2).alignment = headerAlignment;
  
  worksheet.mergeCells('A9:A10'); //make technical support 2 row height
  worksheet.mergeCells('B9:B10'); //make schedule 2 row height

  const dayNames = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  weekDates.forEach((date, index) => {
    const cell = dayHeaderRow.getCell(3 + index);
    cell.value = dayNames[index];
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' }  };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 16 };
    cell.alignment = headerAlignment;
  });
  
  // Date sub-headers row
  const dateHeaderRow = worksheet.getRow(10);
  weekDates.forEach((date, index) => {
    const cell = dateHeaderRow.getCell(3 + index);
    cell.value = date.toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    });
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B0F0' }  };
    cell.font = { bold: true, size: 16 };
    cell.alignment = headerAlignment;
  });
  
  // Add Solution Architect Team header
  worksheet.mergeCells('A11:I11');
  const teamHeaderCell = worksheet.getCell('A11');
  teamHeaderCell.value = 'SOLUTION ARCHITECT TEAM';
  teamHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
  teamHeaderCell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 26 };
  teamHeaderCell.border = thinBorder;
  teamHeaderCell.alignment = headerAlignment;
  
  let currentRow = 12;
  
  // Add each Solution Architect with their schedules
  solutionArchitects.forEach((solarch, index) => {
    const startRow = currentRow;
    
    // Add 4 rows for each solution architect (minimum requirement)
    for (let scheduleRow = 1; scheduleRow <= 4; scheduleRow++) {
      const row = worksheet.getRow(currentRow);
      
      // First row gets the solution architect name
      if (scheduleRow === 1) {
        row.getCell(1).value = solarch || 'Unassigned';
        row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B0F0' } };
        row.getCell(1).font = { bold: true, size: 16 };
        row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle',  wrapText: true  };
      }
      
      // Schedule column
      const scheduleCell = row.getCell(2);
      // Alternate row colors for schedule rows
      const scheduleFill = scheduleRow % 2 === 1 
        ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBDD7EE' } }
        : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
      
      scheduleCell.value = `SCHEDULE ${scheduleRow}:`;
      scheduleCell.fill = scheduleFill;
      scheduleCell.font = {color: { argb: 'FF000000' }, bold: true, size: 16 };
      scheduleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      scheduleCell.border = thinBorder;
      
      // Add activities for each day
      weekDates.forEach((date, dayIndex) => {
        const dateKey = formatDate(date);
        const dayActivities = activities.filter(activity => 
          activity.user_profile?.full_name === solarch && formatDate(new Date(activity.date)) === dateKey
        ).sort((a, b) => a.start_time.localeCompare(b.start_time));
        
        const cell = row.getCell(3 + dayIndex);
        cell.fill = scheduleFill;
        
        // Distribute activities across the 4 schedule rows
        const activitiesPerRow = Math.ceil(dayActivities.length / 4);
        const startIndex = (scheduleRow - 1) * activitiesPerRow;
        const endIndex = Math.min(startIndex + activitiesPerRow, dayActivities.length);
        const rowActivities = dayActivities.slice(startIndex, endIndex);
        
        if (rowActivities.length > 0) {
          const activityText = rowActivities.map(activity => {
            const categoryText = activity.category?.category_name ? 
              ` [${activity.category.category_name}]` : '';
            return `${activity.start_time}-${activity.end_time}: ${activity.title} ${activity.description ? ' ' + activity.description : ''} ${activity.customer?.company_name} ${categoryText}`;
          }).join('\n');
          
          cell.value = activityText;
        }
        
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.font = {color: { argb: 'FF002060' }, bold:true, size: 16 };
        // Add border to all cells
        cell.border = thinBorder;
      });

      // Set row height for better visibility
      row.height = 100;
      currentRow++;
    }
    
    // Merge the solution architect name cell vertically across all 4 rows
    if (startRow < currentRow - 1) {
      worksheet.mergeCells(`A${startRow}:A${currentRow - 1}`);
    }
    if (index < solutionArchitects.length - 1) {
        const blankRow = worksheet.getRow(currentRow);
        
        for (let col = 1; col <= 9; col++) {
        const cell = blankRow.getCell(col);
        cell.border = thinBorder;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
        }
        
        blankRow.height = 15;
        currentRow++;
    }
  });
  
  // Add borders to all header cells
  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 9; col++) {
      const cell = worksheet.getCell(row, col);
      if (!cell.border) {
        cell.border = thinBorder;
      }
    }
  }
    worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = Object.assign(cell.font || {}, { name: 'Arial' });
        });
    });
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
  
  return worksheet;
};

// Main export function
export const exportMonthlyScheduleToExcel = async (month, year, activities) => {
  try {
    // Get all unique solution architects
    const solutionArchitects = [...new Set(activities.map(activity => 
      activity.user_profile?.full_name
    ).filter(name => name))].sort();

    const hasUnassigned = activities.some(activity => !activity.user_profile?.full_name);
    if (hasUnassigned) {
      solutionArchitects.push('Unassigned');
    }
    
    // Get all weeks in the month
    const weeks = getWeeksInMonth(month, year);
    
    // Create workbook
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'Product-Solutions Architect Management Team';
    workbook.lastModifiedBy = 'Product-Solutions Architect Management Team';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Create a worksheet for each week
    weeks.forEach((week) => {
      // Filter activities for this week
      const weekActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= week.start && activityDate <= week.end;
      });
      
      createWeekWorksheet(workbook, week, weekActivities, solutionArchitects);
    });
    
    // Generate filename
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const filename = `Technical_Schedule_${monthNames[month]}_${year}.xlsx`;
    
    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true, filename };
    
  } catch (error) {
    console.error('Error exporting monthly schedule to Excel:', error);
    throw new Error(`Failed to export Excel file: ${error.message}`);
  }
};