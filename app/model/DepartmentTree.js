Ext.define(document.appName + '.model.DepartmentTree', {
    extend: 'Ext.data.Model',
    xtype: 'departmentTree',
    idProperty: 'ID',
    fields: [{
        name: 'ID'
    }, {
        name: 'DepartmentID'
    }, {
        name: 'Department',
        type: 'string'
    }, {
        name: 'PositionID',
        type: 'string'
    }, {
        name: 'Position',
        type: 'string'
    }, {
        name: 'ProjectRoleRateCost',
        type: 'float'
    }],
    proxy: {
        type: 'rest',
        api: {
            destroy: document.urlOrganizationApi + '/DeleteDepartment'
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