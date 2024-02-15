import { useState } from "react";
import DefaultScreen from "./components/DefaultScreen";
import NewProject from "./components/NewProject";
import ProjectsSidebar from "./components/ProjectsSidebar";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectProject: undefined,
    projects: []
  });

  function handleProjectState() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  function handleAddProject(project) {
    setProjectsState((prevState) => {
      const newProject = {
        ...project,
        id: Math.random()
      };

      return {
        ...prevState,
        projects: [...prevState.projects, newProject],
      }
    })
  }

  console.log(projectsState);
  
  let content;

  if (projectsState.selectedProjectId === undefined)
    content = <DefaultScreen onClickAddProject={handleProjectState} />;
  else if (projectsState.selectedProjectId === null)
    content = <NewProject onAddNewProject={handleAddProject} />

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSidebar onClickAddProject={handleProjectState} />
      {content}
    </main>
  );
}

export default App;
