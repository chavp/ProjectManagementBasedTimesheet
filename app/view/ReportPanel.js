Ext.define(document.appName + '.view.ReportPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'reportPanel',
    config: {
        firstDayOfMonth: '',
        toDay: '',
        employeeStore: null,
        departmentStore: null,
        projectStore: null
    },

    initComponent: function () {
        var self = this;

        var datefieldReportFromDate = Ext.create('widget.datefield', {
            fieldLabel: '',
            width: 120,
            format: 'd/m/Y',
            editable: false,
            value: self.firstDayOfMonth,
            maxValue: self.toDay,
            listeners: {
                select: function (field, value, eOpts) {
                    datefieldReportToDate.setMinValue(value);
                }
            }
        });

        var datefieldReportToDate = Ext.create('widget.datefield', {
            xtype: 'datefield',
            fieldLabel: '',
            width: 120,
            format: 'd/m/Y',
            editable: false,
            value: self.toDay,
            minValue: self.firstDayOfMonth,
            maxValue: self.toDay,
            listeners: {
                select: function (field, value, eOpts) {
                    datefieldReportFromDate.setMaxValue(value);
                }
            }
        });

        // set Default
        var setDefault = function () {
            datefieldReportFromDate.setMaxValue(datefieldReportToDate.getValue());
            datefieldReportToDate.setMinValue(datefieldReportFromDate.getValue());
        };

        var extportExcel = function () {
            var form = Ext.getCmp('searchReportsForm');

            if (!form.isValid()) {
                Ext.MessageBox.show({
                    title: TextLabel.validationTitle,
                    msg: TextLabel.validationWarning,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING
                });
                return false;
            }

            var values = form.getValues();
            //console.log(values);
            var employeeID = self.getCmbEmployee().getValue();
            var departmentID = self.getCmbDepartment().getValue();
            var projectID = self.getCmbProjectCode().getValue();
            var timesheetreport = Ext.create('widget.excelTimesheetReport', {
                ReportID: values.Name,
                FromDate: datefieldReportFromDate.getValue(),
                ToDate: datefieldReportToDate.getValue(),
                DepartmentID: departmentID,
                ProjectID: projectID,
                EmployeeID: employeeID
            });

            //console.log(timesheetreport.data);
            Ext.MessageBox.wait("กำลังสร้าง รายงาน...", 'กรุณารอ');
            Ext.Ajax.request({
                url: document.urlReportingApi + '/ExportToExcelReport',
                timeout: 120000,
                jsonData: timesheetreport.data,
                failure: function (xhr) {
                    //alert('failed  !');
                    Ext.MessageBox.hide();

                    Ext.MessageBox.show({
                        title: TextLabel.errorAlertTitle,
                        msg: xhr.responseText,
                        //width: 300,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                },
                success: function (xhr) {
                    //alert('success!');
                    Ext.MessageBox.hide();
                    var response = Ext.decode(xhr.responseText);
                    if (response.success) {
                        Ext.MessageBox.show({
                            title: TextLabel.successTitle,
                            msg: TextLabel.exportExcepSucessText,
                            //width: 300,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO,
                            fn: function (btn) {
                                window.location = response.exportUrl;
                            }
                        });
                    } else {
                        Ext.MessageBox.show({
                            title: TextLabel.errorAlertTitle,
                            msg: response.message,
                            //width: 300,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }

                }
            });
        };

        var searchReportsFieldset = Ext.create('widget.fieldset', {
            title: '<h5>' + TextLabel.criterionLabel + '</h5>',
            border: false,
            defaultType: 'field',
            defaults: {
                labelWidth: 300,
                anchor: '95%',
                allowBlank: false,
                labelAlign: 'right'
            },
            //bodyPadding: 10,
            items: [{
                xtype: 'combo',
                itemId: 'Name',
                name: 'Name',
                margin: '0 300 7 0',
                //padding: "0 300 7 0",
                store: 'ReportTypeStore',
                fieldLabel: 'ชื่อรายงาน',
                displayField: 'Name',
                valueField: 'ID',
                forceSelection: true,
                triggerAction: 'all',
                queryMode: 'local',
                allowBlank: false,
                editable: false,
                emptyText: "กรุณาเลือก",
                //width: 120,
                listeners: {
                    change: function (cmb, newValue, oldValue, eOpts) {
                        var cmbEmployee = self.getCmbEmployee();
                        cmbEmployee.setDisabled(true);
                        cmbEmployee.reset();

                        var cmbDepartment = self.getCmbDepartment();
                        cmbDepartment.setDisabled(true);
                        cmbDepartment.reset();

                        var cmbProjectCode = self.getCmbProjectCode();
                        cmbProjectCode.setDisabled(true);
                        cmbProjectCode.reset();

                        // ประวัติการทำงานของบุคคล, ต้นทุนการทำงานของบุคคล
                        if (newValue == 1 || newValue == 2) {
                            if (Roles.isManager || Roles.isAdmin || Roles.isExecutive) {
                                cmbEmployee.setDisabled(false);
                            }
                        }

                        // ประวัติการทำงานของแผนก, ต้นทุนการทำงานของแผนก
                        if (newValue == 3 || newValue == 4) {
                            if (Roles.isAdmin || Roles.isExecutive) {
                                cmbDepartment.setDisabled(false);
                            }
                        } else if (newValue == 5) {
                            cmbProjectCode.setDisabled(false);
                        }
                    }
                }
            }, {
                xtype: 'combo',
                id: 'searchReportsForm-employee',
                itemId: 'Employee',
                name: 'Employee',
                fieldLabel: 'พนักงาน',
                //store: Ext.create('widget.employeeStore', {autoLoad: true}),
                store: Ext.create('widget.employeeStore', { autoLoad: true }),
                emptyText: TextLabel.requireInputEmptyText,
                margin: '0 300 0 0',
                displayField: 'FullName',
                valueField: 'ID',
                queryMode: 'local',
                //pageSize: 10,
                minChars: 1,
                allowBlank: false,
                disabled: true,
                editable: true,
                forceSelection: true,
                anyMatch: true,
                typeAhead: true,
                listConfig: { itemTpl: highlightMatch.createItemTpl('FullName', 'searchReportsForm-employee') }
            }, {
                xtype: 'combo',
                id: 'searchReportsForm-department',
                itemId: 'Department',
                name: 'Department',
                fieldLabel: 'แผนก',
                store: self.departmentStore,
                emptyText: TextLabel.requireInputEmptyText,
                margin: '7 300 0 0',
                //maxLength: 30,
                hideTrigger: false,
                displayField: 'NameTH',
                valueField: 'ID',
                queryMode: 'local',
                //pageSize: 10,
                minChars: 1,
                allowBlank: false,
                disabled: true,
                editable: true,
                forceSelection: true,
                anyMatch: true,
                listConfig: { itemTpl: highlightMatch.createItemTpl('NameTH', 'searchReportsForm-department') }
            }, {
                xtype: 'combo',
                id: 'searchReportsForm-projectCode',
                name: 'ProjectCode',
                fieldLabel: TextLabel.projectLabel,
                store: self.projectStore,
                emptyText: 'กรุณาระบุข้อมูล',
                margin: "7 300 0 0",
                //maxLength: 30,
                hideTrigger: false,
                displayField: 'Display',
                valueField: 'ID',
                queryMode: 'local',
                minChars: 1,
                allowBlank: false,
                disabled: true,
                editable: true,
                forceSelection: true,
                anyMatch: true,
                listConfig: { itemTpl: highlightMatch.createItemTpl('Display', 'searchReportsForm-projectCode') }
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: 'ช่วงวันที่',
                name: 'dateBetween',
                layout: 'hbox',
                margin: '7 0 0 0',
                defaults: {
                    allowBlank: false
                },
                items: [
                    datefieldReportFromDate,
                    { xtype: 'displayfield', margin: '0 5 0 5', value: '-' },
                    datefieldReportToDate,
                    { xtype: 'displayfield', margin: '0 5 0 5', value: '(วันแรก - วันนี้ ของเดือนปัจจุบัน)' }
                ]
            }]
        });

        Ext.apply(self, {
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: 0,
            defaults: {
                frame: false,
                split: false
            },
            items: [{
                xtype: 'form',
                id: 'searchReportsForm',
                bodyPadding: "0 20 0 20",
                title: '',
                region: 'center',
                //height: 160,
                collapsible: false,
                items: [searchReportsFieldset],
                buttonAlign: 'center',

                buttons: [
                    {
                        text: '<i class="glyphicon glyphicon-print"></i> แสดงรายงานในรูปแบบ Excel',
                        handler: function (btn) {
                            extportExcel();
                        }
                    }, {
                        text: '<i class="glyphicon glyphicon-trash"></i> ล้างข้อมูล',
                        handler: function (btn) {
                            var form = Ext.getCmp('searchReportsForm').getForm();
                            form.reset();

                            setDefault();
                        }
                    }
                ]
            }]
        });

        self.callParent();
    },

    getCmbEmployee: function () {
        return Ext.getCmp('searchReportsForm-employee');
    },

    getCmbDepartment: function () {
        return Ext.getCmp('searchReportsForm-department');
    },

    getCmbProjectCode: function () {
        return Ext.getCmp('searchReportsForm-projectCode');
    }
});