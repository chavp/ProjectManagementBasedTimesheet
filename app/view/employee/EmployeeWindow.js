Ext.define(document.appName + '.view.employee.EmployeeWindow', {
    extend: 'Ext.window.Window',
    xtype: 'employeeWindow',
    width: 750,
    title: TextLabel.addEmpCmdLabel,
    resizable: false,
    closable: false,
    config: {
        editData: null,
        employeeStore: null,
        departmentStore: null,
        positionStore: null
    },

    initComponent: function () {
        var self = this;

        var addAction = Ext.create('Ext.Action', {
            //iconCls: 'add-button',
            text: TextLabel.saveActionText,
            disabled: false,
            handler: function (widget, event) {
                //console.log(Ext.getCmp('StartDate').getValue());
                var form = self.down('form');
                if (!form.isValid()) {
                    Ext.MessageBox.show({
                        title: TextLabel.validationTitle,
                        msg: TextLabel.validationWarning,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });

                    return false;
                }

                if (form.isValid()) {
                    var vals = form.getValues();
                    
                    Ext.MessageBox.wait("กำลังบันทึกข้อมูล...", 'กรุณารอ');

                    var startDate = Ext.Date.format(Ext.getCmp('StartDate').getValue(), 'd/m/Y');

                    var saveData = Ext.create('widget.employee', {
                        ID: vals.ID,
                        EmployeeID: vals.EmployeeID,
                        NameTH: vals.NameTH,
                        LastTH: vals.LastTH,
                        NameEN: vals.NameEN,
                        LastEN: vals.LastEN,
                        DepartmentID: vals.Department,
                        PositionID: vals.Position,
                        Nickname: vals.Nickname,
                        Email: vals.Email,
                        StartDate: startDate,
                        AppRole: vals['app-role']
                    });

                    var oldRole = vals['app-role'];

                    //console.log(saveData);
                    saveData.save({
                        success: function (record, operation) {

                            ///console.log(operation._response);

                            var requireRefresh = false;
                            if (operation._response) {
                                var responseText = operation._response.responseText;
                                var result = Ext.decode(responseText);
                                requireRefresh = result.requireRefresh;
                            }
                            Ext.MessageBox.show({
                                title: TextLabel.successTitle,
                                msg: 'บันทึกข้อมูลเสร็จสมบูรณ์',
                                //width: 300,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn: function (btn) {
                                    if (requireRefresh) {
                                        Ext.MessageBox.wait("กำลังลังโหลดข้อมูลไปหน้าแรก...", 'กรุณารอ');
                                        window.location.href = document.urlAppRoot;
                                    }

                                    if (self.employeeStore) {
                                        self.employeeStore.load();
                                    }
                                    
                                    if (self.editData) {
                                        self.close();
                                    } else {
                                        form.reset();
                                    }
                                }
                            });
                        },
                        failure: function (record, operation) {

                        }
                    });
                }
            }
        });

        self.items = [{
            xtype: 'panel',
            
            items: [{
                xtype: 'form',
                layout: {
                    type: 'table',
                    columns: 2,
                    tableAttrs: {
                        style: {
                            width: '80%'
                        }
                    }
                },
                bodyStyle: 'padding: 8px 5px 5px 10px',
                defaultType: 'textfield',
                fieldDefaults: {
                    labelWidth: 150,
                    allowBlank: false,
                    labelAlign: 'right'
                },
                items: [{
                    itemId: 'ID',
                    name: 'ID',
                    xtype: 'textarea',
                    allowBlank: true,
                    hidden: true
                }, {
                    fieldLabel: TextLabel.empIDLabel + '<span class="required">*</span>',
                    id: 'EmployeeID',
                    name: 'EmployeeID',
                    validFlag: true,
                    maxLength: 9,
                    minLength: 3,
                    //selectOnFocus: true,
                    validator: function () {
                        return this.validFlag;
                    },
                    listeners: {
                        'change': function (textfield, newValue, oldValue) {
                        }
                    }
                }, {
                    xtype: 'displayfield'
                }, {
                    fieldLabel: 'ชื่อ (ไทย) <span class="required">*</span>',
                    id: 'NameTH',
                    name: 'NameTH',
                    //colspan: 1,
                    maxLength: 100
                }, {
                    fieldLabel: 'นามสกุล (ไทย) <span class="required">*</span>',
                    id: 'LastTH',
                    name: 'LastTH',
                    //colspan: 1,
                    maxLength: 100
                }, {
                    fieldLabel: 'ชื่อ (อังกฤษ) <span class="required">*</span>',
                    id: 'NameEN',
                    name: 'NameEN',
                    //colspan: 1,
                    maxLength: 100
                }, {
                    fieldLabel: 'นามสกุล (อังกฤษ) <span class="required">*</span>',
                    id: 'LastEN',
                    name: 'LastEN',
                    //colspan: 1,
                    maxLength: 100
                }, {
                    xtype: 'combo',
                    fieldLabel: 'แผนก <span class="required">*</span>',
                    id: 'Department',
                    name: 'Department',
                    //width: '94%',
                    //colspan: 2,
                    queryMode: 'local',
                    displayField: 'NameTH',
                    valueField: 'ID',
                    emptyText: TextLabel.requireInputEmptyText,
                    store: self.departmentStore,
                    forceSelection: true,
                    editable: true
                }, {
                    xtype: 'combo',
                    fieldLabel: TextLabel.positionLabel + ' <span class="required">*</span>',
                    id: 'Position',
                    name: 'Position',
                    //width: '95%',
                    //colspan: 2,
                    queryMode: 'local',
                    displayField: 'PositionName',
                    valueField: 'PositionID',
                    emptyText: TextLabel.requireInputEmptyText,
                    store: self.positionStore,
                    forceSelection: true,
                    editable: true
                }, {
                    fieldLabel: TextLabel.empNickNameLabel,
                    id: 'Nickname',
                    name: 'Nickname',
                    //colspan: 1,
                    maxLength: 30,
                    allowBlank: true
                }, {
                    fieldLabel: TextLabel.emailLabel + ' (ชื่อเข้าระบบ) <span class="required">*</span>',
                    id: 'Email',
                    name: 'Email',
                    vtype: 'email',
                    //colspan: 1,
                    maxLength: 100
                }, {
                    xtype: 'datefield',
                    id: 'StartDate',
                    name: 'StartDate',
                    fieldLabel: 'วันที่เริ่มงาน',
                    format: "d/m/Y",
                    editable: false,
                    //colspan: 2
                }
                //, {
                //    xtype: 'combo',
                //    fieldLabel: TextLabel.positionLabel + ' <span class="required">*</span>',
                //    id: 'Position',
                //    name: 'Position',
                //    width: '100%',
                //    colspan: 2,
                //    queryMode: 'local',
                //    displayField: 'Display',
                //    valueField: 'ID',
                //    emptyText: TextLabel.requireInputEmptyText,
                //    store: null,
                //    forceSelection: true,
                //    editable: true
                //}
                , {
                    xtype: 'displayfield'
                }
                , {
                    xtype: 'fieldset',
                    title: '',
                    colspan: 2,
                    layout: 'anchor',
                    collapsible: false,
                    margin: '0 0 0 10',
                    padding: '0 0 0 0',
                    border: false,
                    items: [{
                        xtype: 'radiogroup',
                        id: 'AppRole',
                        name: 'AppRole',
                        fieldLabel: TextLabel.appRoleLabel,
                        columns: 3,
                        labelAlign: 'right',
                        labelWidth: 140,
                        //height : 100,
                        items: [{
                            checked: true,
                            boxLabel: 'Staff',
                            name: 'app-role',
                            inputValue: 'Staff',
                            width: 80
                        }, {
                            boxLabel: 'Admin',
                            name: 'app-role',
                            inputValue: 'Admin',
                            width: 80
                        }, {
                            boxLabel: 'Manager',
                            name: 'app-role',
                            inputValue: 'Manager',
                            width: 80
                        }, {
                            boxLabel: 'Executive',
                            name: 'app-role',
                            inputValue: 'Executive',
                            width: 80
                        }]
                    }]
                }
                ]
            }],
            //buttonAlign: 'center',
            buttons: [
                new Ext.button.Button(addAction),
                new Ext.button.Button(CommandActionBuilder.cancleAction(self))
            ]
        }];

        self.callParent();
    },

    listeners: {
        show: function () {
            Ext.getCmp('EmployeeID').focus(false, 200);
        }
    },

    setValues: function (record) {
        var form = this.down('form').getForm();
        form.loadRecord(record);
        //console.log(record);
        Ext.getCmp('Position').setValue(record.data.PositionID);
        Ext.getCmp('Department').setValue(record.data.DepartmentID);

        var grAppRole = Ext.getCmp('AppRole');
        var appRole = record.get('AppRole');
        grAppRole.setValue({
            'app-role': appRole
        });

        if (record.data.Position === '__ROOT__') {
            Ext.getCmp('Position').setDisabled(true);
            Ext.getCmp('Department').setDisabled(true);
            Ext.getCmp('AppRole').setDisabled(true);
        }
    }
});

// http://www.sencha.com/forum/showthread.php?21092-Thai-year-(2007-543)