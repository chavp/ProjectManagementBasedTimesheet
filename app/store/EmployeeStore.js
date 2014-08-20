Ext.define(document.appName + '.store.EmployeeStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.employeeStore',
    model: document.appName + '.model.Employee',
    autoLoad: false,
    pageSize: 99999,

    proxy: {
        type: 'ajax',
        api: {
            read: document.urlEmployeeApi + '/ReadEmployee'
            //,
            //create: document.urlEmployeeApi + '/CreateEmployee',
            //update: document.urlEmployeeApi + '/UpdateEmployee',
            //destroy: document.urlEmployeeApi + '/DeleteEmployee'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        },
        writer: {
            type: 'json'
        }
    }
});