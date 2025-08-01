export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  telegram?: string;
  role: 'photographer' | 'designer' | 'admin';
  department?: string;
  position?: string;
  salary?: number;
  avatar?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  albumType: string;
  description: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  manager?: User;
  photographer?: User;
  designer?: User;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  photosCount: number;
  designsCount: number;
  files: ProjectFile[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'photo' | 'design' | 'document';
  url: string;
  uploadedBy: User;
  uploadedAt: Date;
  size: number;
}

export interface Comment {
  id: string;
  projectId: string;
  author: User;
  content: string;
  createdAt: Date;
}