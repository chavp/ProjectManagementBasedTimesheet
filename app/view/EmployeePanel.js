Ext.define(document.appName + '.view.EmployeePanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'employeePanel',
    height: 450,
    config: {
        departmentStore: null,
        employeeStore: null,
        positionStore: null
    },

    initComponent: function () {
        var self = this;

        Ext.apply(self, {
            layout: 'border',
            border: 1,
            defaults: {
                frame: false,
                split: false
            },
            items: [{
                xtype: 'panel',
                id: 'searchEmpForm',
                title: '',
                region: 'north',
                items: [{
                    width: 400,
                    fieldLabel: 'ค้นหา',
                    labelWidth: 100,
                    xtype: 'searchfield',
                    margin: 10,
                    emptyText: TextLabel.empIDLabel + ' / ' + TextLabel.empFullNameLabel,
                    store: self.employeeStore
                }]
            }, {
                xtype: 'grid',
                region: 'center',
                store: self.employeeStore,
                columns: {
                    items: [
                        {
                            xtype: 'rownumberer',
                            width: 30,
                            locked: true
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 80,
                            items: [{
                                iconCls: 'edit-icon',
                                tooltip: TextLabel.editCmdLabel,
                                scope: this,
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    grid.getSelectionModel().select(record);
                                    var editForm = Ext.create('widget.employeeWindow', {
                                        title: TextLabel.editCmdLabel + 'ข้อมูลผนักงาน',
                                        iconCls: 'edit-icon',
                                        animateTarget: row,
                                        modal: true,
                                        departmentStore: self.departmentStore,
                                        employeeStore: self.employeeStore,
                                        positionStore: self.positionStore,
                                        editData: record
                                    });

                                    editForm.setValues(record);
                                    editForm.show();
                                }
                            }, {
                                iconCls: 'reset-password-icon',
                                tooltip: TextLabel.resetPasswordCmdLabel,
                                scope: this,
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    var employeeID = record.get('EmployeeID');
                                    var name = record.get('FullName');

                                    var dispaly = '<br/><strong>' + TextLabel.empIDLabel + ':</strong> ' + employeeID;
                                    dispaly += '<br/><strong>' + TextLabel.empFullNameLabel + ':</strong> ' + name;

                                    Ext.MessageBox.show({
                                        title: TextLabel.confirmLabel,
                                        msg: 'คุณต้องการคืนค่าเริ่มต้นรหัสเข้าระบบผู้ใช้งานท่านนี้ ใช่ หรือ ไม่?<br/>' + dispaly,
                                        buttons: Ext.MessageBox.YESNO,
                                        icon: Ext.MessageBox.QUESTION,
                                        animateTarget: row,
                                        fn: function (btn) {
                                            if (btn === "yes") {
                                                Ext.MessageBox.wait("กำลังคืนค่าเริ่มต้นรหัสเข้าระบบผู้ใช้งาน...", 'กรุณารอ');
                                                Ext.Ajax.request({
                                                    url: document.urlAppApi + '/ResetPassword',
                                                    success: function (transport) {
                                                        Ext.MessageBox.hide();
                                                        var respose = Ext.decode(transport.responseText);
                                                        if (respose.success) {
                                                            Ext.MessageBox.show({
                                                                title: TextLabel.successTitle,
                                                                msg: respose.message,
                                                                //width: 300,
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.INFO,
                                                                fn: function (btn) {
                                                                    
                                                                }
                                                            });
                                                        } else {
                                                            Ext.MessageBox.show({
                                                                title: TextLabel.errorAlertTitle,
                                                                msg: 'เกิดข้อผิดพลาดในการคืนค่าเริ่มต้นรหัสเข้าระบบผู้ใช้งาน<br/>' + respose.message,
                                                                //width: 300,
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.ERROR
                                                            });
                                                        }
                                                    },   // function called on success
                                                    failure: function (transport) {
                                                        Ext.MessageBox.hide();
                                                        Ext.MessageBox.show({
                                                            title: TextLabel.errorAlertTitle,
                                                            msg: "เกิดข้อผิดพลาดในขั้นตอนคืนค่าเริ่มต้นรหัสผ่านผู้ใช้งาน<br/>" + transport.responseText,
                                                            //width: 300,
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.ERROR
                                                        });
                                                    },
                                                    jsonData: { empoyeeID: employeeID }  // your json data
                                                });
                                            } else {

                                            }
                                        }
                                    });
                                }
                            }, {
                                iconCls: 'delete-icon',
                                tooltip: TextLabel.deleteCmdLabel,
                                scope: this,
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    grid.getSelectionModel().select(record);
                                    Ext.MessageBox.confirm('ยืนยัน', 'คุณต้องการลบข้อมูลนี้ใช่ หรือ ไม่?',
                                    function (btn) {
                                        if (btn === "yes") {
                                            Ext.MessageBox.wait("กำลังลบข้อมูล...", 'กรุณารอ');
                                            record.erase({
                                                success: function (record, operation) {
                                                    Ext.MessageBox.show({
                                                        title: TextLabel.successTitle,
                                                        msg: 'ลบข้อมูลเสร็จสมบูรณ์',
                                                        //width: 300,
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO,
                                                        fn: function (btn) {
                                                            //self.departmentStore.load();
                                                        }
                                                    });
                                                },
                                                failure: function (record, operation) {
                                                    self.employeeStore.load();
                                                }
                                            });
                                        }
                                    });
                                },
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    if (record.get('TotalTimesheet') > 0) return true;
                                    if (record.get('Position') === '__ROOT__') return true;
                                    return false;
                                }
                            }]
                        },
                        { text: 'ID', dataIndex: 'ID', hidden: true },
                        { text: TextLabel.empIDLabel, dataIndex: 'EmployeeID', width: 120 },
                        { text: TextLabel.empFullNameLabel, dataIndex: 'FullName', width: 200 },
                        { text: TextLabel.emailLabel, dataIndex: 'Email', width: 240 },
                        { text: TextLabel.positionLabel, dataIndex: 'Position', width: 240 },
                        { text: TextLabel.appRoleLabel, dataIndex: 'AppRole', flex: 1 }
                    ],
                    defaults: {
                        sortable: false,
                        menuDisabled: true
                    }
                },
                tbar: [{
                    cls: 'btn',
                    xtype: 'button',
                    iconCls: 'add-icon',
                    text: TextLabel.addEmpCmdLabel,
                    handler: function (btn, evt) {
                        var addForm = Ext.create('widget.employeeWindow', {
                            iconCls: 'add-icon',
                            title: TextLabel.addEmpCmdLabel,
                            animateTarget: btn,
                            modal: true,
                            employeeStore: self.employeeStore,
                            departmentStore: self.departmentStore,
                            positionStore: self.positionStore
                        });
                        addForm.show();
                    }
                }],
                // paging bar on the bottom
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: self.employeeStore,
                    displayInfo: true,
                    displayMsg: TextLabel.empLabel + ' ที่กำลังแสดงอยู่ {0} - {1} of {2}',
                    emptyMsg: "ไม่มี " + TextLabel.empLabel
                })
            }]
        });

        self.callParent();
    }
});

