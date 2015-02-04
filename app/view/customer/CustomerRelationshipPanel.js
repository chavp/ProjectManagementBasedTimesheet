Ext.define(document.appName + '.view.customer.CustomerRelationshipPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'customerRelationshipPanel',
    plain: true,
    tabPosition: 'left',
    height: AppConfig.height - 150,
    tabRotation: 0,
    defaults: {
        layout: 'fit',
        border: 1
    },
    config: {
        customerStore: null
    },

    activeTab: 0,

    initComponent: function () {
        var self = this;

        Ext.apply(self, {
            items: [{
                title: '<i class="glyphicon glyphicon-star"></i> ' + TextLabel.customerLabel,
                items: [{
                    xtype: 'grid',
                    store: self.customerStore,
                    columns: {
                        items: [
                             Ext.create('Ext.grid.RowNumberer', { locked: true }),
                             { text: 'ID', dataIndex: 'ID', hidden: true },
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
                                         var editForm = Ext.create('widget.customerWindow', {
                                             title: TextLabel.editCustomerCmdLabel,
                                             iconCls: 'edit-icon',
                                             animateTarget: row,
                                             modal: true,
                                             editData: record,
                                             customerStore: self.customerStore
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
                                         if (record.get('TotalProject') > 0) return true;
                                         return false;
                                     }
                                 }]
                             },
                             { text: TextLabel.customerLabel, dataIndex: 'Name', flex: 1 }
                             //, { text: TextLabel.customerContactChannelLabel, dataIndex: 'ContactChannel', flex: 1 }
                        ],
                        defaults: {
                            sortable: false,
                            menuDisabled: true,
                            renderer: function (value, metaData, record, rowIdx, colIdx, store) {
                                if (value) {
                                    if (value) {
                                        value = Ext.String.htmlEncode(value);
                                        // "double-encode" before adding it as a data-qtip attribute
                                        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                                    }
                                }
                                return value;
                            }
                        }
                    },
                    tbar: [{
                        cls: 'btn',
                        xtype: 'button',
                        iconCls: 'add-icon',
                        text: TextLabel.addCustomerCmdLabel,
                        handler: function (btn, evt) {
                            var addForm = Ext.create('widget.customerWindow', {
                                iconCls: 'add-icon',
                                animateTarget: btn,
                                modal: true,
                                customerStore: self.customerStore
                            });
                            addForm.show();
                        }
                    }],
                    // paging bar on the bottom
                    bbar: Ext.create('Ext.PagingToolbar', {
                        displayInfo: true,
                        store: self.customerStore,
                        displayMsg: TextLabel.customerLabel + ' ที่กำลังแสดงอยู่ {0} - {1} of {2}',
                        emptyMsg: "ไม่มี " + TextLabel.customerLabel
                    })
                }]
            }]
        });

        self.callParent();
    }
});