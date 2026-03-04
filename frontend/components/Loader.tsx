export default function Loader() {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] z-[9999] flex items-center justify-center">
            <div className="text-center">
                <div className="mb-8 animate-pulse">
                    <img src="/logo.png?v=1" alt="PeakTech" className="h-20 w-auto mx-auto brightness-0 invert" />
                </div>
                <div className="flex gap-2 justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
