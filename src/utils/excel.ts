import * as XLSX from 'xlsx';
import { DepartmentStats } from '@/types';

interface MonthlyReportData {
  '部门名称': string;
  '员工总数': number;
  '已完成体检': number;
  '完成率(%)': number;
  '待体检': number;
  '未开始': number;
  '异常报告数': number;
  '已使用预算(元)': number;
  '部门总预算(元)': number;
}

export function exportMonthlyReport(data: DepartmentStats[], packageStats: any[], month: string) {
  const reportData: MonthlyReportData[] = data.map(dept => ({
    '部门名称': dept.departmentName,
    '员工总数': dept.totalEmployees,
    '已完成体检': dept.completedCount,
    '完成率(%)': dept.completionRate,
    '待体检': dept.pendingCount,
    '未开始': dept.notStartedCount,
    '异常报告数': dept.abnormalCount,
    '已使用预算(元)': dept.budgetUsed,
    '部门总预算(元)': dept.budgetTotal,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(reportData);

  ws['!cols'] = [
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, '月度体检统计');

  const summaryRow = {
    '部门名称': '合计',
    '员工总数': data.reduce((sum, d) => sum + d.totalEmployees, 0),
    '已完成体检': data.reduce((sum, d) => sum + d.completedCount, 0),
    '完成率(%)': Math.round(data.reduce((sum, d) => sum + d.completionRate, 0) / data.length),
    '待体检': data.reduce((sum, d) => sum + d.pendingCount, 0),
    '未开始': data.reduce((sum, d) => sum + d.notStartedCount, 0),
    '异常报告数': data.reduce((sum, d) => sum + d.abnormalCount, 0),
    '已使用预算(元)': data.reduce((sum, d) => sum + d.budgetUsed, 0),
    '部门总预算(元)': data.reduce((sum, d) => sum + d.budgetTotal, 0),
  };

  const wsData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];
  wsData.push(Object.values(summaryRow) as unknown[]);
  XLSX.utils.sheet_add_aoa(ws, wsData as unknown[][]);

  XLSX.writeFile(wb, `员工体检月度报表_${month}.xlsx`);
}

export function exportNotStartedList(employees: { id: string; name: string; department: string; employeeNo: string }[]) {
  const exportData = employees.map((emp, index) => ({
    '序号': index + 1,
    '员工姓名': emp.name,
    '工号': emp.employeeNo,
    '所属部门': emp.department,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  ws['!cols'] = [
    { wch: 8 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, '未体检人员名单');
  XLSX.writeFile(wb, `未体检人员名单_${new Date().toISOString().split('T')[0]}.xlsx`);
}
