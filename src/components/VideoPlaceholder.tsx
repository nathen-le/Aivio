import React from 'react';
import { Play } from 'lucide-react';
import type { LessonVideo } from '../types/lesson';

interface VideoPlaceholderProps {
  video: LessonVideo;
}

/** Video slot for a lesson. Shows a placeholder until `video.src` is set. */
export const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({ video }) => {
  if (video.src) {
    return (
      <div className="rounded-3xl overflow-hidden bg-[#2B1B1A] border border-[#E8DCCB]">
        <video controls src={video.src} className="w-full aspect-video bg-black" aria-label={video.title} />
        <div className="px-4 py-3 bg-[#FFFDF9]">
          <p className="text-sm font-black text-[#2B1B1A]">{video.title}</p>
          <p className="text-xs text-[#857670]">{video.durationMinutes} min</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden bg-[#FFFDF9] border border-[#E8DCCB]">
      <div className="relative aspect-video bg-gradient-to-br from-[#FBE3E0] via-[#FBE9A6] to-[#EEF3E3] flex items-center justify-center">
        <span className="w-14 h-14 rounded-full bg-[#5C1F2A] text-[#FFF8EE] flex items-center justify-center shadow-lg" aria-hidden="true">
          <Play className="w-6 h-6 fill-[#FFF8EE] ml-0.5" />
        </span>
        <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFFDF9]/90 text-[#7A2B37]">
          Video coming soon
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-black text-[#2B1B1A]">{video.title}</p>
        <p className="text-xs text-[#857670]">{video.durationMinutes} min · placeholder</p>
      </div>
    </div>
  );
};
