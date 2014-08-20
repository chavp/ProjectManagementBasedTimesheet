Ext.define(document.appName + '.store.TimesheetStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.timesheetStore',
    model: document.appName + '.model.Timesheet',
    pageSize: 99999,
    autoLoad: false,
    autoSync: false,
    proxy: {
        type: 'ajax',
        extraParams: {
            projectID: -1,
            fromDateText: "",
            toDateText: ""
        },
        api: {
            read: document.urlTimesheetApi + '/ReadTimesheet'
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
                msg: 'เกิดข้อผิดพลาดในการค้นข้อมูล Project '
                    + response.status + ": "
                    + response.statusText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    }
});