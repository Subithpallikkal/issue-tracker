import React from 'react';

interface AIAnalysisProps {
  analysis?: string;
  isAnalyzing: boolean;
  variant?: 'summary' | 'detailed';
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis, isAnalyzing, variant = 'summary' }) => {
  // Parsing the analysis string to extract Summary and Key Actions
  const parseSections = (text: string) => {
    if (!text) return null;
    
    // Split by numbered sections or common headers
    const sections = text.split(/\d\.\s|\*\*[^*]+\*\*/).filter(Boolean);

    const titlesSummary = ["Summary", "Key Actions"];
    const titlesDetailed = ["Comprehensive Summary", "Technical Deep Dive", "Action Plan", "Risk Assessment"];

    const titles = variant === 'detailed' ? titlesDetailed : titlesSummary;
    const sliceCount = variant === 'detailed' ? titlesDetailed.length : titlesSummary.length;

    return sections.slice(0, sliceCount).map((content, index) => {
      const trimmed = content.trim();
      const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
      // If the model returns a label on the first line (e.g. "Brief Summary"), remove it.
      const firstLine = lines.shift();
      const rest = lines.join('\n');

      return {
        title: titles[index] || `Section ${index + 1}`,
        content: rest || trimmed || firstLine || '',
      };
    });
  };

  const insights = parseSections(analysis || "");

  if (isAnalyzing) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-1/4"></div>
        <div className="h-20 bg-white/5 rounded w-full"></div>
        <div className="h-4 bg-white/5 rounded w-1/4"></div>
        <div className="h-20 bg-white/5 rounded w-full"></div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
      {insights && insights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, idx) => (
            <section key={idx} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-accent text-xs">✦</span>
                <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                  {insight.title}
                </h4>
              </div>
              <div className="bg-white/5 border border-border/50 p-4 rounded-xl text-sm text-text-muted leading-relaxed font-medium">
                {insight.content}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-accent text-xs">✦</span>
            <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">AI Analysis</h4>
          </div>
          <p className="bg-white/5 border border-border/50 p-4 rounded-xl text-sm text-text-muted leading-relaxed font-medium whitespace-pre-wrap">
            {analysis}
          </p>
        </section>
      )}
    </div>
  );
};

export default AIAnalysis;
