Ext.define(document.appName + '.store.ReportTypeStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.reportTypeStore',
    model: document.appName + '.model.ReportType',
    pageSize: 99999,
    autoLoad: true,
    autoSync: false,

    proxy: {
        type: 'ajax',
        api: {
            read: document.urlReportingApi + '/ReadReportType'
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
                msg: 'เกิดข้อผิดพลาดในการค้นข้อมูล ReportType '
                    + response.status + ": "
                    + response.statusText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    }
});