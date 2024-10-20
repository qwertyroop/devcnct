"use client";
import React, { useState } from 'react';
import { Button, Input, Textarea } from '@nextui-org/react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Plus, Minus, Save } from 'lucide-react';
import { PortfolioType, workExperience, ProjectType, HackathonType } from '@/types/portfolioType';

const EditProfileForm = ({ user, username }: { user: PortfolioType; username: string }) => {
  const [formData, setFormData] = useState<PortfolioType>({
    username: user.username || '',
    email: user.email || '',
    fullName: user.fullName || '',
    bio: user.bio || '',
    education: user.education || '',
    skills: user.skills || [],
    workExperience: user.workExperience || [],
    projects: user.projects || [],
    hackathons: user.hackathons || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      window.location.href = `/${username}`;
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleWorkExperienceChange = (index: number, field: keyof workExperience, value: string) => {
    const newWorkExperience = [...(formData.workExperience || [])];
    newWorkExperience[index] = {
      ...newWorkExperience[index],
      [field]: value
    };
    setFormData({ ...formData, workExperience: newWorkExperience });
  };

  const handleProjectChange = (index: number, field: keyof ProjectType, value: string | string[]) => {
    const newProjects = [...formData.projects];
    newProjects[index] = {
      ...newProjects[index],
      [field]: field === 'date' ? new Date(value as string) : value
    };
    setFormData({ ...formData, projects: newProjects });
  };

  const handleHackathonChange = (index: number, field: keyof HackathonType, value: string | string[]) => {
      const newHackathons = [...(formData.hackathons || [])];
      newHackathons[index] = {
        ...newHackathons[index],
        [field]: field === 'date' ? new Date(value as string) : value
      };
      setFormData({ ...formData, hackathons: newHackathons });
    };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [...(formData.workExperience || []), {
        companyLogo: '',
        companyName: '',
        role: '',
        startDate: '',
        endDate: ''
      }]
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, {
        imageURL: '',
        date: new Date(),
        skills: [],
        link: '',
        githubRepository: ''
      }]
    });
  };

  const addHackathon = () => {
    setFormData({
      ...formData,
      hackathons: [...(formData.hackathons || []), {
        date: new Date(),
        title: '',
        description: '',
        location: '',
        skills: []
      }]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Basic Information</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
          <Input
            label="Education"
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
          />
          <Input
            label="Skills (comma-separated)"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(skill => skill.trim()) })}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Work Experience</h2>
          <Button onClick={addWorkExperience} size="sm" color="primary">
            <Plus size={16} /> Add Experience
          </Button>
        </CardHeader>
        <CardBody>
          {formData.workExperience?.map((exp, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <Input
                label="Company Logo URL"
                value={exp.companyLogo?.toString() || ''}
                onChange={(e) => handleWorkExperienceChange(index, 'companyLogo', e.target.value)}
                className="mb-2"
              />
              <Input
                label="Company Name"
                value={exp.companyName.toString()}
                onChange={(e) => handleWorkExperienceChange(index, 'companyName', e.target.value)}
                className="mb-2"
              />
              <Input
                label="Role"
                value={exp.role.toString()}
                onChange={(e) => handleWorkExperienceChange(index, 'role', e.target.value)}
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Start Date"
                  type="date"
                  value={exp.startDate.toString()}
                  onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={exp.endDate.toString()}
                  onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Button onClick={addProject} size="sm" color="primary">
            <Plus size={16} /> Add Project
          </Button>
        </CardHeader>
        <CardBody>
          {formData.projects.map((project, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <Input
                label="Image URL"
                value={project.imageURL?.toString() || ''}
                onChange={(e) => handleProjectChange(index, 'imageURL', e.target.value)}
                className="mb-2"
              />
              <Input
                label="Date"
                type="date"
                value={project.date.toISOString().split('T')[0]}
                onChange={(e) => handleProjectChange(index, 'date', e.target.value)}
                className="mb-2"
              />
              <Input
                label="Skills (comma-separated)"
                value={project.skills.join(', ')}
                onChange={(e) => handleProjectChange(index, 'skills', e.target.value.split(',').map(skill => skill.trim()) as string[])}
                className="mb-2"
              />
              <Input
                label="Link"
                value={project.link.toString()}
                onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                className="mb-2"
              />
              <Input
                label="GitHub Repository"
                value={project.githubRepository?.toString() || ''}
                onChange={(e) => handleProjectChange(index, 'githubRepository', e.target.value)}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Hackathons</h2>
          <Button onClick={addHackathon} size="sm" color="primary">
            <Plus size={16} /> Add Hackathon
          </Button>
        </CardHeader>
        <CardBody>
          {formData.hackathons?.map((hackathon, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <Input
                label="Date"
                type="date"
                value={hackathon.date.toISOString().split('T')[0]}
                onChange={(e) => handleHackathonChange(index, 'date', e.target.value)}
                className="mb-2"
              />
              <Input
                label="Title"
                value={hackathon.title.toString()}
                onChange={(e) => handleHackathonChange(index, 'title', e.target.value)}
                className="mb-2"
              />
              <Textarea
                label="Description"
                value={hackathon.description.toString()}
                onChange={(e) => handleHackathonChange(index, 'description', e.target.value)}
                className="mb-2"
              />
              <Input
                label="Location"
                value={hackathon.location.toString()}
                onChange={(e) => handleHackathonChange(index, 'location', e.target.value)}
                className="mb-2"
              />
              <Input
                label="Skills (comma-separated)"
                value={hackathon.skills.join(', ')}
                onChange={(e) => handleHackathonChange(index, 'skills', e.target.value.split(',').map(skill => skill.trim()) as string[])}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button
          color="primary"
          type="submit"
          className="px-8"
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;