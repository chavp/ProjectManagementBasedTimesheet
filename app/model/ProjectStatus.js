Ext.define(document.appName + '.model.ProjectStatus', {
    extend: 'Ext.data.Model',
    xtype: 'projectStatus',
    idProperty: 'ID',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'Name', type: 'string' }
    ]
});