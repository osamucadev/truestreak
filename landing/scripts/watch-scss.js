const chokidar = require("chokidar");
const { execSync } = require("child_process");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src");

console.log("👀 Assistindo mudanças em SCSS...\n");

const watcher = chokidar.watch(`${srcDir}/**/styles.scss`, {
  ignored: /node_modules/,
  persistent: true,
  usePolling: true,
  interval: 100,
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 100,
  },
});

// Variável para debounce
let rebuildTimeout;

function rebuild(filePath, action) {
  // Limpa timeout anterior
  clearTimeout(rebuildTimeout);

  // Aguarda 200ms após a última mudança para rebuildar
  rebuildTimeout = setTimeout(() => {
    const relativePath = path.relative(srcDir, filePath);
    console.log(`${action} ${relativePath}`);

    try {
      execSync("node scripts/build-scss.js", { stdio: "inherit" });
    } catch (error) {
      console.error("❌ Erro ao compilar SCSS");
    }
  }, 200);
}

watcher
  .on("change", (filePath) => rebuild(filePath, "🔄"))
  .on("add", (filePath) => rebuild(filePath, "✨"));
