TextLabel = (function () {
    return {
        codeLabel: 'รหัส',
        nameLabel: 'ชื่อ',
        criterionLabel: 'เงื่อนไขค้นหา',
        projectLabel: 'โปรเจกต์',
        projectManagementLabel: 'การจัดการโปรเจกต์',
        projectCodeLabel: 'รหัสโปรเจกต์',
        projectNameLabel: 'ชื่อโปรเจกต์',
        projectActivitiesLabel: 'กิจกรรม',

        projectStartLabel: 'วันที่เริ่มโปรเจกต์',
        projectEndLabel: 'วันที่ปิดโปรเจกต์',
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
            return Ext.create('Ext.Action', {
                //iconCls: 'add-button',
                text: TextLabel.cancleActionText,
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

        document.appName + '.view.NavigationTabs',
        document.appName + '.view.NavigationTabsController',

        document.appName + '.view.TimesheetPanel',
        document.appName + '.view.TimesheetWindow',
        document.appName + '.view.ProjectManagementPanel',
        document.appName + '.view.ProjectPanel',
        document.appName + '.view.ReportPanel',

        document.appName + '.view.EmployeePanel',
        document.appName + '.view.EmployeeWindow',
        document.appName + '.view.DepartmentWindow',
        document.appName + '.view.OrganizationPanel',
        document.appName + '.view.DepartmentPanel',
        document.appName + '.view.PositionPanel',
        document.appName + '.view.PositionWindow',
        document.appName + '.view.ProjectWindow',
        document.appName + '.view.ProjectActivitiesPanel',

        document.appName + '.view.UserChangePasswordWindow',

        document.appName + '.view.CustomerRelationshipPanel',
        document.appName + '.view.CustomerWindow',

        document.appName + '.view.PhaseWindow',
        document.appName + '.view.TaskTypeWindow',
        document.appName + '.view.MainTaskWindow'
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

        Ext.tip.QuickTipManager.init();
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
        //Ext.Msg.alert('Fiddle', 'Welcome to Sencha Fiddle!');
    }
});