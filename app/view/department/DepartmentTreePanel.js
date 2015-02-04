Ext.define(document.appName + '.view.department.DepartmentTreePanel', {
    extend: 'Ext.tree.Panel',
    xtype: 'departmentTreePanel',
    title: '',
    height: 370,
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    singleExpand: true,

    config: {
        departmentTreeStore: null,
        positionStore: null
    },

    initComponent: function () {
        var self = this;

        Ext.apply(self, {
            //store: new Ext.data.TreeStore({
            //    model: document.appName + '.model.DepartmentTree',
            //    proxy: {
            //        type: 'ajax',
            //        url: document.urlOrganizationApi + '/ReadDepartmentTree'
            //    },
            //    folderSort: true
            //}),
            id: 'bu5-departmentTree',
            store: self.departmentTreeStore,
            border: 1,
            columns: {
                items: [{
                    xtype: 'actioncolumn',
                    width: 60,
                    items: [{
                        xtype: 'button',
                        text: TextLabel.editCmdLabel,
                        tooltip: TextLabel.editCmdLabel,
                        iconCls: 'edit-icon',
                        handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                            grid.getSelectionModel().select(record);
                            if (record.data.Position == "") {
                                var editForm = Ext.create('widget.departmentWindow', {
                                    title: TextLabel.editCmdLabel + 'ข้อมูลแผนก',
                                    iconCls: 'edit-icon',
                                    animateTarget: row,
                                    modal: true,
                                    departmentStore: self.departmentStore,
                                    departmentTreeStore: self.departmentTreeStore,
                                    editData: record
                                });

                                editForm.setValues(record);
                                editForm.show();
                            } else {
                                var editForm = Ext.create('widget.positionWindow', {
                                    iconCls: 'edit-icon',
                                    title: TextLabel.addPositionCmdLabel,
                                    animateTarget: row,
                                    modal: true,
                                    departmentStore: self.departmentStore,
                                    departmentTreeStore: self.departmentTreeStore,
                                    positionStore: self.positionStore,
                                    editData: record
                                });

                                editForm.setValues(record);
                                editForm.show();
                            }
                        }
                    }, {
                        xtype: 'button',
                        text: TextLabel.deleteCmdLabel,
                        tooltip: TextLabel.deleteCmdLabel,
                        iconCls: 'delete-icon',
                        isDisabled: function (view, rowIndex, colIndex, item, record) {
                            //console.log(record.childNodes);
                            if (record.childNodes.length > 0) return true;
                            return false;
                        },
                        handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                            grid.getSelectionModel().select(record);

                            var selected = Ext.getCmp('bu5-departmentTree').getSelectionModel();
                            //var node = selected.getLastSelected();
                            //console.log(record.data);
                            var node = selected.getSelection()[0];

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
                                                        self.positionStore.load();
                                                    }
                                                });
                                            },
                                            failure: function (record, operation) {
                                                //self.departmentStore.load();
                                                self.departmentTreeStore.load();
                                            }
                                        });
                                    }
                                });
                        }
                    }]
                }, {
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'แผนก',
                    flex: 1,
                    dataIndex: 'Department'
                }, {
                    text: 'ตำแหน่ง',
                    flex: 2,
                    dataIndex: 'Position'
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
                }],
                defaults: {
                    sortable: false,
                    menuDisabled: true
                }
            },
            listeners : {
                select: function (grd, record, index, eOpts) {
                    //console.log(record);
                    Ext.getCmp('bu5-departmentTree').getSelectionModel().deselectAll();
                    Ext.getCmp('cmdAddPostion').setDisabled(true);
                    if (record.data.Position == "") {
                        Ext.getCmp('cmdAddPostion').setDisabled(false);
                    }
                }
            },
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
                }, '-',
                {
                    text: 'เพิ่มตำแหน่ง',
                    iconCls: 'add-icon',
                    disabled: true,
                    id: 'cmdAddPostion',
                    handler: function (btn, evt) {
                        var selected = Ext.getCmp('bu5-departmentTree').getSelectionModel();
                        var node = selected.getLastSelected();
                        //console.log(node);
                        node.set('PositionID', null);
                        var addForm = Ext.create('widget.positionWindow', {
                            iconCls: 'add-icon',
                            title: TextLabel.addPositionCmdLabel,
                            animateTarget: btn,
                            modal: true,
                            departmentStore: self.departmentStore,
                            departmentTreeStore: self.departmentTreeStore,
                            positionStore: self.positionStore,
                            editData: node
                        });

                        addForm.setValues(node);
                        addForm.show();

                        //selected.deselectAll();
                    }
                }]
            }]
        });

        self.callParent();
    }
});