import { useEffect, useState } from 'react';

interface QuirkyLoaderProps {
  className?: string;
  onComplete?: () => void;
}

export function QuirkyLoader({ className = "", onComplete }: QuirkyLoaderProps) {
  const [lines, setLines] = useState<Array<{ id: number; width: number; delay: number }>>([]);
  const [currentEmoji, setCurrentEmoji] = useState('🎬');
  const [currentMessage, setCurrentMessage] = useState('Finding your perfect content...');

  useEffect(() => {
    const generateLines = () => {
      const newLines = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        width: Math.random() * 70 + 15, // Random width between 15-85%
        delay: Math.random() * 2.5, // Random delay between 0-2.5s
      }));
      setLines(newLines);
    };

    const messages = [
      'Finding your perfect content...',
      'Searching across all platforms...',
      'Checking availability...',
      'Looking for the best deals...',
      'Finding similar content...',
      'Checking streaming services...',
      'Searching for recommendations...',
      'Looking up movie details...',
      'Finding where to watch...',
      'Checking rental options...',
      'Searching for subscriptions...',
      'Looking for free content...'
    ];

    const emojis = ['🎬', '📺', '🎭', '🎪', '🎨', '🎯', '🎲', '🎮', '🎧', '🎤', '🎹', '🎸', '🎻', '🎺', '🥁', '🎵', '🎶', '🎼', '🎹', '🎸'];

    let messageIndex = 0;
    let emojiIndex = 0;

    generateLines();
    
    const messageInterval = setInterval(() => {
      setCurrentMessage(messages[messageIndex % messages.length]);
      setCurrentEmoji(emojis[emojiIndex % emojis.length]);
      messageIndex++;
      emojiIndex++;
    }, 800);

    const lineInterval = setInterval(generateLines, 2500); // Regenerate every 2.5 seconds

    // Show loader for 5 seconds
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 5000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(lineInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className={`flex flex-col items-center justify-center py-10 space-y-3 ${className}`}>
      <div className="text-sm text-muted-foreground mb-4">{currentMessage}</div>
      <div className="w-80 space-y-1.5">
        {lines.map((line) => (
          <div
            key={line.id}
            className="h-1.5 bg-gradient-to-r from-primary/30 to-primary/60 rounded-full animate-pulse"
            style={{
              width: `${line.width}%`,
              animationDelay: `${line.delay}s`,
              animationDuration: '1.8s',
            }}
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground mt-4">
        {currentEmoji} Searching across all platforms...
      </div>
    </div>
  );
} 