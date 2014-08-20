Ext.define(document.appName + '.model.Position', {
    extend: 'Ext.data.Model',
    xtype: 'position',
    idProperty: 'PositionID',
    fields: [
        { name: 'PositionID', type: 'int' },
        { name: 'PositionName' },
        { name: 'Order', type: 'int' },
        { name: 'ProjectRoleRateCost', type: 'float' },
        { name: 'TotalPerson', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        api: {
            read: document.urlOrganizationApi + '/ReadPosition',
            create: document.urlOrganizationApi + '/SavePosition',
            update: document.urlOrganizationApi + '/UpdatePosition',
            destroy: document.urlOrganizationApi + '/DeletePosition'
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