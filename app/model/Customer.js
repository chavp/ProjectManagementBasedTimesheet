Ext.define(document.appName + '.model.Customer', {
    extend: 'Ext.data.Model',
    xtype: 'customer',
    idProperty: 'ID',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'Name', type: 'string' },
        { name: 'ContactChannel', type: 'string' },
        { name: 'TotalProject', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        api: {
            read: document.urlCustomerApi + '/ReadCustomer',
            create: document.urlCustomerApi + '/SaveCustomer',
            update: document.urlCustomerApi + '/UpdateCustomer',
            destroy: document.urlCustomerApi + '/DeleteCustomer'
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