Ext.define(document.appName + '.store.MainTaskStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.mainTaskStore',
    model: document.appName + '.model.MainTask',
    pageSize: 99999,
    autoLoad: false,
    autoSync: false,

    proxy: {
        type: 'ajax',
        api: {
            read: document.urlTimesheetApi + '/ReadMainTask'
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
    },
    listeners: {
        write: function (store, operation) {
        },
        exception: function (proxy, response, options) {
            Ext.MessageBox.show({
                title: TextLabel.errorAlertTitle,
                msg: 'เกิดข้อผิดพลาดในการค้นข้อมูล MainTask '
                    + response.status + ": "
                    + response.statusText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    }
});