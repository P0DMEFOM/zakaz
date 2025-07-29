import React from 'react';
import { 
  Camera, 
  Palette, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export function Dashboard() {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Добро пожаловать';
    
    if (hour < 12) greeting = 'Доброе утро';
    else if (hour < 18) greeting = 'Добрый день';
    else greeting = 'Добрый вечер';

    return `${greeting}, ${user?.name}!`;
  };

  const getRoleSpecificStats = () => {
    switch (user?.role) {
      case 'photographer':
        return [
          { label: 'Загружено фото', value: '1,247', icon: Camera, color: 'blue' },
          { label: 'Активные проекты', value: '8', icon: FolderOpen, color: 'green' },
          { label: 'Ожидают обработки', value: '23', icon: Clock, color: 'yellow' },
          { label: 'Завершено в этом месяце', value: '12', icon: CheckCircle, color: 'purple' }
        ];
      case 'designer':
        return [
          { label: 'Созданные макеты', value: '84', icon: Palette, color: 'purple' },
          { label: 'Активные проекты', value: '6', icon: FolderOpen, color: 'green' },
          { label: 'На согласовании', value: '4', icon: AlertCircle, color: 'yellow' },
          { label: 'Одобрено в этом месяце', value: '15', icon: CheckCircle, color: 'blue' }
        ];
      case 'admin':
        return [
          { label: 'Всего проектов', value: '156', icon: FolderOpen, color: 'blue' },
          { label: 'Активные пользователи', value: '24', icon: Users, color: 'green' },
          { label: 'Рост за месяц', value: '+12%', icon: TrendingUp, color: 'purple' },
          { label: 'Завершено проектов', value: '89', icon: CheckCircle, color: 'yellow' }
        ];
      default:
        return [];
    }
  };

  const recentProjects = [
    {
      id: '1',
      title: 'Свадебный альбом "Анна & Михаил"',
      albumType: 'Свадебный альбом',
      status: 'В работе',
      deadline: '2024-02-15',
      progress: 75,
      manager: 'Елена Сидорова',
      photographer: 'Анна Иванова',
      designer: 'Михаил Петров'
    },
    {
      id: '2',
      title: 'Детская фотосессия "Семья Петровых"',
      albumType: 'Детский альбом',
      status: 'Ожидает дизайна',
      deadline: '2024-02-20',
      progress: 40,
      manager: 'Елена Сидорова',
      photographer: 'Анна Иванова',
      designer: 'Не назначен'
    },
    {
      id: '3',
      title: 'Корпоративный альбом "ООО Рога и копыта"',
      albumType: 'Корпоративный альбом',
      status: 'На согласовании',
      deadline: '2024-02-10',
      progress: 90,
      manager: 'Елена Сидорова',
      photographer: 'Анна Иванова',
      designer: 'Михаил Петров'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'В работе': return 'bg-blue-100 text-blue-800';
      case 'Ожидает дизайна': return 'bg-yellow-100 text-yellow-800';
      case 'На согласовании': return 'bg-purple-100 text-purple-800';
      case 'Завершен': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="text-gray-600 mt-1">
            Вот что происходит в ваших проектах сегодня
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Сегодня</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getRoleSpecificStats().map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            yellow: 'bg-yellow-50 text-yellow-600',
            purple: 'bg-purple-50 text-purple-600'
          };
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Последние проекты */}
      <Card>
        <CardHeader>
          <CardTitle>Последние проекты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-blue-600 font-medium">{project.albumType}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>Менеджер: {project.manager}</span>
                    <span>Фотограф: {project.photographer}</span>
                    <span>Дизайнер: {project.designer}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Дедлайн: {new Date(project.deadline).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
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
                </div>
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}