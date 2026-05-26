import api from './api';

export interface Project {
    _id: string;
    projectName: string;
    groupMembers: string[];
    subject: string;
    technologies: string[];
    youtubeLink: string;
    descriptionLink: string;
    studentId: {
        _id: string;
        name: string;
        email: string;
    } | null;
    instructorId: {
        _id: string;
        name: string;
        email: string;
    } | null;
    instructorFeedback?: string;
    likes: string[];
    status: 'pending' | 'approved' | 'rejected';
    adminRemarks?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectData {
    projectName: string;
    groupMembers: string[];
    subject: string;
    technologies: string[];
    youtubeLink: string;
    descriptionLink: string;
    instructorId: string;
}

export const projectAPI = {
    getAllProjects: async (): Promise<Project[]> => {
        const response = await api.get('/projects');
        return response.data.data;
    },

    getProjectById: async (id: string): Promise<Project> => {
        const response = await api.get(`/projects/${id}`);
        return response.data.data;
    },

    createProject: async (data: CreateProjectData): Promise<Project> => {
        const response = await api.post('/projects', data);
        return response.data.data;
    },

    getStudentProjects: async (): Promise<Project[]> => {
        const response = await api.get('/projects/student/my-projects');
        return response.data.data;
    },

    getInstructorProjects: async (): Promise<Project[]> => {
        const response = await api.get('/projects/instructor/assigned');
        return response.data.data;
    },

    addFeedback: async (id: string, feedback: string): Promise<Project> => {
        const response = await api.put(`/projects/${id}/feedback`, { feedback });
        return response.data.data;
    },

    toggleLike: async (id: string): Promise<{ likesCount: number; hasLiked: boolean }> => {
        const response = await api.post(`/projects/${id}/like`);
        return response.data.data;
    },

    // Admin endpoints
    getAllProjectsAdmin: async (): Promise<Project[]> => {
        const response = await api.get('/projects/admin/all');
        return response.data.data;
    },

    getPendingProjects: async (): Promise<Project[]> => {
        const response = await api.get('/projects/admin/pending');
        return response.data.data;
    },

    reviewProject: async (id: string, status: 'approved' | 'rejected', remarks?: string): Promise<Project> => {
        const response = await api.put(`/projects/${id}/review`, { status, remarks });
        return response.data.data;
    },
};
