import React, { useState } from 'react';
import { CandidateProduct, LayerType } from '../types';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, SparklesIcon } from './icons/Icons';
import { generateProductDescription } from '../services/geminiService';


interface ProductManagerProps {
  products: CandidateProduct[];
  setProducts: React.Dispatch<React.SetStateAction<CandidateProduct[]>>;
  availableLayerTypes: string[];
  addLayerType: (newType: string) => void;
}

const ProductCard: React.FC<{
  product: CandidateProduct;
  updateProduct: (id: string, field: string, value: any) => void;
  removeProduct: (id: string) => void;
  availableLayerTypes: string[];
}> = ({ product, updateProduct, removeProduct, availableLayerTypes }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    
    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number | [number, number] | undefined = value;
        if (e.target.type === 'number') {
            parsedValue = value ? parseFloat(value) : undefined;
        }
        if (name === 'temperature_range_C') {
             const range = value.split(',').map(v => parseInt(v.trim(), 10));
             parsedValue = [range[0] || 0, range[1] || 0];
        }
        updateProduct(product.id, `specs.${name}`, parsedValue);
    }
    
    const handleLayerTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = e.target.options;
        const value: LayerType[] = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value as LayerType);
            }
        }
        updateProduct(product.id, 'layer_type', value);
    }

    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        try {
            const { id, ...productData } = product;
            const description = await generateProductDescription(productData);
            updateProduct(product.id, 'description', description);
        } catch (error) {
            console.error("Failed to generate description:", error);
            // Optionally, show an error to the user
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                 <h4 className="font-semibold text-primary">{product.product_name || 'New Product'}</h4>
                 <div className="flex items-center gap-2">
                     <button onClick={(e) => {e.stopPropagation(); removeProduct(product.id)}} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                     {isOpen ? <ChevronUpIcon className="w-5 h-5"/> : <ChevronDownIcon className="w-5 h-5"/>}
                 </div>
            </div>
            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <input type="text" placeholder="Manufacturer" value={product.manufacturer} onChange={(e) => updateProduct(product.id, 'manufacturer', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                    <input type="text" placeholder="Product Name" value={product.product_name} onChange={(e) => updateProduct(product.id, 'product_name', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                    
                    {/* Data Sheet Section */}
                    <div className="md:col-span-2 space-y-3 pt-2">
                        <div className="relative">
                             <label className="block text-xs font-medium text-gray-600 mb-1">Product Description</label>
                             <textarea value={product.description || ''} onChange={(e) => updateProduct(product.id, 'description', e.target.value)} rows={3} placeholder="A short technical description..." className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                             <button onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="absolute bottom-2 right-2 flex items-center gap-1 bg-accent text-white px-2 py-1 rounded-full text-xs font-semibold hover:bg-secondary disabled:bg-gray-400">
                                 <SparklesIcon className="w-4 h-4" />
                                 {isGeneratingDesc ? 'Generating...' : 'Generate'}
                             </button>
                        </div>
                        <input type="text" placeholder="TDS URL" value={product.tds_url || ''} onChange={(e) => updateProduct(product.id, 'tds_url', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                        <input type="text" placeholder="SDS URL" value={product.sds_url || ''} onChange={(e) => updateProduct(product.id, 'sds_url', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                    </div>


                    <div className="md:col-span-2 pt-2">
                         <label className="block text-xs font-medium text-gray-600 mb-1">Layer Type (Ctrl/Cmd+Click for multiple)</label>
                         <select multiple value={product.layer_type} onChange={handleLayerTypeChange} className="w-full p-2 border border-gray-300 rounded-md text-sm h-24 capitalize">
                           {availableLayerTypes.map(type => (
                             <option key={type} value={type}>{type}</option>
                           ))}
                         </select>
                    </div>

                    <input type="number" name="price_per_unit" placeholder="Price per Unit" value={product.price_per_unit || ''} onChange={(e) => updateProduct(product.id, 'price_per_unit', e.target.value ? parseFloat(e.target.value) : undefined)} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                    <input type="number" name="packaging_size_L_or_kg" placeholder="Package Size (L/kg)" value={product.packaging_size_L_or_kg || ''} onChange={(e) => updateProduct(product.id, 'packaging_size_L_or_kg', e.target.value ? parseFloat(e.target.value) : undefined)} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                    <input type="number" name="voc_g_per_L" placeholder="VOC (g/L)" value={product.specs.voc_g_per_L || ''} onChange={handleSpecChange} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                    <input type="number" name="coverage_m2_per_L" placeholder="Coverage (m²/L)" value={product.specs.coverage_m2_per_L || ''} onChange={handleSpecChange} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                    <input type="number" name="cure_time_hours_at_23C" placeholder="Cure Time (hours)" value={product.specs.cure_time_hours_at_23C || ''} onChange={handleSpecChange} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                    <input type="text" name="temperature_range_C" placeholder="Temp Range °C (min, max)" value={product.specs.temperature_range_C?.join(', ') || ''} onChange={handleSpecChange} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                </div>
            )}
        </div>
    )
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, setProducts, availableLayerTypes, addLayerType }) => {
  const [newLayerType, setNewLayerType] = useState('');

  const handleAddLayerType = () => {
    addLayerType(newLayerType.trim().toLowerCase());
    setNewLayerType('');
  };

  const addProduct = () => {
    const newProduct: CandidateProduct = {
      id: `prod${Date.now()}`,
      manufacturer: '',
      product_name: '',
      layer_type: [],
      specs: {},
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: string, value: any) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        if (field.startsWith('specs.')) {
            const specField = field.split('.')[1];
            return { ...p, specs: { ...p.specs, [specField]: value } };
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Candidate Products</h2>
        <button onClick={addProduct} className="flex items-center gap-1 bg-accent text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-secondary">
          <PlusIcon className="w-5 h-5" /> Add Product
        </button>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Add New Layer Type</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newLayerType}
              onChange={(e) => setNewLayerType(e.target.value)}
              placeholder="e.g. Grout"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAddLayerType()}
            />
            <button onClick={handleAddLayerType} className="bg-gray-200 text-gray-700 px-3 rounded-md text-sm font-semibold hover:bg-gray-300">Add</button>
          </div>
      </div>
      <div className="space-y-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} updateProduct={updateProduct} removeProduct={removeProduct} availableLayerTypes={availableLayerTypes} />
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
