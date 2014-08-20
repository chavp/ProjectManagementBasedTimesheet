Ext.define(document.appName + '.model.Timesheet', {
    extend: 'Ext.data.Model',
    xtype: 'timesheet',
    idProperty: 'ID',
    fields: [
        { name: 'ID' },
        { name: 'ProjectID', type: 'number' },
        { name: 'ProjectCode' },
        { name: 'ProjectName' },
        { name: 'StartDate', type: 'date', dateFormat: 'MS' },
        { name: 'StartDateText' },
        { name: 'Phase' },
        { name: 'PhaseID', type: 'number' },
        { name: 'TaskType' },
        { name: 'TaskTypeID', type: 'number' },
        { name: 'MainTaskDesc' },
        { name: 'SubTaskDesc' },
        { name: 'HourUsed', type: 'number' },
        { name: 'IsOT', type: 'boolean', defaultValue: false, convert: null }
    ],
    proxy: {
        type: 'rest',
        api: {
            //read: document.urlEmployeeApi + '/ReadEmployee',
            create: document.urlTimesheetApi + '/SaveTimesheet',
            update: document.urlTimesheetApi + '/UpdateTimesheet',
            destroy: document.urlTimesheetApi + '/DeleteTimesheet'
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