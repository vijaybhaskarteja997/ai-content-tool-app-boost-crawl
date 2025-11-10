import React from 'react';
import { HistoryEntry, Platform } from '../types';
import { PlatformIcon } from './Icons';

interface ScheduleViewProps {
  history: HistoryEntry[];
  onReload: (entry: HistoryEntry) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ history, onReload }) => {
  const scheduledPosts = history
    .filter((entry): entry is Extract<HistoryEntry, { type: 'social' }> => 
      entry.type === 'social' && !!entry.inputs.schedule.date
    )
    .sort((a, b) => new Date(a.inputs.schedule.date!).getTime() - new Date(b.inputs.schedule.date!).getTime());

  const now = new Date();
  const upcomingPosts = scheduledPosts.filter(p => new Date(p.inputs.schedule.date!) >= now);
  const pastPosts = scheduledPosts.filter(p => new Date(p.inputs.schedule.date!) < now).reverse();

  const PostItem: React.FC<{ post: Extract<HistoryEntry, { type: 'social' }> }> = ({ post }) => (
    <div className="bg-base-300/50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-2">
          {Object.keys(post.outputs).map(p => <PlatformIcon key={p} platform={p as Platform} className="w-5 h-5" />)}
          <p className="font-semibold text-white truncate">{post.inputs.idea}</p>
        </div>
        <p className="text-sm text-base-content">
          <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
            post.inputs.schedule.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-300' :
            post.inputs.schedule.status === 'Published' ? 'bg-green-500/20 text-green-300' :
            'bg-gray-500/20 text-gray-300'
          }`}>
            {post.inputs.schedule.status}
          </span>
          {post.inputs.schedule.date &&
            <span className="ml-2">{new Date(post.inputs.schedule.date).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          }
        </p>
      </div>
      <button 
        onClick={() => onReload(post)}
        className="px-4 py-2 text-sm font-semibold rounded-full bg-brand-secondary hover:bg-brand-dark transition-colors text-white w-full sm:w-auto"
      >
        View & Edit
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Upcoming Posts</h2>
        {upcomingPosts.length > 0 ? (
          <div className="space-y-4">
            {upcomingPosts.map(post => <PostItem key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-10 bg-base-200 rounded-xl">
            <p className="text-base-content/70">You have no upcoming scheduled posts.</p>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Past Posts</h2>
        {pastPosts.length > 0 ? (
          <div className="space-y-4">
            {pastPosts.map(post => <PostItem key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-10 bg-base-200 rounded-xl">
            <p className="text-base-content/70">You have no past scheduled posts.</p>
          </div>
        )}
      </div>
    </div>
  );
};
