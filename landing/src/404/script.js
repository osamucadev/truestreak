// ========================================
// BOTÃO VOLTAR
// ========================================
const btnBack = document.getElementById("btn-back");

if (btnBack) {
  btnBack.addEventListener("click", () => {
    // Verifica se tem histórico para voltar
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Se não tem histórico, vai para home
      window.location.href = "/";
    }
  });
}

// ========================================
// LOG DE INICIALIZAÇÃO
// ========================================
console.log("🧭 TrueStreak 404 - Você se desviou do caminho");
console.log("💜 Sem problemas! Recalcular rota é parte da jornada");
