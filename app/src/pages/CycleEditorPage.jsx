import { useNavigate, useLocation } from "react-router-dom";
import { useCycles } from "../hooks/useCycles";
import CycleEditor from "../components/CycleEditor";

const CycleEditorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeCycle, loading } = useCycles();

  const isEditMode = location.pathname.includes("/edit");

  const handleSave = () => {
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Se estiver em modo edição mas não tiver ciclo ativo, redirecionar
  if (isEditMode && !activeCycle) {
    navigate("/");
    return null;
  }

  return (
    <CycleEditor
      cycleToEdit={isEditMode ? activeCycle : null}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default CycleEditorPage;
