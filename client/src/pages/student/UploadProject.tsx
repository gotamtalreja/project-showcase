import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Loader2, X, Plus } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { authAPI, Instructor } from '../../api/auth.api';
import { projectAPI, CreateProjectData } from '../../api/project.api';
import { useToast } from '../../components/ui/toast';

const UploadProject: React.FC = () => {
    const [formData, setFormData] = useState<CreateProjectData>({
        projectName: '',
        groupMembers: [''],
        subject: '',
        technologies: [''],
        youtubeLink: '',
        descriptionLink: '',
        instructorId: '',
    });
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const data = await authAPI.getInstructors();
            setInstructors(data);
        } catch (error) {
            showToast('error', 'Failed to load instructors');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (index: number, value: string, field: 'groupMembers' | 'technologies') => {
        const updatedArray = [...formData[field]];
        updatedArray[index] = value;
        setFormData({ ...formData, [field]: updatedArray });
    };

    const addArrayField = (field: 'groupMembers' | 'technologies') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayField = (index: number, field: 'groupMembers' | 'technologies') => {
        if (formData[field].length > 1) {
            const updatedArray = formData[field].filter((_, i) => i !== index);
            setFormData({ ...formData, [field]: updatedArray });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const filteredMembers = formData.groupMembers.filter((m) => m.trim() !== '');
        const filteredTechnologies = formData.technologies.filter((s) => s.trim() !== '');

        if (filteredMembers.length === 0) {
            showToast('error', 'Please add at least one group member');
            return;
        }

        if (filteredTechnologies.length === 0) {
            showToast('error', 'Please add at least one technology');
            return;
        }

        setIsLoading(true);

        try {
            await projectAPI.createProject({
                ...formData,
                groupMembers: filteredMembers,
                technologies: filteredTechnologies,
            });
            showToast('success', 'Project uploaded successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            showToast('error', error.response?.data?.message || 'Failed to upload project');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <Card className="shadow-glow-sm">
                        <CardHeader>
                            <div className="mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-fit">
                                <Upload className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-3xl text-center">Upload New Project</CardTitle>
                            <CardDescription className="text-center">
                                Showcase your amazing work to the community
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Project Name */}
                                <div className="space-y-2">
                                    <label htmlFor="projectName" className="text-sm font-medium">
                                        Project Name *
                                    </label>
                                    <Input
                                        id="projectName"
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleChange}
                                        placeholder="My Awesome Project"
                                        required
                                    />
                                </div>

                                {/* Group Members */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Group Members *</label>
                                    {formData.groupMembers.map((member, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={member}
                                                onChange={(e) => handleArrayChange(index, e.target.value, 'groupMembers')}
                                                placeholder="Member name"
                                            />
                                            {formData.groupMembers.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => removeArrayField(index, 'groupMembers')}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addArrayField('groupMembers')}
                                        className="w-full"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Member
                                    </Button>
                                </div>

                                {/* Instructor */}
                                <div className="space-y-2">
                                    <label htmlFor="instructorId" className="text-sm font-medium">
                                        Assign Instructor *
                                    </label>
                                    <select
                                        id="instructorId"
                                        name="instructorId"
                                        value={formData.instructorId}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        required
                                    >
                                        <option value="">Select an instructor</option>
                                        {instructors.map((instructor) => (
                                            <option key={instructor._id} value={instructor._id}>
                                                {instructor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium">
                                        Subject *
                                    </label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="e.g., Web Development, Machine Learning"
                                        required
                                    />
                                </div>

                                {/* Skills */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Technologies Used *</label>
                                    {formData.technologies.map((tech, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={tech}
                                                onChange={(e) => handleArrayChange(index, e.target.value, 'technologies')}
                                                placeholder="e.g., React, TypeScript, MongoDB"
                                            />
                                            {formData.technologies.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => removeArrayField(index, 'technologies')}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addArrayField('technologies')}
                                        className="w-full"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Technology
                                    </Button>
                                </div>

                                {/* YouTube Link */}
                                <div className="space-y-2">
                                    <label htmlFor="youtubeLink" className="text-sm font-medium">
                                        YouTube Video Link *
                                    </label>
                                    <Input
                                        id="youtubeLink"
                                        name="youtubeLink"
                                        value={formData.youtubeLink}
                                        onChange={handleChange}
                                        placeholder="https://youtube.com/watch?v=..."
                                        type="url"
                                        required
                                    />
                                </div>

                                {/* Description Link */}
                                <div className="space-y-2">
                                    <label htmlFor="descriptionLink" className="text-sm font-medium">
                                        Description Link *
                                    </label>
                                    <Input
                                        id="descriptionLink"
                                        name="descriptionLink"
                                        value={formData.descriptionLink}
                                        onChange={handleChange}
                                        placeholder="https://github.com/... or https://drive.google.com/..."
                                        type="url"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Link to GitHub, Google Drive, or project website
                                    </p>
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        'Upload Project'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </Layout>
    );
};

export default UploadProject;
