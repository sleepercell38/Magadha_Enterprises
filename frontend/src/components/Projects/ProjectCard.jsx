import React from "react";
import { FolderIcon } from "lucide-react";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-gray-800 hover:bg-gray-700 transition-all rounded-xl p-5 shadow-md cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500/20 p-3 rounded-lg">
          <FolderIcon className="text-yellow-400 w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold truncate">{project.projectName}</h2>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>👤 {project.clientName}</p>
        <p>📧 {project.clientEmail}</p>
        <p>📞 {project.clientPhone}</p>
        <p>📅 {new Date(project.startDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
