import React, { useState, useCallback } from 'react';
import { ProjectDetails, CandidateProduct, SystemRecommendation, SystemLayer, RecommendedProduct } from './types';
import { INITIAL_PROJECT_DETAILS, INITIAL_CANDIDATE_PRODUCTS, SYSTEM_PROMPT, DEFAULT_LAYER_TYPES } from './constants';
import { generateRecommendation } from './services/geminiService';
import ProjectForm from './components/ProjectForm';
import ProductManager from './components/ProductManager';
import RecommendationDisplay from './components/RecommendationDisplay';
import Header from './components/Header';
import { PlusIcon, SparklesIcon, XCircleIcon, SwitchHorizontalIcon } from './components/icons/Icons';
import ComparisonMatrix from './components/ComparisonMatrix';
import ProductDetailModal from './components/ProductDetailModal';


export default function App() {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>(INITIAL_PROJECT_DETAILS);
  const [candidateProducts, setCandidateProducts] = useState<CandidateProduct[]>(INITIAL_CANDIDATE_PRODUCTS);
  const [recommendation, setRecommendation] = useState<SystemRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'ai' | 'manual'>('ai');
  const [availableLayerTypes, setAvailableLayerTypes] = useState<string[]>(DEFAULT_LAYER_TYPES);
  const [editingLayer, setEditingLayer] = useState<{ layer: SystemLayer, index: number } | null>(null);


  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await generateRecommendation(SYSTEM_PROMPT, projectDetails, candidateProducts);
      setRecommendation(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [projectDetails, candidateProducts]);

  const resetForm = () => {
    setProjectDetails(INITIAL_PROJECT_DETAILS);
    setCandidateProducts(INITIAL_CANDIDATE_PRODUCTS);
    setRecommendation(null);
    setError(null);
  };
  
  const addLayerType = (newType: string) => {
    if (newType && !availableLayerTypes.includes(newType)) {
      setAvailableLayerTypes(prev => [...prev, newType]);
    }
  };

  const handleEditLayer = (layer: SystemLayer, index: number) => {
    setEditingLayer({ layer, index });
  };

  const handleUpdateLayer = (index: number, updatedLayer: SystemLayer) => {
    setRecommendation(prev => {
      if (!prev) return null;
      const newLayers = [...prev.layers];
      newLayers[index] = updatedLayer;
      return { ...prev, layers: newLayers };
    });
    setEditingLayer(null);
  };

  const handleSwapProduct = (layerIndex: number, alternativeProduct: RecommendedProduct) => {
    setRecommendation(prev => {
      if (!prev) return null;

      const newLayers = [...prev.layers];
      const targetLayer = { ...newLayers[layerIndex] };
      const currentRecommendedProduct = targetLayer.recommended_product;

      // Swap the product
      targetLayer.recommended_product = alternativeProduct;
      
      // Update alternatives list: remove the new product, add the old one
      const newAlternatives = targetLayer.alternatives.filter(
        alt => alt.product_name !== alternativeProduct.product_name
      );
      newAlternatives.push(currentRecommendedProduct);
      targetLayer.alternatives = newAlternatives;

      // Update reason to show user override
      targetLayer.reason_for_selection = `User selected alternative. Original reason: ${targetLayer.reason_for_selection}`;

      newLayers[layerIndex] = targetLayer;
      
      return { ...prev, layers: newLayers };
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <ProjectForm projectDetails={projectDetails} setProjectDetails={setProjectDetails} />
            <ProductManager 
              products={candidateProducts} 
              setProducts={setCandidateProducts}
              availableLayerTypes={availableLayerTypes}
              addLayerType={addLayerType}
            />
          </div>
          <div className="lg:sticky lg:top-8">
            <div className="flex justify-center mb-4 border border-gray-200 rounded-full p-1 bg-gray-100 max-w-sm mx-auto">
              <button 
                onClick={() => setViewMode('ai')} 
                className={`w-1/2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${viewMode === 'ai' ? 'bg-white shadow-md text-primary' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                <SparklesIcon className="w-5 h-5"/>
                AI Recommendation
              </button>
              <button 
                onClick={() => setViewMode('manual')} 
                className={`w-1/2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${viewMode === 'manual' ? 'bg-white shadow-md text-primary' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                <SwitchHorizontalIcon className="w-5 h-5"/>
                Manual Comparison
              </button>
            </div>
            
            {viewMode === 'ai' && (
              <>
                {isLoading && (
                  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
                    <SparklesIcon className="w-16 h-16 text-primary animate-pulse" />
                    <p className="mt-4 text-lg font-semibold text-gray-700">Generating Recommendation...</p>
                    <p className="mt-2 text-sm text-gray-500 text-center">Our materials expert is analyzing your project. This might take a moment.</p>
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-6">
                     <div className="flex items-center">
                        <XCircleIcon className="w-8 h-8 text-red-500 mr-4"/>
                        <div>
                            <h3 className="text-lg font-bold text-red-800">Error Generating Recommendation</h3>
                            <p className="mt-1 text-red-700">{error}</p>
                        </div>
                    </div>
                  </div>
                )}
                {recommendation && !isLoading && <RecommendationDisplay recommendation={recommendation} onEditLayer={handleEditLayer} onSwapProduct={handleSwapProduct} />}
              </>
            )}
            
            {viewMode === 'manual' && (
              <ComparisonMatrix products={candidateProducts} />
            )}
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 flex justify-center items-center gap-4 z-50">
          {viewMode === 'ai' && (
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-secondary transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <SparklesIcon className="w-6 h-6" />
              {isLoading ? 'Analyzing...' : 'Generate Recommendation'}
            </button>
          )}
           <button
            onClick={resetForm}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-full shadow-lg hover:bg-gray-300 transition-all duration-300 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </main>
      {editingLayer && (
        <ProductDetailModal 
          layerData={editingLayer}
          onClose={() => setEditingLayer(null)}
          onSave={handleUpdateLayer}
        />
      )}
    </div>
  );
}
