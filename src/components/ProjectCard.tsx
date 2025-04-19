
import React from 'react';
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  name: string;
  description: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  testnetUrl?: string;
}

const ProjectCard = ({ name, description, isFavorite, onToggleFavorite, testnetUrl }: ProjectCardProps) => {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={`/logos/${name.toLowerCase()}.jpg`} 
          alt={`${name} logo`}
          className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 text-xl"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "😍" : "🤍"}
        </Button>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button variant="default" onClick={() => window.location.href = '#/project/' + name.toLowerCase()}>
          Details
        </Button>
        {testnetUrl && (
          <Button variant="outline" onClick={() => window.open(testnetUrl, '_blank')}>
            Open Testnet
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
