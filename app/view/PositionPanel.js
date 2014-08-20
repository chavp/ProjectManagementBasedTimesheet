Ext.define(document.appName + '.view.PositionPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'positionPanel',
    height: 450,
    config: {
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
            border: 1,
            items: [{
                xtype: 'grid',
                region: 'center',
                store: self.positionStore,
                columns: {
                    items: [{
                        xtype: 'rownumberer',
                        width: 30,
                        sortable: false,
                        locked: true
                    },
                {
                    text: 'ID', dataIndex: 'ID', hidden: true, sortable: false,
                    renderer: function (v, meta, rec) {
                        return rec.phantom ? '' : v;
                    }
                },
                    {
                        xtype: 'actioncolumn',
                        sortable: false,
                        menuDisabled: true,
                        width: 60,
                        items: [{
                            xtype: 'button',
                            text: TextLabel.editCmdLabel,
                            tooltip: TextLabel.editCmdLabel,
                            iconCls: 'edit-icon',
                            handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                grid.getSelectionModel().select(record);
                                var editForm = Ext.create('widget.positionWindow', {
                                    iconCls: 'edit-icon',
                                    title: TextLabel.editPositionCmdLabel,
                                    animateTarget: row,
                                    modal: true,
                                    positionStore: self.positionStore,
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
                                                    self.positionStore.load();
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
                        text: TextLabel.positionLabel, dataIndex: 'PositionName', sortable: false, flex: 2
                    }, {
                        text: TextLabel.positionProjectRoleRateCostLabel,
                        dataIndex: 'ProjectRoleRateCost',
                        flex: 1,
                        align: 'right',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                            metadata.attr = "style='color: #aaa';";
                            if (value == 0)
                                return null;
                            return Ext.util.Format.number(value, '0,000');//'0,000.00'
                        }
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
                , bbar: Ext.create('Ext.PagingToolbar', {
                    store: self.positionStore,
                    displayInfo: false,
                    displayMsg: TextLabel.departmentLabel + ' ที่กำลังแสดงอยู่ {0} - {1} of {2}',
                    emptyMsg: "ไม่มี " + TextLabel.departmentLabel
                })
            }],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    text: TextLabel.addPositionCmdLabel,
                    iconCls: 'add-icon',
                    handler: function (btn, evt) {
                        var addForm = Ext.create('widget.positionWindow', {
                            iconCls: 'add-icon',
                            title: TextLabel.addPositionCmdLabel,
                            animateTarget: btn,
                            modal: true,
                            positionStore: self.positionStore
                        });

                        addForm.show();
                    }
                }]
            }]
        });

        self.callParent();
    }
});