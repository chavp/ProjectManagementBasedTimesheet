Ext.define(document.appName + '.view.NavigationTabsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.navigation-tabs',
    stores: [],

    init: function () {
        var self = this;

        var departmentStore = Ext.create('widget.departmentStore');
        var employeeStore = Ext.create('widget.employeeStore');
        var departmentTreeStore = Ext.create('widget.departmentTreeStore');
        var positionStore = Ext.create('widget.positionStore');
        var projectStore = Ext.create('widget.projectStore');
        var projectTimesheetStore = Ext.create('widget.projectStore');
        var timesheetStore = Ext.create('widget.timesheetStore');
        var customerStore = Ext.create('widget.customerStore');

        var phaseStore = Ext.create('widget.phaseStore');
        var taskTypeStore = Ext.create('widget.taskTypeStore');
        var mainTaskStore = Ext.create('widget.mainTaskStore');

        var tabPanel = self.lookupReference('navigation');

        var activeTab = null;

        var homeTab = tabPanel.add({
            xtype: 'container',
            layout: {
                type: 'fit'
            },
            title: "<i class='glyphicon glyphicon-home'></i> " + TextLabel.homeLabel,
            items: [{
                xtype: 'panel',
                title: 'PBM Timesheet Portal',
                html: '     <p>ยินดีต้อนรับคุณ ' + LoginToken.userName + ' เข้าสู่ระบบบันทึกเวลาการทำงาน </p>'
            }]
        });

        activeTab = homeTab;

        // preload dataStore
        projectStore.load();
        phaseStore.load();
        taskTypeStore.load();
        mainTaskStore.load();

        if (Roles.isAdmin || Roles.isExecutive) {
            employeeStore.load();
            customerStore.load();
            departmentStore.load();
            positionStore.load();

            //console.log(Roles.isExecutive);
        }

        if (Roles.isManager) {
            employeeStore.load();
            customerStore.load();
        }

        // panel projectManagementPanel
        var projectManagementPanel = {
            title: '<i class="glyphicon glyphicon-th-large"></i> ' + TextLabel.projectManagementLabel,
            items: [{
                xtype: 'projectManagementPanel',
                projectStore: projectStore,
                projectTimesheetStore: projectTimesheetStore,

                customerStore: customerStore,

                phaseStore: phaseStore,
                taskTypeStore: taskTypeStore,
                mainTaskStore: mainTaskStore
            }]
        };

        // preenable feature
        if (Roles.isAdmin) {
            var organizationTab = tabPanel.add({
                title: '<i class="glyphicon glyphicon-tower"></i> ' + TextLabel.orgLabel,
                items: [{
                    xtype: 'organizationPanel',
                    departmentStore: departmentStore,
                    employeeStore: employeeStore,
                    positionStore: positionStore
                }]
            });

            var customerTab = tabPanel.add({
                title: '<i class="glyphicon glyphicon-heart"></i> ' + TextLabel.customerRelationshipLabel,
                items: [{
                    xtype: 'customerRelationshipPanel',
                    customerStore: customerStore
                }]
            });

            var projectManagementTab = tabPanel.add(projectManagementPanel);

            //activeTab = projectManagementTab;
        }

        if (Roles.isManager) {
            var projectManagementTab = tabPanel.add(projectManagementPanel);
        }

        if (!Roles.isExecutive) {
            var timesheetTab = tabPanel.add({
                title: '<i class="glyphicon glyphicon-time"></i> ' + TextLabel.timesheetLabel,
                items: [{
                    xtype: 'timesheetPanel',
                    projectStore: projectTimesheetStore,
                    timesheetStore: Ext.create('widget.timesheetStore'),
                    phaseStore: phaseStore,
                    taskTypeStore: taskTypeStore,
                    mainTaskStore: mainTaskStore,
                    firstDayOfWeek: document.firstDayOfWeek,
                    toDay: document.toDay
                }]
            });

            //activeTab = timesheetTab;
        }

        var reportTab = tabPanel.add({
            title: '<i class="glyphicon glyphicon-file"></i> ' + TextLabel.reportLabel,
            items: [{
                xtype: 'reportPanel',
                firstDayOfMonth: document.firstDayOfMonth,
                toDay: document.toDay,
                employeeStore: employeeStore,
                departmentStore: departmentStore,
                projectStore: projectStore
            }]
        });

        //tabPanel.setActiveTab(activeTab);

        Ext.suspendLayouts();
        Ext.resumeLayouts(true);
    }
});
