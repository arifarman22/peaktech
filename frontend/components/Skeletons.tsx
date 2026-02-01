'use client';

export function ProductSkeleton() {
    return (
        <div className="bg-white rounded-[40px] p-2 animate-pulse border border-zinc-50">
            <div className="w-full aspect-square bg-zinc-50 rounded-[38px] mb-6"></div>
            <div className="px-4 pb-6 space-y-4">
                <div className="h-4 bg-zinc-50 rounded-full w-1/3"></div>
                <div className="h-8 bg-zinc-50 rounded-2xl w-3/4"></div>
                <div className="h-10 bg-zinc-50 rounded-2xl w-full mt-4"></div>
            </div>
        </div>
    );
}

export function OrderSkeleton() {
    return (
        <div className="bg-white rounded-[48px] p-10 border border-zinc-50 animate-pulse mb-10">
            <div className="flex justify-between items-center mb-10 pb-8 border-b border-zinc-50">
                <div className="space-y-3">
                    <div className="h-6 bg-zinc-50 rounded-full w-48"></div>
                    <div className="h-3 bg-zinc-50 rounded-full w-32"></div>
                </div>
                <div className="w-24 h-10 bg-zinc-50 rounded-2xl"></div>
            </div>
            <div className="space-y-8">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-zinc-50 rounded-3xl"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-zinc-50 rounded-full w-1/2"></div>
                        <div className="h-3 bg-zinc-50 rounded-full w-1/4"></div>
                    </div>
                    <div className="w-24 h-6 bg-zinc-50 rounded-full"></div>
                </div>
            </div>
            <div className="mt-10 pt-8 border-t border-zinc-50 flex justify-between items-center">
                <div className="h-10 bg-zinc-50 rounded-2xl w-40"></div>
                <div className="h-12 bg-zinc-950/5 rounded-2xl w-32"></div>
            </div>
        </div>
    );
}
