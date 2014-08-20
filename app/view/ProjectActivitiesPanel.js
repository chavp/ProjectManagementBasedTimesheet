Ext.define(document.appName + '.view.ProjectActivitiesPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'projectActivitiesPanel',
    layout: 'accordion',
    config: {
        phaseStore: null,
        taskTypeStore: null,
        mainTaskStore: null
    },
    initComponent: function () {
        var self = this;

        Ext.apply(self, {
            items: [{
                xtype: 'panel',
                layout: 'accordion',
                items: [{
                    title: '<i class="glyphicon glyphicon-road"></i> ' + TextLabel.projectPhaseLabel,
                    xtype: 'grid',
                    store: self.phaseStore,
                    hideHeaders: true,
                    columns: {
                        items: [{
                            xtype: 'rownumberer',
                            width: 30,
                            sortable: false,
                            locked: true
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 50,
                            items: [{
                                xtype: 'button',
                                text: TextLabel.editCmdLabel,
                                tooltip: TextLabel.editCmdLabel,
                                iconCls: 'edit-icon',
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    grid.getSelectionModel().select(record);
                                    var editForm = Ext.create('widget.phaseWindow', {
                                        title: TextLabel.editPhaseCmdLabel,
                                        iconCls: 'edit-icon',
                                        animateTarget: row,
                                        modal: true,
                                        editData: record,
                                        phaseStore: self.phaseStore
                                    });

                                    editForm.setValues(record);
                                    editForm.show();
                                }
                            }, {
                                xtype: 'button',
                                text: TextLabel.deleteCmdLabel,
                                tooltip: TextLabel.deleteCmdLabel,
                                iconCls: 'delete-icon',
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
                                                    self.customerStore.load();
                                                }
                                            });
                                        }
                                    });
                                },
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    if (record.get('ContainsTimesheet')) return true;
                                    return false;
                                }
                            }]
                        },
                        {
                            text: 'ID', dataIndex: 'ID', hidden: true, sortable: false,
                            renderer: function (v, meta, rec) {
                                return rec.phantom ? '' : v;
                            }
                        },
                        { text: '->', dataIndex: 'Name', flex: 1 }
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
                        text: TextLabel.addPhaseCmdLabel,
                        handler: function (btn, evt) {
                            var addForm = Ext.create('widget.phaseWindow', {
                                iconCls: 'add-icon',
                                title: TextLabel.addPhaseCmdLabel,
                                animateTarget: btn,
                                modal: true,
                                phaseStore: self.phaseStore,
                                order: self.phaseStore.getTotalCount() + 1
                            });
                            addForm.show();
                        }
                    }]
                }, {
                    title: '<i class="glyphicon glyphicon-th-list"></i> ' + TextLabel.taskTypeLabel,
                    xtype: 'grid',
                    store: self.taskTypeStore,
                    hideHeaders: true,
                    columns: {
                        items: [{
                            xtype: 'rownumberer',
                            width: 30,
                            sortable: false,
                            locked: true
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 50,
                            items: [{
                                xtype: 'button',
                                text: TextLabel.editCmdLabel,
                                tooltip: TextLabel.editCmdLabel,
                                iconCls: 'edit-icon',
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    grid.getSelectionModel().select(record);
                                    var editForm = Ext.create('widget.taskTypeWindow', {
                                        title: TextLabel.editTaskTypeCmdLabel,
                                        iconCls: 'edit-icon',
                                        animateTarget: row,
                                        modal: true,
                                        editData: record,
                                        taskTypeStore: self.taskTypeStore
                                    });

                                    editForm.setValues(record);
                                    editForm.show();
                                }
                            }, {
                                xtype: 'button',
                                text: TextLabel.deleteCmdLabel,
                                tooltip: TextLabel.deleteCmdLabel,
                                iconCls: 'delete-icon',
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
                                                    self.customerStore.load();
                                                }
                                            });
                                        }
                                    });
                                },
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    if (record.get('ContainsTimesheet')) return true;
                                    return false;
                                }
                            }]
                        },
                        {
                            text: 'ID', dataIndex: 'ID', hidden: true, sortable: false,
                            renderer: function (v, meta, rec) {
                                return rec.phantom ? '' : v;
                            }
                        },
                        { text: '->', dataIndex: 'Name', flex: 1 }
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
                        text: TextLabel.addTaskTypeCmdLabel,
                        handler: function (btn, evt) {
                            var addForm = Ext.create('widget.taskTypeWindow', {
                                iconCls: 'add-icon',
                                title: TextLabel.addTaskTypeCmdLabel,
                                animateTarget: btn,
                                modal: true,
                                taskTypeStore: self.taskTypeStore,
                                order: self.taskTypeStore.getTotalCount() + 1
                            });
                            addForm.show();
                        }
                    }]
                }, {
                    title: '<i class="glyphicon glyphicon-tasks"></i> ' + TextLabel.mainTaskLabel,
                    xtype: 'grid',
                    store: self.mainTaskStore,
                    hideHeaders: true,
                    columns: {
                        items: [{
                            xtype: 'rownumberer',
                            width: 30,
                            sortable: false,
                            locked: true
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 50,
                            items: [{
                                xtype: 'button',
                                text: TextLabel.editCmdLabel,
                                tooltip: TextLabel.editCmdLabel,
                                iconCls: 'edit-icon',
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    grid.getSelectionModel().select(record);
                                    var editForm = Ext.create('widget.mainTaskWindow', {
                                        title: TextLabel.editMainTaskCmdLabel,
                                        iconCls: 'edit-icon',
                                        animateTarget: row,
                                        modal: true,
                                        editData: record,
                                        mainTaskStore: self.mainTaskStore
                                    });

                                    editForm.setValues(record);
                                    editForm.show();
                                }
                            }, {
                                xtype: 'button',
                                text: TextLabel.deleteCmdLabel,
                                tooltip: TextLabel.deleteCmdLabel,
                                iconCls: 'delete-icon',
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
                                                    self.customerStore.load();
                                                }
                                            });
                                        }
                                    });
                                },
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    if (record.get('ContainsTimesheet')) return true;
                                    return false;
                                }
                            }]
                        },
                        {
                            text: 'ID', dataIndex: 'ID', hidden: true, sortable: false,
                            renderer: function (v, meta, rec) {
                                return rec.phantom ? '' : v;
                            }
                        },
                        { text: '->', dataIndex: 'Name', flex: 1 }
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
                        text: TextLabel.addMainTaskCmdLabel,
                        handler: function (btn, evt) {
                            var addForm = Ext.create('widget.mainTaskWindow', {
                                iconCls: 'add-icon',
                                title: TextLabel.addMainTaskCmdLabel,
                                animateTarget: btn,
                                modal: true,
                                mainTaskStore: self.mainTaskStore
                            });
                            addForm.show();
                        }
                    }]
                }]
            }]
        });

        self.callParent();
    }
});