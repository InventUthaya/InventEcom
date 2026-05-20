import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderDetail {
    Id?: number;
    OrderId?: number;
    SkuId?: number;
    ProductId?: number;
    Quantity?: number;
    UnitPrice?: number;
    TotalPrice?: number;
    TaxRate?: number;
    TaxAmount?: number;
    IsFreeItem?: boolean;
    Created?: string;
    Modified?: string;
}

interface ProductDetail {
    ProductId?: number;
    ProductName?: string;
    Description?: string;
    RamSize?: string;
    BasePrice?: number;
    DiscountPrice?: number;
}

interface ProductsProps {
    orderDetails: OrderDetail[];
    productDetails: ProductDetail[];
    getProductDetail: (productId?: number) => ProductDetail;
    formatCurrency: (amount?: number) => string;
}

const Products: React.FC<ProductsProps> = ({ orderDetails, productDetails, getProductDetail, formatCurrency }) => {
    const navigate = useNavigate();
    const calculateTotal = (basePrice: number | undefined, discount: number | undefined) => {
        const price = basePrice ?? 0;
        const disc = discount ?? 0;
        return price - disc;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                {/* <button onClick={() => navigate('/product-form')} className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    <Plus className="h-4 w-4 mr-1" />
                    Add product
                </button> */}
            </div>

            <div className="block md:hidden space-y-4">
                {orderDetails.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center">No products</div>
                ) : (
                    orderDetails.map((detail) => {
                        const product = getProductDetail(detail.ProductId);
                        return (
                            <div key={detail.Id} className="border border-gray-200 rounded-lg p-4">
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <div className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium">
                                            {product.ProductName ?? '-'}
                                        </div>
                                        <div className="text-gray-700">{product.Description ?? '-'}</div>
                                        <div className="text-gray-500">Size{product.RamSize ?? '-'}</div>
                                    </div>
                                    <div><span className="font-medium text-gray-500">Price:</span> {formatCurrency(product.BasePrice)}</div>
                                    <div><span className="font-medium text-gray-500">Quantity:</span> {detail.Quantity ?? '-'}</div>
                                    <div><span className="font-medium text-gray-500">Discount:</span> {formatCurrency(product.DiscountPrice)}</div>
                                    <div><span className="font-medium text-gray-500">Total:</span> {formatCurrency(calculateTotal(product.BasePrice, product.DiscountPrice))}</div>
                                    <div className="flex justify-end space-x-2">
                                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                                            Create return
                                        </button>
                                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors">
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </button>
                                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product name
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Discount
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orderDetails.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 sm:px-6 py-4 text-sm text-gray-500 text-center">
                                    No products
                                </td>
                            </tr>
                        ) : (
                            orderDetails.map((detail) => {
                                const product = getProductDetail(detail.ProductId);
                                return (
                                    <tr key={detail.Id}>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium">
                                                    {product.ProductName ?? '-'}
                                                </div>
                                                <div className="text-sm text-gray-700 mt-1">
                                                    {product.Description ?? '-'}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    Size: {product.RamSize ?? '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(product.BasePrice)}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {detail.Quantity ?? '-'}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(product.DiscountPrice)}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(calculateTotal(product.BasePrice, product.DiscountPrice))}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;