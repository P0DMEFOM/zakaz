import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Camera,
  Palette,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';

export function ProjectsList() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockProjects = [
    {
      id: '1',
      title: 'Свадебный альбом "Анна & Михаил"',
      albumType: 'Свадебный альбом',
      description: 'Создание премиального свадебного альбома с 150 фотографиями',
      status: 'in-progress',
      manager: { name: 'Елена Сидорова', id: '3' },
      photographer: { name: 'Анна Иванова', id: '1' },
      designer: { name: 'Михаил Петров', id: '2' },
      deadline: '2024-02-15',
      createdAt: '2024-01-10',
      progress: 75,
      photosCount: 150,
      designsCount: 8
    },
    {
      id: '2',
      title: 'Детская фотосессия "Семья Петровых"',
      albumType: 'Детский альбом',
      description: 'Семейный альбом с детской фотосессией в студии',
      status: 'planning',
      manager: { name: 'Елена Сидорова', id: '3' },
      photographer: { name: 'Анна Иванова', id: '1' },
      designer: null,
      deadline: '2024-02-20',
      createdAt: '2024-01-15',
      progress: 25,
      photosCount: 89,
      designsCount: 0
    },
    {
      id: '3',
      title: 'Корпоративный альбом "ООО Рога и копыта"',
      albumType: 'Корпоративный альбом',
      description: 'Презентационный альбом для корпоративных клиентов',
      status: 'review',
      manager: { name: 'Елена Сидорова', id: '3' },
      photographer: { name: 'Анна Иванова', id: '1' },
      designer: { name: 'Михаил Петров', id: '2' },
      deadline: '2024-02-10',
      createdAt: '2024-01-05',
      progress: 90,
      photosCount: 45,
      designsCount: 12
    },
    {
      id: '4',
      title: 'Выпускной альбом школы №15',
      albumType: 'Выпускной альбом',
      description: 'Выпускной альбом для 11 класса с групповыми и индивидуальными фото',
      status: 'completed',
      manager: { name: 'Елена Сидорова', id: '3' },
      photographer: { name: 'Анна Иванова', id: '1' },
      designer: { name: 'Михаил Петров', id: '2' },
      deadline: '2024-01-30',
      createdAt: '2023-12-15',
      progress: 100,
      photosCount: 200,
      designsCount: 15
    }
  ];

  const getStatusInfo = (status: string) => {
    const statusMap = {
      'planning': { label: 'Планирование', color: 'bg-gray-100 text-gray-800', icon: Clock },
      'in-progress': { label: 'В работе', color: 'bg-blue-100 text-blue-800', icon: Camera },
      'review': { label: 'На проверке', color: 'bg-yellow-100 text-yellow-800', icon: Palette },
      'completed': { label: 'Завершен', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.planning;
  };

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    // Фильтрация по роли пользователя
    if (user?.role === 'photographer') {
      return matchesSearch && matchesStatus && project.photographer?.id === user.id;
    } else if (user?.role === 'designer') {
      return matchesSearch && matchesStatus && project.designer?.id === user.id;
    }
    
    return matchesSearch && matchesStatus;
  });

  const canCreateProject = user?.role === 'admin' || user?.role === 'photographer';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Проекты</h1>
          <p className="text-gray-600 mt-1">
            Управляйте вашими проектами фотоальбомов
          </p>
        </div>
        {canCreateProject && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать проект
          </Button>
        )}
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск проектов..."
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
                <option value="planning">Планирование</option>
                <option value="in-progress">В работе</option>
                <option value="review">На проверке</option>
                <option value="completed">Завершен</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список проектов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const statusInfo = getStatusInfo(project.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                    <p className="text-sm font-medium text-blue-600 mb-1">{project.albumType}</p>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Прогресс */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Прогресс</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Команда */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Менеджер:</span>
                      <span className="text-gray-600">{project.manager?.name || 'Не назначен'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Camera className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Фотограф:</span>
                      <span className="text-gray-600">{project.photographer?.name || 'Не назначен'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Palette className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Дизайнер:</span>
                      <span className="text-gray-600">{project.designer?.name || 'Не назначен'}</span>
                    </div>
                  </div>

                  {/* Статистика */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">Фото: {project.photosCount}</span>
                      <span className="text-gray-600">Макеты: {project.designsCount}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.deadline).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <FolderOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Проекты не найдены</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Попробуйте изменить параметры поиска или фильтрации'
                : 'У вас пока нет проектов. Создайте первый проект, чтобы начать работу.'}
            </p>
            {canCreateProject && !searchTerm && statusFilter === 'all' && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Создать первый проект
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}