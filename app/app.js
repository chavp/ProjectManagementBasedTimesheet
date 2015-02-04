Dictionary = (function () {
    return {
        Project: 'โปรเจกต์',
        Employee: 'พนักงาน'
    }
})();

Roles = (function () {
    return {
        isManager: (LoginToken.roles.indexOf('Manager') >= 0),

        isAdmin: (LoginToken.roles.indexOf('Admin') >= 0),

        isExecutive: (LoginToken.roles.indexOf('Executive') >= 0)
    }
})();

TextLabel = (function () {
    return {
        codeLabel: 'รหัส',
        nameLabel: 'ชื่อ',
        criterionLabel: 'เงื่อนไขค้นหา',
        projectLabel: Dictionary.Project,
        projectManagementLabel: 'การจัดการโปรเจกต์',
        projectCodeLabel: 'รหัสโปรเจกต์',
        projectNameLabel: 'ชื่อโปรเจกต์',
        projectActivitiesLabel: 'กิจกรรม',

        projectStartLabel: 'วันที่เริ่มตามสัญญา',
        projectEndLabel: 'วันที่สิ้นสุดตามสัญญา',
        projectMemberLabel: 'สมาชิกในโปรเจกต์',
        projectStatusLabel: 'สถานะโปรเจกต์',
        projectPhaseLabel: 'ช่วงโปรเจกต์',
        projectPhaseNameLabel: 'ชื่อ',
        projectContractStartEndDateLabel: 'วันที่เริ่มต้น - สิ้นสุด ตามสัญญา',
        estimateProjectValueLabel: 'มูลค่าโปรเจกต์โดยประมาณ',

        dateRangeLabel: 'ช่วงวันที่',
        timesheetLabel: 'บันทึกเวลาการทำงาน',
        taskTypeLabel: 'ประเภทงาน',
        mainTaskLabel: 'งานที่ทำ',
        taskTypeNameLabel: 'ชื่อประเภทงาน',
        mainTaskNameLabel: 'ชื่องานที่ทำ',
        subTaskLabel: 'รายละเอียดของงาน',
        timesheetStartDateLabel: 'วันที่ทำงาน',
        hourUsedLabel: 'จำนวน ช.ม. ที่ใช้ทำงาน',
        timesheetOTLabel: 'ช่วงเวลา OT',

        addPhaseCmdLabel: 'เพิ่มช่วงโปรเจกต์',
        addTaskTypeCmdLabel: 'เพิ่มประเภทงาน',
        addMainTaskCmdLabel: 'เพิ่มงานที่ทำ',
        editPhaseCmdLabel: 'แก้ไขช่วงโปรเจกต์',
        editTaskTypeCmdLabel: 'แก้ไขประเภทงาน',
        editMainTaskCmdLabel: 'แก้ไขงานที่ทำ',

        searchCmdLabel: 'ค้นหา',
        clearCmdLabel: 'ล้างข้อมูล',

        projectAddCmdLabel: 'เพิ่มโปรเจกต์',

        displayCmdLabel: 'แสดงข้อมูล',
        addCmdLabel: 'เพิ่มข้อมูล',
        deleteCmdLabel: 'ลบข้อมูล',

        addTimesheetCmdLabel: 'เพิ่มบันทึกเวลาการทำงาน',
        deleteTimesheetCmdLabel: 'ลบบันทึกเวลาการทำงาน',
        addDepartmentCmdLabel: 'เพิ่มแผนก',

        addPositionCmdLabel: 'เพิ่มตำแหน่ง',
        editPositionCmdLabel: 'แก้ไขตำแหน่ง',

        homeLabel: "Staff's Home",
        orgLabel: 'องค์กร',
        projectLabel: 'โปรเจกต์',
        reportLabel: 'รายงาน',

        empLabel: 'พนักงาน',
        empIDLabel: 'รหัส',
        empNickNameLabel: 'ชื่อเล่น',
        empFirstNameLabel: 'ชื่อ',
        empLastNameLabel: 'นามสกุล',
        empFullNameLabel: 'ชื่อ-นามสกุล',
        positionLabel: 'ตำแหน่ง',
        positionProjectRoleRateCostLabel: 'ต้นทุนในโปรเจกต์ต่อวัน',
        departmentLabel: 'แผนก',
        emailLabel: 'อีเมล์',

        addEmpCmdLabel: 'เพิ่มพนักงาน',
        editEmpCmdLabel: 'แก้ไขข้อมูลพนักงาน',

        deleteCmdLabel: 'ลบ',
        editCmdLabel: 'แก้ไข',

        titleEmpLabel: 'คำนำหน้าชื่อ',
        titleEmpLabel: 'คำนำหน้าชื่อ',

        confirmLabel: 'ยืนยัน',

        validationTitle: 'ผลการตรวจสอบข้อมูล',
        validationAddProjectMember: 'กรุณากำหนด หน้าที่ในโครงการ ให้สมบูรณ์',
        errorAlertTitle: 'ข้อผิดพลาด',
        validationWarning: 'กรุณากรอกข้อมูลให้สมบูรณ์',
        successTitle: 'สำเร็จ',
        successMsg: 'บันทึกข้อมูลเสร็จสมบูรณ์',

        requireInputEmptyText: 'กรุณาระบุข้อมูล',
        requireSelectEmptyText: 'กรุณาเลือก',

        okActionText: '<i class="glyphicon glyphicon-ok"></i> ตกลง',
        saveActionText: '<i class="glyphicon glyphicon-floppy-disk"></i> บันทึก',
        cancleActionText: '<i class="glyphicon glyphicon-remove"></i> ยกเลิก',
        closeActionText: '<i class="glyphicon glyphicon-remove"></i> ปิด',

        exportExcepSucessText: 'สร้างรายงาน Excel เสร็จสมบูรณ์',

        resetPasswordCmdLabel: 'คืนค่าเริ่มต้นรหัสเข้าระบบผู้ใช้งาน',

        appRoleLabel: 'ระดับผู้ใช้',

        customerRelationshipLabel: 'ลูกค้าสัมพันธ์',
        customerLabel: 'ลูกค้า',
        customerNameLabel: 'ชื่อลูกค้า',
        customerAddressLabel: 'ที่อยู่ลูกค้า',
        customerContactChannelLabel: 'ช่องทางติดต่อ',
        addCustomerCmdLabel: 'เพิ่มข้อมูลลูกค้า',
        editCustomerCmdLabel: 'แก้ไขข้อมูลลูกค้า'

    }
})();

