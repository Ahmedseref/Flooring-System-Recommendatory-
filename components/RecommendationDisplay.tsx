import React, { useState } from 'react';
import { SystemRecommendation, SystemLayer, RecommendedProduct } from '../types';
import { CheckCircleIcon, ShieldCheckIcon, CurrencyDollarIcon, ClockIcon, BeakerIcon, ExclamationTriangleIcon, PencilIcon, ArrowPathIcon } from './icons/Icons';

const LayerCard: React.FC<{ 
    layer: SystemLayer, 
    onEdit: () => void,
    onSwap: (product: RecommendedProduct) => void 
}> = ({ layer, onEdit, onSwap }) => {
    const [showAlternatives, setShowAlternatives] = useState(false);
    
    const hasAlternatives = layer.alternatives && layer.alternatives.length > 0;

    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start">
                 <h4 className="text-lg font-bold text-primary capitalize">{layer.role}</h4>
                 <div 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={onEdit}
                    title="Edit Layer Details"
                >
                    <PencilIcon className="w-5 h-5 text-primary"/>
                </div>
            </div>
            
            <div className="mt-2 mb-3">
                <p className="font-semibold text-gray-800">{layer.recommended_product.manufacturer} - {layer.recommended_product.product_name}</p>
                <p className="text-xs text-gray-500">Stock: {layer.recommended_product.stock_availability}</p>
            </div>
            
            <p className="text-sm text-gray-600 mb-3"><span className="font-semibold">Reason:</span> {layer.reason_for_selection}</p>
            
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p><span className="font-semibold">Coats:</span> {layer.application_recommendation.recommended_number_of_coats}</p>
                <p><span className="font-semibold">Thickness:</span> {layer.application_recommendation.recommended_film_thickness_micron} microns</p>
                <p><span className="font-semibold">Equipment:</span> {layer.application_recommendation.equipment}</p>
            </div>
            {layer.compatibility_notes && (
                <div className="mt-3 flex items-start text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md">
                    <ExclamationTriangleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p><span className="font-semibold">Note:</span> {layer.compatibility_notes}</p>
                </div>
            )}
            {hasAlternatives && (
                <div className="mt-4">
                    <button onClick={() => setShowAlternatives(!showAlternatives)} className="text-sm font-semibold text-primary hover:underline">
                        {showAlternatives ? 'Hide Alternatives' : `View ${layer.alternatives.length} Alternative(s)`}
                    </button>
                    {showAlternatives && (
                        <div className="mt-3 space-y-2 animate-fade-in bg-gray-50 p-3 rounded-md border">
                            {layer.alternatives.map((alt, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">{alt.manufacturer} - {alt.product_name}</p>
                                        <p className="text-xs text-gray-500">Stock: {alt.stock_availability}</p>
                                    </div>
                                    <button onClick={() => { onSwap(alt); setShowAlternatives(false); }} title="Use this product" className="flex items-center gap-1 bg-accent text-white px-2 py-1 rounded-full text-xs font-semibold hover:bg-secondary">
                                        <ArrowPathIcon className="w-4 h-4"/>
                                        Swap
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ScoreCircle: React.FC<{ label: string; score: number, icon: React.ReactNode }> = ({ label, score, icon }) => {
    const getScoreColor = (s: number) => {
        if (s > 80) return 'text-green-500';
        if (s > 60) return 'text-yellow-500';
        return 'text-red-500';
    };
    return (
        <div className="flex flex-col items-center text-center">
            <div className={`relative w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 border-2 ${getScoreColor(score).replace('text', 'border')}`}>
                <div className="absolute opacity-20">{icon}</div>
                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>
            <p className="text-sm font-semibold mt-2 text-gray-600">{label}</p>
        </div>
    );
}

const RecommendationDisplay: React.FC<{ 
    recommendation: SystemRecommendation; 
    onEditLayer: (layer: SystemLayer, index: number) => void;
    onSwapProduct: (layerIndex: number, product: RecommendedProduct) => void;
}> = ({ recommendation, onEditLayer, onSwapProduct }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{recommendation.system_name}</h2>
        <div className={`inline-flex items-center gap-2 mb-4 p-1 px-3 rounded-full text-sm font-semibold ${recommendation.confidence_score > 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <ShieldCheckIcon className="w-5 h-5" />
            Confidence Score: {recommendation.confidence_score}/100
        </div>
      
        <p className="text-gray-600 mb-6">{recommendation.summary}</p>
        
        <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-700 mb-3">Recommended Layers</h3>
            <div className="space-y-4">
                {recommendation.layers.map((layer, index) => (
                    <LayerCard key={`${layer.recommended_product.product_code}-${index}`} layer={layer} onEdit={() => onEditLayer(layer, index)} onSwap={(product) => onSwapProduct(index, product)} />
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <ScoreCircle label="Durability" score={recommendation.performance_scores.durability} icon={<ShieldCheckIcon className="w-10 h-10"/>} />
            <ScoreCircle label="Cost Efficiency" score={recommendation.performance_scores.cost_efficiency} icon={<CurrencyDollarIcon className="w-10 h-10"/>} />
            <ScoreCircle label="Application" score={recommendation.performance_scores.ease_of_application} icon={<ClockIcon className="w-10 h-10"/>} />
            <ScoreCircle label="Environmental" score={recommendation.performance_scores.environmental} icon={<BeakerIcon className="w-10 h-10"/>} />
        </div>

        <div>
            <h3 className="text-xl font-bold text-gray-700 mb-3">Cost Estimation</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flow-root">
                     <ul role="list" className="divide-y divide-blue-200">
                        {recommendation.estimated_consumption.per_product.map((item, idx) => (
                             <li key={idx} className="py-2 flex justify-between items-center text-sm">
                                <p className="font-medium text-blue-900">{item.product_name}</p>
                                <p className="text-blue-800">{item.units_needed} units ({item.total_qty})</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200 flex justify-between items-center">
                    <p className="font-semibold text-blue-900">Total Material Cost</p>
                    <p className="font-bold text-xl text-blue-900">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: recommendation.estimated_consumption.currency || 'USD' }).format(recommendation.estimated_consumption.total_material_cost)}
                    </p>
                </div>
            </div>
        </div>
        
    </div>
  );
};

export default RecommendationDisplay;
