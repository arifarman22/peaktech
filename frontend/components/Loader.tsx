export default function Loader() {
    return (
        <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
            <div className="text-center">
                <div className="mb-6">
                    <img src="/logo.png?v=1" alt="PeakTech" className="h-16 w-auto mx-auto animate-pulse" />
                </div>
                <div className="flex gap-2 justify-center">
                    <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
