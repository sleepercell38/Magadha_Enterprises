import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, createProject } from "../redux/Project/projectSlice";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/Projects/ProjectCard";
import CreateProjectModal from "../components/Projects/CreateProjectModal";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon
} from "lucide-react";

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.project);
  const { token, admin } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    dispatch(fetchProjects(token));
  }, [dispatch, token]);

  const handleCreate = (projectData) => {
    dispatch(createProject({ token, projectData })).then(() => {
      setIsModalOpen(false);
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex justify-between items-center">

        <h1 className="text-3xl font-bold flex justify-center items-center gap-3"
        >
          My Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all"
        >
          + Create Project
        </button>
      </div>

      {/* Project Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-300">Loading projects...</p>
        ) : error ? (
          <p className="col-span-full text-center text-red-500">{error}</p>
        ) : projects.length === 0 ? (
          <p className="col-span-full text-center text-gray-400">
            No projects yet. Click “Create Project” to start!
          </p>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <CreateProjectModal onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />
      )}
    </div>
  );
};

export default Projects;
