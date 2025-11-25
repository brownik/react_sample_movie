import './Skeleton.css';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={`skeleton skeleton-${variant} skeleton-${animation} ${className}`}
      style={style}
    />
  );
}

// 영화 카드용 스켈레톤
export function MovieCardSkeleton() {
  return (
    <div className="movie-card-skeleton">
      <Skeleton variant="rectangular" className="skeleton-poster" />
      <div className="skeleton-content">
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
  );
}

// 영화 리스트용 스켈레톤
export function MovieListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="movie-list-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

// 영화 상세 페이지용 스켈레톤
export function MovieDetailSkeleton() {
  return (
    <div className="movie-detail-skeleton">
      <Skeleton variant="rectangular" width={300} height={450} className="skeleton-poster-large" />
      <div className="skeleton-detail-content">
        <Skeleton variant="text" width="70%" height={40} />
        <div className="skeleton-meta">
          <Skeleton variant="text" width={80} height={24} />
          <Skeleton variant="text" width={60} height={24} />
          <Skeleton variant="text" width={100} height={24} />
        </div>
        <Skeleton variant="text" width="50%" height={32} />
        <Skeleton variant="text" width="100%" height={120} />
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="70%" height={24} />
      </div>
    </div>
  );
}

