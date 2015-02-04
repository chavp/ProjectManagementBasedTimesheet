Ext.define(document.appName + '.view.project.ProjectPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'projectPanel',
    config: {
        projectStore: null,
        projectTimesheetStore: null,
        customerStore: null
    },
    initComponent: function () {
        var self = this;

        self.projectStore.load();

        var searchProject = function () {
            var form = Ext.getCmp('searchProjectForm');
            if (form.isValid()) {

                var values = form.getValues();
                var projectCode = values.ProjectCode;
                var projectName = values.ProjectName;
                self.projectStore.currentPage = 1;
                self.projectStore.proxy.extraParams.projectCode = projectCode;
                self.projectStore.proxy.extraParams.projectName = projectName;
                self.projectStore.load({
                    callback: function (records, operation, success) {
                        if (success) {
                        }
                    }
                });

            }
        };

        //console.log(AppConfig.height);
        var searchProjectFieldset = {
            xtype: 'fieldset',
            title: '<h5>' + TextLabel.criterionLabel + '</h5>',
            border: false,
            defaultType: 'field',
            defaults: {
                labelWidth: 250,
                allowBlank: false,
                labelAlign: 'right'
            },
            bodyPadding: 10,
            items: [
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: TextLabel.projectLabel,
                    name: 'project',
                    layout: 'hbox',
                    bodyPadding: 5,
                    items: [{
                        xtype: 'textfield',
                        id: 'ProjectCode',
                        name: 'ProjectCode',
                        fieldLabel: '',
                        emptyText: TextLabel.codeLabel,
                        width: 170,
                        maxLength: 30,
                        listeners: {
                            change: function (obj, newValue) {
                                obj.setRawValue(newValue.toUpperCase());
                            },
                            specialkey: function (field, e) {
                                if (e.getKey() == e.ENTER) {
                                    searchProject();
                                }
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        id: 'ProjectName',
                        name: 'ProjectName',
                        fieldLabel: '',
                        emptyText: TextLabel.nameLabel,
                        maxLength: 255,
                        width: 450,
                        listeners: {
                            specialkey: function (field, e) {
                                if (e.getKey() == e.ENTER) {
                                    searchProject();
                                }
                            }
                        }
                    }]
                }
            ]
        };


        Ext.apply(self, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: 1,
            defaults: {
                frame: false,
                split: false
            },
            items: [{
                xtype: 'form',
                id: 'searchProjectForm',
                title: '',
                region: 'north',
                collapsible: false,
                items: [searchProjectFieldset],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '<i class="glyphicon glyphicon-search"></i> ' + TextLabel.searchCmdLabel,
                        handler: function (btn) {
                            searchProject();
                        }
                    }, {
                        text: '<i class="glyphicon glyphicon-trash"></i> ' + TextLabel.clearCmdLabel,
                        handler: function (btn) {
                            var form = Ext.getCmp('searchProjectForm').getForm();
                            form.reset();
                            searchProject();
                        }
                    }
                ]
            }, {
                xtype: 'gridpanel',
                id: 'gridProject',
                frame: false,
                title: '',
                region: 'center',
                store: self.projectStore,
                height: AppConfig.height - 310,
                columns: {
                    items: [
                        Ext.create('Ext.grid.RowNumberer', { locked: true }),
                        {
                            xtype: 'actioncolumn',
                            width: self.getWidthActionColumn(),
                            items: [{
                                // Use a URL in the icon config
                                iconCls: self.getManageModeIcon(),
                                tooltip: self.getManageModeTitple(),
                                scope: this,
                                xtype: 'button',
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    grid.getSelectionModel().select(record);

                                    var editForm = Ext.create('widget.projectWindow', {
                                        title: self.getManageModeTitple(),
                                        iconCls: self.getManageModeIcon(),
                                        animateTarget: row,
                                        modal: true,
                                        projectStore: self.projectStore,
                                        projectTimesheetStore: self.projectTimesheetStore,
                                        customerStore: self.customerStore,
                                        editData: record
                                    });

                                    editForm.setValues(record);
                                    editForm.show();
                                }
                            }, {
                                xtype: 'button',
                                iconCls: 'delete-icon',
                                text: TextLabel.deleteCmdLabel,
                                tooltip: TextLabel.deleteCmdLabel,
                                scope: this,
                                xtype: 'button',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    if (self.getReadOnly()) return true;
                                    if (record.get('TotalTimesheet') > 0) return true;
                                    return false;
                                },
                                handler: function (grid, rowIndex, colIndex, item, event, record, row) {
                                    grid.getSelectionModel().select(record);
                                    Ext.MessageBox.confirm('ยืนยัน', 'คุณต้องการลบข้อมูลนี้ใช่ หรือ ไม่?',
                                    function (btn) {
                                        if (btn === "yes") {
                                            Ext.MessageBox.wait("กำลังลบข้อมูล...", 'กรุณารอ');
                                            record.erase({
                                                success: function (record, operation) {
                                                    self.projectStore.load();
                                                    if (self.projectTimesheetStore) {
                                                        self.projectTimesheetStore.load();
                                                    }
                                                    Ext.MessageBox.show({
                                                        title: TextLabel.successTitle,
                                                        msg: 'ลบข้อมูลเสร็จสมบูรณ์',
                                                        //width: 300,
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO,
                                                        fn: function (btn) {
                                                        }
                                                    });
                                                },
                                                failure: function (record, operation) {
                                                    self.projectStore.load();
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            ]
                        },
                        { text: 'ID', dataIndex: 'ID', hidden: true },
                        { text: TextLabel.projectCodeLabel, dataIndex: 'Code', width: 150 },
                        {
                            text: TextLabel.projectNameLabel, dataIndex: 'Name', width: 270,
                            renderer: function (value, metaData, record, rowIdx, colIdx, store) {
                                // Sample value: msimms & Co. "like" putting <code> tags around your code

                                value = Ext.String.htmlEncode(value);

                                // "double-encode" before adding it as a data-qtip attribute
                                metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';

                                return value;
                            }
                        },
                        {
                            text: TextLabel.projectStartLabel, dataIndex: 'StringStartDate', width: 150, align: 'center',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                                var status = record.get('ProjectStatusName');
                                if (value) {
                                    metadata.style = "background-color:#99FF99;";
                                } 
                                return value;
                            }
                        },
                        {
                            text: TextLabel.projectEndLabel, dataIndex: 'StringEndDate', width: 170, align: 'center',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                                var status = record.get('ProjectStatusName');
                                
                                if (value && status === 'Open') {
                                    var closeDate = record.get('EndDate');
                                    var nowDate = Ext.Date.parse(document.toDay, 'd/m/Y');
                                    //console.log(closeDate + ", " + nowDate);
                                    if (closeDate < nowDate) {
                                        metadata.style = "background-color:#FFCCCC;";
                                    } else {
                                        metadata.style = "background-color:#99FF99;";
                                    }
                                } else if (value && status === 'Close') {
                                    metadata.style = "background-color:#99FF99;";
                                }
                                return value;
                            }
                        },
                        {
                            text: TextLabel.estimateProjectValueLabel, dataIndex: 'EstimateProjectValue', sortable: true, width: 220, align: 'right',
                            hidden: Roles.isManager,
                            renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                                metadata.attr = "style='color: #aaa';";
                                return Ext.util.Format.number(value, '0,000.00');
                            }
                        },
                        {
                            text: TextLabel.projectStatusLabel, dataIndex: 'ProjectStatusName', width: 130, align: 'center',
                            menuDisabled: true,
                            renderer: function (value, metaData, record, rowIdx, colIdx, store) {
                                // Sample value: msimms & Co. "like" putting <code> tags around your code
                                //console.log(record);
                                var projectStatusID = record.get('ProjectStatusID');
                                if (projectStatusID === 1) {
                                    metaData.style = "color:green;";
                                } else {
                                    metaData.style = "color:red;";
                                }
                                return value;
                            }
                        },
                        { flex: 1 }
                    ],
                    defaults: {
                        sortable: false,
                        menuDisabled: true,
                        renderer: function (value, metaData, record, rowIdx, colIdx, store) {
                            if (value) {
                                value = Ext.String.htmlEncode(value);
                                metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                            }
                            return value;
                        }
                    }
                },
                tbar: [{
                    cls: 'btn',
                    xtype: 'button',
                    iconCls: 'add-icon',
                    text: TextLabel.projectAddCmdLabel,
                    hidden: self.getReadOnly(),
                    handler: function (btn, evt) {
                        var addForm = Ext.create('widget.projectWindow', {
                            iconCls: 'add-icon',
                            title: TextLabel.projectAddCmdLabel,
                            animateTarget: btn,
                            modal: true,
                            projectStore: self.projectStore,
                            projectTimesheetStore: self.projectTimesheetStore,
                            customerStore: self.customerStore
                        });
                        addForm.show();
                    }
                }],
                listeners: {
                    //'itemdblclick': function (grid, record, item, index, e, eOpts) {
                    //    //console.log("itemdblclick");
                    //    var projectForm = Ext.create('widget.projectWindow', {
                    //        projectData: record,
                    //        animateTarget: item,
                    //        modal: true
                    //    });
                    //    console.log(record);
                    //    projectForm.show();
                    //}
                },
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: self.projectStore,
                    displayInfo: true,
                    displayMsg: TextLabel.projectLabel + ' ที่กำลังแสดงอยู่ {0} - {1} จาก {2}',
                    emptyMsg: "ไม่มี " + TextLabel.projectLabel
                })
            }]
        });

        self.callParent();
    },

    getReadOnly: function () {
        return LoginToken.roles.indexOf('Manager') >= 0;
    },

    getManageModeIcon: function () {
        var me = this;
        if(me.getReadOnly()){
            return 'display-icon';
        }
        return 'edit-icon';
    },

    getManageModeTitple: function () {
        var me = this;
        if (me.getReadOnly()) {
            return TextLabel.displayCmdLabel + TextLabel.projectLabel;
        }
        return TextLabel.editCmdLabel + 'ข้อมูล' + TextLabel.projectLabel;
    },

    getWidthActionColumn: function () {
        var me = this;
        if(me.getReadOnly()){
            return 30;
        }
        return 60;
    }
});