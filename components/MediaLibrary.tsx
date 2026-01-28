
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { MediaAsset } from '../types';

const MediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  useEffect(() => {
    const loadMedia = async () => {
      const data = await db.getMedia();
      setAssets(data);
    };
    loadMedia();
  }, []);

  const handleDownload = async (asset: MediaAsset) => {
    await db.incrementMediaDownload(asset.id);
    const updated = await db.getMedia();
    setAssets(updated);
    
    // Simulate professional file download
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = `${asset.title.replace(/\s/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black font-poppins text-gray-900 mb-4 tracking-tighter">RESOURCE <span className="text-red-600">HUB</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Download official TVK media assets, posters, and wallpapers to support our campaign across social platforms.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.map((asset) => (
            <div key={asset.id} className="group bg-gray-50 rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="h-64 relative overflow-hidden bg-gray-200">
                <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {asset.type}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{asset.title}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{asset.downloadCount.toLocaleString()} TOTAL DOWNLOADS</p>
                <button 
                  onClick={() => handleDownload(asset)}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  DOWNLOAD ASSET
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;
