export default function CardLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-4 border rounded-lg animate-pulse">
          <div className="h-6 bg-muted rounded mb-2" />
          <div className="h-8 bg-muted rounded mb-2" />
          <div className="h-4 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
