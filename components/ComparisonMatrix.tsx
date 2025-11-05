
import React from 'react';
import { CandidateProduct } from '../types';

interface ComparisonMatrixProps {
  products: CandidateProduct[];
}

const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ products }) => {
  const formatValue = (value: any, unit: string = '') => {
    if (value === null || typeof value === 'undefined' || value === '') return <span className="text-gray-400">N/A</span>;
    if (Array.isArray(value)) return value.join(', ');
    return `${value}${unit}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Products Comparison Matrix</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 sticky left-0 bg-gray-100 z-10">Product Name</th>
              <th scope="col" className="px-4 py-3">Manufacturer</th>
              <th scope="col" className="px-4 py-3">Layer Type(s)</th>
              <th scope="col" className="px-4 py-3 text-right">Price</th>
              <th scope="col" className="px-4 py-3 text-right">Package Size</th>
              <th scope="col" className="px-4 py-3 text-right">VOC (g/L)</th>
              <th scope="col" className="px-4 py-3 text-right">Coverage (m²/L)</th>
              <th scope="col" className="px-4 py-3 text-right">Cure Time (h)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                <th scope="row" className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                  {product.product_name || <span className="text-gray-400">Unnamed Product</span>}
                </th>
                <td className="px-4 py-4">{formatValue(product.manufacturer)}</td>
                <td className="px-4 py-4 capitalize">{formatValue(product.layer_type)}</td>
                <td className="px-4 py-4 text-right">{formatValue(product.price_per_unit, ' $')}</td>
                <td className="px-4 py-4 text-right">{formatValue(product.packaging_size_L_or_kg, ' L/kg')}</td>
                <td className="px-4 py-4 text-right">{formatValue(product.specs.voc_g_per_L)}</td>
                <td className="px-4 py-4 text-right">{formatValue(product.specs.coverage_m2_per_L)}</td>
                <td className="px-4 py-4 text-right">{formatValue(product.specs.cure_time_hours_at_23C)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonMatrix;
