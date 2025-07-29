import React, { useState } from 'react';
import { Users, Search, Filter, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'photographer' | 'designer' | 'admin';
  department: string;
  position: string;
  salary: number;
  status: 'active' | 'inactive';
  joinDate: string;
  avatar?: string;
}

export function EmployeesList() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'Анна Иванова',
      email: 'anna@photoalbums.com',
      role: 'photographer',
      department: 'Фотостудия',
      position: 'Старший фотограф',
      salary: 75000,
      status: 'active',
      joinDate: '2024-01-15',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: 'Михаил Петров',
      email: 'mikhail@photoalbums.com',
      role: 'designer',
      department: 'Дизайн',
      position: 'Ведущий дизайнер',
      salary: 80000,
      status: 'active',
      joinDate: '2024-01-10',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: 'Елена Сидорова',
      email: 'elena@photoalbums.com',
      role: 'admin',
      department: 'Администрация',
      position: 'Администратор системы',
      salary: 90000,
      status: 'active',
      joinDate: '2024-01-01',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '4',
      name: 'Дмитрий Козлов',
      email: 'dmitry@photoalbums.com',
      role: 'photographer',
      department: 'Фотостудия',
      position: 'Фотограф',
      salary: 60000,
      status: 'inactive',
      joinDate: '2023-12-01'
    }
  ];

  const getRoleLabel = (role: string) => {
    const roleMap = {
      photographer: 'Фотограф',
      designer: 'Дизайнер',
      admin: 'Администратор'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap = {
      photographer: 'bg-blue-100 text-blue-800',
      designer: 'bg-purple-100 text-purple-800',
      admin: 'bg-green-100 text-green-800'
    };
    return colorMap[role as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-50 text-red-600';
  };

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-red-500 mb-4">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Доступ запрещен</h3>
            <p className="text-gray-600">
              Только администраторы могут просматривать список сотрудников
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Сотрудники</h1>
          <p className="text-gray-600 mt-1">
            Управление сотрудниками компании
          </p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Экспорт списка
        </Button>
      </div>

      {/* Фильтры и поиск */}
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Все роли</option>
                <option value="photographer">Фотографы</option>
                <option value="designer">Дизайнеры</option>
                <option value="admin">Администраторы</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список сотрудников */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={employee.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop'}
                  alt={employee.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-gray-600">{employee.position}</p>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                    </div>
                    <div className="flex space-x-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                        {getRoleLabel(employee.role)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {employee.status === 'active' ? 'Активен' : 'Неактивен'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {employee.email}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Дата найма: {new Date(employee.joinDate).toLocaleDateString('ru-RU')}
                      </span>
                      <span className="font-medium text-gray-900">
                        {employee.salary.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Редактировать
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Сотрудники не найдены</h3>
            <p className="text-gray-600">
              Попробуйте изменить параметры поиска или фильтрации
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}