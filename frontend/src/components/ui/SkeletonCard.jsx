import React from 'react';

const SkeletonCard = ({ className = '' }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`}>
    <div className="h-48 rounded-t-2xl bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-1/2 rounded-full bg-slate-200"></div>
      <div className="h-4 w-3/4 rounded-full bg-slate-200"></div>
      <div className="h-8 w-full rounded-full bg-slate-200"></div>
    </div>
  </div>
);

export default SkeletonCard;