CommandActionBuilder = (function () {
    return {
        cancleAction: function (from) {
            var text = TextLabel.cancleActionText;
            if (from.getReadOnly) {
                if (from.getReadOnly()) {
                    text = TextLabel.closeActionText;
                }
            }
            return Ext.create('Ext.Action', {
                //iconCls: 'add-button',
                text: text,
                disabled: false,
                handler: function (widget, event) {
                    from.close();
                }
            });
        }
    }
})();

AppConfig = (function () {
    return {
        height : (window.innerHeight > 0) ? window.innerHeight : screen.height
    }
})();

Ext.Loader.setPath('Ext.ux', document.scriptsFolderPath + '/ext-5.0.0/ux');

Ext.application({
    name: document.appName,
    appFolder: document.appFolderPath,
    autoCreateViewport: true,

    requires: [
        'Ext.app.*',
        'Ext.state.CookieProvider',
        'Ext.window.MessageBox',
        'Ext.tip.QuickTipManager',
        'Ext.window.Window',
        'Ext.tab.Panel',
        'Ext.util.Cookies',
        'Ext.ux.form.SearchField',
        'Ext.util.History',

        document.appName + '.view.NavigationTabs',
        document.appName + '.view.NavigationTabsController',

        document.appName + '.view.TimesheetPanel',
        document.appName + '.view.TimesheetWindow',

        document.appName + '.view.project.MainTaskWindow',
        document.appName + '.view.project.PhaseWindow',
        document.appName + '.view.project.ProjectActivitiesPanel',
        document.appName + '.view.project.ProjectManagementPanel',
        document.appName + '.view.project.ProjectPanel',
        document.appName + '.view.project.ProjectWindow',
        document.appName + '.view.project.TaskTypeWindow',

        document.appName + '.view.ReportPanel',

        document.appName + '.view.OrganizationPanel',
        document.appName + '.view.employee.EmployeePanel',
        document.appName + '.view.employee.EmployeeWindow',
        document.appName + '.view.department.DepartmentPanel',
        document.appName + '.view.department.DepartmentWindow',
        document.appName + '.view.position.PositionPanel',
        document.appName + '.view.position.PositionWindow',

        document.appName + '.view.UserChangePasswordWindow',

        document.appName + '.view.customer.CustomerRelationshipPanel',
        document.appName + '.view.customer.CustomerWindow'
    ],

    models: [
        'Employee',
        'Department',
        'DepartmentTree',
        'Position',
        'Project',
        'ProjectStatus',
        'Timesheet',
        'Phase',
        'TaskType',
        'MainTask',
        'ReportType',
        'ExcelTimesheetReport',
        'Customer'
    ],
    stores: [
        'EmployeeStore',
        'DepartmentStore',
        'DepartmentTreeStore',
        'PositionStore',
        'ProjectStore',
        'ProjectStatusStore',
        'TimesheetStore',
        'MainTaskStore',
        'TaskTypeStore',
        'PhaseStore',
        'ReportTypeStore',
        'CustomerStore'
    ],
    controllers: ['Main'],

    init: function () {
        // Best of Extjs http://www.sencha.com/blog/top-10-ext-js-development-practices-to-avoid
        Ext.tip.QuickTipManager.init();
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
        //Ext.Msg.alert('Fiddle', 'Welcome to Sencha Fiddle!');

        Ext.History.init();

        var tokenDelimiter = ':';
        CommandActionBuilder.onTabChange = function (tabPanel, tab) {
            if (tab) {
                var tabs = [],
                    ownerCt = tabPanel.ownerCt,
                    oldToken, newToken;

                tabs.push(tab.id);
                tabs.push(tabPanel.id);

                while (ownerCt && ownerCt.is('tabpanel')) {
                    tabs.push(ownerCt.id);
                    ownerCt = ownerCt.ownerCt;
                }

                newToken = tabs.reverse().join(tokenDelimiter);

                oldToken = Ext.History.getToken();

                if (oldToken === null || oldToken.search(newToken) === -1) {
                    Ext.History.add(newToken);
                }
            }
        }

        // Handle this change event in order to restore the UI to the appropriate history state
        CommandActionBuilder.onAfterRender =  function(){
            Ext.History.on('change', function (token) {
                var parts, length, i;
                //console.log(token);
                if (token) {
                    parts = token.split(tokenDelimiter);
                    length = parts.length;

                    //console.log(token);

                    // setActiveTab in all nested tabs
                    for (i = 0; i < length - 1; i++) {
                        Ext.getCmp(parts[i]).setActiveTab(Ext.getCmp(parts[i + 1]));
                    }
                }
            });

            // This is the initial default state.  Necessary if you navigate starting from the
            // page without any existing history token params and go back to the start state.
            
            //var activeTab1 = Ext.getCmp('main-tabs'), activeTab2;
            //if (activeTab1.getActiveTab() == null) {
            //    activeTab1.setActiveTab(0);
            //}
            ////console.log(activeTab1);
            //if (activeTab1.getActiveTab) {
            //    activeTab2 = activeTab1.getActiveTab();
            //}
            //CommandActionBuilder.onTabChange(activeTab1, activeTab2);
        }
    }
});