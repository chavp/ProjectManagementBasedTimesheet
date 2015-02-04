﻿Ext.define(document.appName + '.view.department.DepartmentPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'departmentPanel',
    
    config: {
        departmentStore: null
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
            id: 'bu5-departmentPanel',
            border: 1,
            items: [{
                xtype: 'grid',
                region: 'center',
                store: self.departmentStore,
                
                columns: {
                    items: [
                        Ext.create('Ext.grid.RowNumberer', { locked: true }),
                    {
                        text: 'ID', dataIndex: 'ID', hidden: true, sortable: false,
                        renderer: function (v, meta, rec) {
                            return rec.phantom ? '' : v;
                        }
                    },
                    {
                        xtype: 'actioncolumn',
                        width: 60,
                        items: [{
                            xtype: 'button',
                            text: TextLabel.editCmdLabel,
                            tooltip: TextLabel.editCmdLabel,
                            iconCls: 'edit-icon',
                            handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                grid.getSelectionModel().select(record);
                                var editForm = Ext.create('widget.departmentWindow', {
                                    title: TextLabel.editCmdLabel + 'ข้อมูลแผนก',
                                    iconCls: 'edit-icon',
                                    animateTarget: row,
                                    modal: true,
                                    departmentStore: self.departmentStore,
                                    editData: record
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
                                Ext.MessageBox.confirm('ยืนยัน', 'คุณต้องการลบแผนกนี้ใช่ หรือ ไม่?',
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
                                                    self.departmentStore.load();
                                                }
                                            });
                                        }
                                    });
                            },
                            isDisabled: function (view, rowIndex, colIndex, item, record) {
                                if (record.get('TotalPerson') > 0) return true;
                                return false;
                            }
                        }]
                    },
                    {
                        text: TextLabel.departmentLabel, dataIndex: 'NameTH', flex: 1
                    }
                    ],
                    defaults: {
                        sortable: false,
                        menuDisabled: true,
                        renderer: function (value, metaData, record, rowIdx, colIdx, store) {
                            if (value) {
                                value = Ext.String.htmlEncode(value);
                                // "double-encode" before adding it as a data-qtip attribute
                                metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                            }
                            return value;
                        }
                    }
                }

                // paging bar on the bottom
                ,bbar: Ext.create('Ext.PagingToolbar', {
                    store: self.departmentStore,
                    displayInfo: true,
                    displayMsg: TextLabel.departmentLabel + ' ที่กำลังแสดงอยู่ {0} - {1} จาก {2}',
                    emptyMsg: "ไม่มี " + TextLabel.departmentLabel
                })
                }]
            ,
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    text: TextLabel.addDepartmentCmdLabel,
                    iconCls: 'add-icon',
                    handler: function (btn, evt) {
                        var addForm = Ext.create('widget.departmentWindow', {
                            iconCls: 'add-icon',
                            title: TextLabel.addDepartmentCmdLabel,
                            animateTarget: btn,
                            modal: true,
                            departmentStore: self.departmentStore,
                            departmentTreeStore: self.departmentTreeStore
                        });
                        addForm.show();
                    }
                }]
            }]
        });

        self.callParent();
    }
});