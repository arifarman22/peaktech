'use client';

export function ProductSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm animate-pulse border border-gray-100">
            <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-6"></div>
            <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-100 rounded-full w-1/2 mb-6"></div>
            <div className="h-8 bg-gray-100 rounded-xl w-1/3"></div>
        </div>
    );
}

export function OrderSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 animate-pulse mb-6">
            <div className="flex justify-between mb-8">
                <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded-full w-24"></div>
                    <div className="h-5 bg-gray-100 rounded-full w-40"></div>
                </div>
                <div className="w-16 h-16 bg-gray-100 rounded-2xl"></div>
            </div>
            <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                <div className="h-4 bg-gray-100 rounded-full w-5/6"></div>
            </div>
        </div>
    );
}
