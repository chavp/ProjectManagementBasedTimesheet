Ext.define(document.appName + '.model.MainTask', {
    extend: 'Ext.data.Model',
    xtype: 'mainTask',
    idProperty: 'ID',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'Name' }
    ],
    proxy: {
        type: 'rest',
        api: {
            create: document.urlProjectActivitiesApi + '/SaveMainTask',
            update: document.urlProjectActivitiesApi + '/UpdateMainTask',
            destroy: document.urlProjectActivitiesApi + '/DeleteMainTask'
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