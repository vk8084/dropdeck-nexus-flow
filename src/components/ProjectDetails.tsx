
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProjectDetailsProps {
  project: {
    name: string;
    description: string;
    tge: string;
    funding: string;
    reward: string;
    type: string;
    testnetUrl?: string;
    isFavorite: boolean;
  };
  onToggleFavorite: () => void;
  onJoin: () => void;
}

const ProjectDetails = ({ project, onToggleFavorite, onJoin }: ProjectDetailsProps) => {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <img
          src={`/logos/${project.name.toLowerCase()}.jpg`}
          alt={`${project.name} logo`}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleFavorite}
          className="ml-auto"
        >
          {project.isFavorite ? "😍" : "🤍"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
          <p className="font-semibold">TGE</p>
          <p>{project.tge}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
          <p className="font-semibold">Funding</p>
          <p>{project.funding}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
          <p className="font-semibold">Reward</p>
          <p>{project.reward}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
          <p className="font-semibold">Type</p>
          <p>{project.type}</p>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button onClick={onJoin} className="flex-1">
          Join Project
        </Button>
        {project.testnetUrl && (
          <Button variant="outline" onClick={() => window.open(project.testnetUrl, '_blank')} className="flex-1">
            Open Testnet
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
