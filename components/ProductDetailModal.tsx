
import React, { useState, useEffect } from 'react';
import { SystemLayer } from '../types';
import { XCircleIcon } from './icons/Icons';

interface ProductDetailModalProps {
  layerData: { layer: SystemLayer, index: number };
  onClose: () => void;
  onSave: (index: number, updatedLayer: SystemLayer) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ layerData, onClose, onSave }) => {
  const [editedLayer, setEditedLayer] = useState<SystemLayer>(layerData.layer);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [section, key] = name.split('.');

    if (section === 'recommended_product' || section === 'application_recommendation') {
        let parsedValue: string | number = value;
        if(e.target.type === 'number') {
            parsedValue = value ? parseFloat(value) : 0;
        }

      setEditedLayer(prev => ({
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [key]: parsedValue,
        }
      }));
    } else {
      setEditedLayer(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    onSave(layerData.index, editedLayer);
  };
  
  const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        {children}
    </div>
  );
  
  const TextInput = (props: React.ComponentProps<'input'>) => <input type="text" {...props} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"/>;
  const NumberInput = (props: React.ComponentProps<'input'>) => <input type="number" {...props} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"/>;
  const TextArea = (props: React.ComponentProps<'textarea'>) => <textarea {...props} rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"/>;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 capitalize">Edit Layer: {editedLayer.role}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircleIcon className="w-7 h-7" />
          </button>
        </header>

        <main className="p-6 overflow-y-auto space-y-6">
          {/* Recommended Product Section */}
          <section>
            <h3 className="text-lg font-semibold text-primary mb-2">Recommended Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
                <FormRow label="Manufacturer"><TextInput name="recommended_product.manufacturer" value={editedLayer.recommended_product.manufacturer} onChange={handleChange}/></FormRow>
                <FormRow label="Product Name"><TextInput name="recommended_product.product_name" value={editedLayer.recommended_product.product_name} onChange={handleChange}/></FormRow>
                <FormRow label="TDS URL"><TextInput name="recommended_product.tds_url" value={editedLayer.recommended_product.tds_url || ''} onChange={handleChange} placeholder="https://..."/></FormRow>
                <FormRow label="SDS URL"><TextInput name="recommended_product.sds_url" value={editedLayer.recommended_product.sds_url || ''} onChange={handleChange} placeholder="https://..."/></FormRow>
                <FormRow label="Stock Availability"><TextInput name="recommended_product.stock_availability" value={editedLayer.recommended_product.stock_availability} onChange={handleChange}/></FormRow>
            </div>
          </section>
          
          {/* Rationale Section */}
          <section>
            <h3 className="text-lg font-semibold text-primary mb-2">Rationale</h3>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                <FormRow label="Reason for Selection"><TextArea name="reason_for_selection" value={editedLayer.reason_for_selection} onChange={handleChange}/></FormRow>
                <FormRow label="Compatibility Notes"><TextArea name="compatibility_notes" value={editedLayer.compatibility_notes} onChange={handleChange}/></FormRow>
            </div>
          </section>
          
          {/* Application Section */}
          <section>
            <h3 className="text-lg font-semibold text-primary mb-2">Application Recommendation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
                 <FormRow label="Recommended Coats"><NumberInput name="application_recommendation.recommended_number_of_coats" value={editedLayer.application_recommendation.recommended_number_of_coats} onChange={handleChange}/></FormRow>
                 <FormRow label="Film Thickness (micron)"><NumberInput name="application_recommendation.recommended_film_thickness_micron" value={editedLayer.application_recommendation.recommended_film_thickness_micron} onChange={handleChange}/></FormRow>
                 <FormRow label="Drying Time (hours)"><NumberInput name="application_recommendation.drying_time_between_coats_hours" value={editedLayer.application_recommendation.drying_time_between_coats_hours} onChange={handleChange}/></FormRow>
                 <FormRow label="Equipment"><TextInput name="application_recommendation.equipment" value={editedLayer.application_recommendation.equipment} onChange={handleChange}/></FormRow>
                 <div className="md:col-span-2">
                    <FormRow label="Mixing Instructions"><TextArea name="application_recommendation.mixing_instructions" value={editedLayer.application_recommendation.mixing_instructions} onChange={handleChange}/></FormRow>
                 </div>
            </div>
          </section>
        </main>
        
        <footer className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors">
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProductDetailModal;
