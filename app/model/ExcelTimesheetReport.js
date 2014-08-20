Ext.define(document.appName + '.model.ExcelTimesheetReport', {
    extend: 'Ext.data.Model',
    xtype: 'excelTimesheetReport',
    fields: [
        { name: 'ReportID', type: 'int' },
        { name: 'FromDate', type: 'date', dateFormat: 'MS' },
        { name: 'ToDate', type: 'date', dateFormat: 'MS' },
        { name: 'CheckAllTime', type: 'boolean' },
        { name: 'ProjectID', type: 'int' },
        { name: 'EmployeeID', type: 'int' },
        { name: 'DepartmentID', type: 'int' }
    ]
});