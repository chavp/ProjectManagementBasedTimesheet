Ext.define(document.appName + '.model.Department', {
    extend: 'Ext.data.Model',
    xtype: 'department',
    idProperty: 'ID',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'NameTH', type: 'string' },
        { name: 'NameEN', type: 'string' },
        { name: 'DepartmentID', type: 'int' },
        { name: 'Department', type: 'string' },
        { name: 'TotalPerson', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        api: {
            read: document.urlOrganizationApi + '/ReadDepartment',
            create: document.urlOrganizationApi + '/SaveDepartment',
            update: document.urlOrganizationApi + '/UpdateDepartment',
            destroy: document.urlOrganizationApi + '/DeleteDepartment'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        },
        listeners: {
            exception: function (proxy, response, operation) {
                var json = Ext.decode(response.responseText);
                if (json) {
                    Ext.MessageBox.show({
                        title: 'เกิดข้อผิดพลาดจากการดำเนินการ',
                        msg: json.message,
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                } else {
                    Ext.MessageBox.show({
                        title: 'REMOTE EXCEPTION',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        }
    }
});