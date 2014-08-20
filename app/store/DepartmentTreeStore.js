Ext.define(document.appName + '.store.DepartmentTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'widget.departmentTreeStore',
    model: document.appName + '.model.DepartmentTree',
    autoLoad: false,
    autoSync: false,
    //pageSize: 99999,

    proxy: {
        type: 'ajax',
        extraParams: {
            departmentID: 0
        },
        api: {
            read: document.urlOrganizationApi + '/ReadDepartmentTree'
            //,
            //create: document.urlEmployeeApi + '/CreateEmployee',
            //update: document.urlEmployeeApi + '/UpdateEmployee',
            //destroy: document.urlEmployeeApi + '/DeleteEmployee'
        }
    },

    initComponent: function () {
        var self = this;

        self.callParent();
    }
});