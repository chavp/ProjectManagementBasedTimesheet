Ext.define(document.appName + '.store.TaskTypeStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.taskTypeStore',
    model: document.appName + '.model.TaskType',
    pageSize: 99999,
    autoLoad: false,
    autoSync: false,

    proxy: {
        type: 'ajax',
        api: {
            read: document.urlTimesheetApi + '/ReadTaskType'
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
                msg: 'เกิดข้อผิดพลาดในการค้นข้อมูล TaskType '
                    + response.status + ": "
                    + response.statusText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    }
});