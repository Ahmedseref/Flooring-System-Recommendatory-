
import React from 'react';
import { ProjectDetails } from '../types';
import { InfoIcon } from './icons/Icons';

interface ProjectFormProps {
  projectDetails: ProjectDetails;
  setProjectDetails: React.Dispatch<React.SetStateAction<ProjectDetails>>;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projectDetails, setProjectDetails }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('constraints.')) {
        const key = name.split('.')[1];
        let parsedValue: string | number | [number, number] = value;
        if (key === 'temp_range_C') {
            const range = value.split(',').map(v => parseInt(v.trim(), 10));
            parsedValue = [range[0] || 0, range[1] || 0];
        } else {
            parsedValue = value ? parseFloat(value) : 0;
        }
        
        setProjectDetails(prev => ({
            ...prev,
            constraints: { ...prev.constraints, [key]: parsedValue }
        }));
    } else if (name === 'performance_requirements') {
         setProjectDetails(prev => ({ ...prev, [name]: value.split(',').map(req => req.trim()) }));
    } else {
        const parsedValue = e.target.type === 'number' && value ? parseFloat(value) : value;
        setProjectDetails(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Project Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Fields */}
        <div className="md:col-span-2">
            <label htmlFor="system_name" className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
            <input type="text" name="system_name" value={projectDetails.system_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
        <div>
            <label htmlFor="area_m2" className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
            <input type="number" name="area_m2" value={projectDetails.area_m2} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
        <div>
            <label htmlFor="substrate" className="block text-sm font-medium text-gray-700 mb-1">Substrate</label>
            <input type="text" name="substrate" value={projectDetails.substrate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
        <div className="md:col-span-2">
            <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
            <input type="text" name="environment" value={projectDetails.environment} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
        <div className="md:col-span-2">
            <label htmlFor="traffic_type" className="block text-sm font-medium text-gray-700 mb-1">Traffic Type</label>
            <input type="text" name="traffic_type" value={projectDetails.traffic_type} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
        <div className="md:col-span-2">
            <label htmlFor="performance_requirements" className="block text-sm font-medium text-gray-700 mb-1">Performance Requirements (comma-separated)</label>
            <input type="text" name="performance_requirements" value={projectDetails.performance_requirements.join(', ')} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
        
        {/* Constraints */}
        <h3 className="md:col-span-2 text-lg font-semibold mt-4 text-gray-700">Constraints</h3>
        <div>
            <label htmlFor="constraints.budget_per_m2" className="block text-sm font-medium text-gray-700 mb-1">Budget per m²</label>
            <input type="number" name="constraints.budget_per_m2" value={projectDetails.constraints.budget_per_m2 || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
         <div>
            <label htmlFor="constraints.max_voc_g_per_L" className="block text-sm font-medium text-gray-700 mb-1">Max VOC (g/L)</label>
            <input type="number" name="constraints.max_voc_g_per_L" value={projectDetails.constraints.max_voc_g_per_L || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
        <div>
            <label htmlFor="constraints.cure_time_hours_max" className="block text-sm font-medium text-gray-700 mb-1">Max Cure Time (hours)</label>
            <input type="number" name="constraints.cure_time_hours_max" value={projectDetails.constraints.cure_time_hours_max || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
        <div>
            <label htmlFor="constraints.temp_range_C" className="block text-sm font-medium text-gray-700 mb-1">Temp Range °C (min, max)</label>
            <input type="text" name="constraints.temp_range_C" value={projectDetails.constraints.temp_range_C.join(', ')} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
