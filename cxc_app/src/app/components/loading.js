export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-300">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.6s" }}></div>
        </div>
      </div>
    );
  }