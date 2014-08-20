Ext.define(document.appName + '.model.ReportType', {
    extend: 'Ext.data.Model',
    xtype: 'reportType',
    idProperty: 'ID',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'Name' },
        { name: 'NameEN' }
    ]
});