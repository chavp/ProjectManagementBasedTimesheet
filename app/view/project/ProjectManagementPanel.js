Ext.define(document.appName + '.view.project.ProjectManagementPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'projectManagementPanel',
    plain: true,
    tabPosition: 'left',
    tabRotation: 0,
    defaults: {
        layout: 'fit',
        border: 1
    },
    config: {
        projectStore: null,
        projectTimesheetStore: null,
        customerStore: null,
        phaseStore: null,
        taskTypeStore: null,
        mainTaskStore: null
    },

    activeTab:0,

    requires: [
        'Ext.layout.container.Accordion'
    ],

    initComponent: function () {
        var self = this;

        self.isManager = LoginToken.roles.indexOf('Manager') >= 0;

        var authorizeTabs = [];
        authorizeTabs.push({
            title: '<i class="glyphicon glyphicon-gift"></i> ' + TextLabel.projectLabel,
            height: AppConfig.height - 140,
            xtype: 'projectPanel',
            projectStore: self.projectStore,
            projectTimesheetStore: self.projectTimesheetStore,
            customerStore: self.customerStore
        });
        if (!self.isManager) {
            authorizeTabs.push({
                title: '<i class="glyphicon glyphicon-th"></i> ' + TextLabel.projectActivitiesLabel,
                height: AppConfig.height - 170,
                xtype: 'projectActivitiesPanel',
                phaseStore: self.phaseStore,
                taskTypeStore: self.taskTypeStore,
                mainTaskStore: self.mainTaskStore
            });
        }

        Ext.apply(self, {
            items: authorizeTabs
        });

        self.callParent();
    }
});