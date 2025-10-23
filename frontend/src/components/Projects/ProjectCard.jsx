import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowRightIcon
} from "lucide-react";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project._id}/timeline`);
  };

  const formatPhone = (phone) => {
    if (phone && phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gray-800 hover:bg-gray-700 transition-all rounded-xl p-5 shadow-md cursor-pointer group border-2 border-gray-700 hover:border-gray-600"
    >
      {/* Header with Home Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
          <HomeIcon className="text-blue-400 w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold truncate text-white">{project.projectName}</h2>
      </div>

      {/* Client Information with Icons */}
      <div className="space-y-3 text-sm text-gray-300">
        <div className="flex items-center gap-3">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <span>{project.clientName}</span>
        </div>

        <div className="flex items-center gap-3">
          <MailIcon className="w-4 h-4 text-gray-400" />
          <span className="truncate">{project.clientEmail}</span>
        </div>

        <div className="flex items-center gap-3">
          <PhoneIcon className="w-4 h-4 text-gray-400" />
          <span>{project.clientPhone}</span>
        </div>

        <div className="flex items-center gap-3">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span>{new Date(project.startDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <p className="text-xs text-blue-400 group-hover:text-blue-300">
            Click to view timeline
          </p>
          <ArrowRightIcon className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;