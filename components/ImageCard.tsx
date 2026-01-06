
import React from 'react';
import { ProcessingItem } from '../types';
import { CheckCircle2, AlertCircle, Loader2, Folder } from 'lucide-react';

interface ImageCardProps {
  item: ProcessingItem;
}

const ImageCard: React.FC<ImageCardProps> = ({ item }) => {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg group hover:border-indigo-500/50 transition-all flex flex-col">
      <div className="relative aspect-square bg-slate-900 flex items-center justify-center overflow-hidden">
        {item.resultUrl ? (
          <img src={item.resultUrl} alt="Result" className="object-cover w-full h-full" />
        ) : (
          <img src={item.originalUrl} alt="Original" className="object-cover w-full h-full opacity-60 group-hover:scale-110 transition-transform duration-700" />
        )}
        
        {item.status === 'processing' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
            <span className="text-xs font-medium text-slate-300">Processing...</span>
          </div>
        )}

        {item.status === 'completed' && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 bg-white rounded-full shadow-md" />
          </div>
        )}

        {item.status === 'error' && (
          <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center p-2 text-center">
             <div className="flex flex-col items-center gap-1">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <span className="text-[10px] text-red-200 font-bold uppercase tracking-tighter">Failed</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-700 bg-slate-800/80 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-slate-200 truncate font-semibold mb-1">{item.file.name}</p>
          {item.relativePath && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <Folder className="w-2.5 h-2.5" />
              <span className="truncate">{item.relativePath}</span>
            </div>
          )}
        </div>
        {item.error && <p className="text-[10px] text-red-400 mt-2 line-clamp-2">{item.error}</p>}
      </div>
    </div>
  );
};

export default ImageCard;
