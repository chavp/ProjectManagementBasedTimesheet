Ext.define(document.appName + '.model.Employee', {
    extend: 'Ext.data.Model',
    xtype: 'employee',
    idProperty: 'ID',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'EmployeeID' },
        { name: 'FullName' },
        { name: 'NameTH' },
        { name: 'LastTH' },
        { name: 'NameEN' },
        { name: 'LastEN' },
        { name: 'Department' },
        { name: 'DepartmentID' },
        { name: 'Position' },
        { name: 'PositionID' },
        { name: 'Nickname' },
        { name: 'Email' },
        { name: 'StartDate' },
        { name: 'AppRole' },
        { name: 'TotalTimesheet', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        api: {
            read: document.urlEmployeeApi + '/ReadEmployee',
            create: document.urlEmployeeApi + '/SaveEmployee',
            update: document.urlEmployeeApi + '/UpdateEmployee',
            destroy: document.urlEmployeeApi + '/DeleteEmployee'
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