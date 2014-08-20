Ext.define(document.appName + '.model.Project', {
    extend: 'Ext.data.Model',
    xtype: 'project',
    idProperty: 'ID',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'Code' },
        { name: 'Name' },
        { name: 'Display' },
        { name: 'StartDate', type: 'date', dateFormat: 'MS' },
        { name: 'EndDate', type: 'date', dateFormat: 'MS' },
        { name: 'StringStartDate' },
        { name: 'StringEndDate' },
        { name: 'CustomerID', type: 'int', defaultValue: 0, convert: null },
        { name: 'ProjectStatusID', type: 'int' },
        { name: 'ProjectStatusName' },
        { name: 'EstimateProjectValue', type: 'float' },
        { name: 'ActualProjectCost', type: 'float' },
        { name: 'IsNonProject', type: 'boolean', defaultValue: false, convert: null },
        { name: 'TotalTimesheet', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        api: {
            read: document.urlProjectApi + '/ReadProject',
            create: document.urlProjectApi + '/SaveProject',
            update: document.urlProjectApi + '/UpdateProject',
            destroy: document.urlProjectApi + '/DeleteProject'
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