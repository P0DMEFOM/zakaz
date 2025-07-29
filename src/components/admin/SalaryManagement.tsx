import React, { useState } from 'react';
import { DollarSign, Search, Filter, TrendingUp, TrendingDown, Calendar, MessageCircle, Phone, Mail, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';

interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
  paymentDate: string;
  status: 'paid' | 'pending' | 'processing';
}

export function SalaryManagement() {
  const { user, users } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('2024-02');
  const [contactEmployee, setContactEmployee] = useState<SalaryRecord | null>(null);

  // Генерируем записи о зарплатах на основе реальных пользователей
  const mockSalaryRecords: SalaryRecord[] = users
    .filter(user => user.salary)
    .map(user => {
      const bonus = Math.floor(Math.random() * 20000);
      const deductions = Math.floor(Math.random() * 5000);
      const roleLabels = {
        photographer: 'Фотограф',
        designer: 'Дизайнер',
        admin: 'Администратор'
      };
      
      return {
        id: user.id,
        employeeId: user.id,
        employeeName: user.name,
        role: roleLabels[user.role],
        department: user.department || 'Не указан',
        baseSalary: user.salary!,
        bonus,
        deductions,
        totalSalary: user.salary! + bonus - deductions,
        paymentDate: '2024-02-01',
        status: ['paid', 'processing', 'pending'][Math.floor(Math.random() * 3)] as 'paid' | 'processing' | 'pending'
      };
    });

  const getStatusInfo = (status: string) => {
    const statusMap = {
      paid: { label: 'Выплачено', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Ожидает', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Обработка', color: 'bg-blue-100 text-blue-800' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const filteredRecords = mockSalaryRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSalaries = filteredRecords.reduce((sum, record) => sum + record.totalSalary, 0);
  const totalBonuses = filteredRecords.reduce((sum, record) => sum + record.bonus, 0);
  const totalDeductions = filteredRecords.reduce((sum, record) => sum + record.deductions, 0);

  const handleContact = (record: SalaryRecord) => {
    setContactEmployee(record);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Зарплаты сотрудников</h1>
            <p className="text-gray-600 mt-1">
              Информация о выплатах сотрудникам
            </p>
          </div>
          {user?.role === 'admin' && (
            <div className="flex space-x-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Экспорт отчета
              </Button>
            </div>
          )}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общая сумма</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalSalaries.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Премии</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalBonuses.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Удержания</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalDeductions.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-50 text-red-600">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Сотрудников</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{filteredRecords.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </Card>
        
        {/* Фильтры */}
        <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск сотрудников..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Все статусы</option>
                <option value="paid">Выплачено</option>
                <option value="processing">Обработка</option>
                <option value="pending">Ожидает</option>
              </select>
            </div>
            <div>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Таблица зарплат */}
        <Card>
          <CardHeader>
            <CardTitle>Зарплаты за {new Date(selectedMonth + '-01').toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Сотрудник</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Отдел</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Оклад</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Премия</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Удержания</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">К выплате</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Статус</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Контакт</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => {
                    const statusInfo = getStatusInfo(record.status);
                    return (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{record.employeeName}</p>
                            <p className="text-sm text-gray-500">{record.role}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{record.department}</td>
                        <td className="py-3 px-4 text-right font-medium">
                          {record.baseSalary.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 font-medium">
                          +{record.bonus.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="py-3 px-4 text-right text-red-600 font-medium">
                          -{record.deductions.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          {record.totalSalary.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button size="sm" variant="outline" onClick={() => handleContact(record)}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Связаться
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Modal */}
      {contactEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Связаться с сотрудником</h2>
              <button
                onClick={() => setContactEmployee(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">
                    {contactEmployee.employeeName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{contactEmployee.employeeName}</h3>
                  <p className="text-gray-600">{contactEmployee.role}</p>
                  <p className="text-sm text-gray-500">{contactEmployee.department}</p>
                </div>
              </div>
              <div className="space-y-3">
                <a
                  href={`mailto:${users.find(u => u.id === contactEmployee.employeeId)?.email}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{users.find(u => u.id === contactEmployee.employeeId)?.email}</p>
                  </div>
                </a>
                <a
                  href={`tel:+7${Math.floor(Math.random() * 9000000000) + 1000000000}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Телефон</p>
                    <p className="text-sm text-gray-600">+7 {Math.floor(Math.random() * 900) + 100} {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 90) + 10}-{Math.floor(Math.random() * 90) + 10}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}