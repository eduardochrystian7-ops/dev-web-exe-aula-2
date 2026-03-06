// =========================================================
// LÓGICA DO TEMA (CLARO / ESCURO)
// =========================================================
const btnTheme = document.getElementById('btn-theme');
const body = document.body;

if (btnTheme) {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'dark') {
        body.classList.add('dark-theme');
        btnTheme.textContent = '☀️';
    }

    btnTheme.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            btnTheme.textContent = '☀️';
            localStorage.setItem('tema', 'dark');
        } else {
            btnTheme.textContent = '🌙';
            localStorage.setItem('tema', 'light');
        }
    });
}

// =========================================================
// LÓGICA DE REQUISIÇÕES HTTP (API JSONPlaceholder)
// =========================================================
const API_URL = 'https://jsonplaceholder.typicode.com';

// --- Função: Carregar Usuários (Requisição GET) ---
async function carregarUsuarios() {
  const startTime = Date.now();
  const loading = document.getElementById('loading');
  const container = document.getElementById('usuarios-container');
  
  try {
    // 1. Mostrar loading e limpar conteúdo anterior
    loading.style.display = 'block'; 
    container.innerHTML = '';
    
    // 2. Fazer requisição GET
    const url = `${API_URL}/users`;
    const response = await fetch(url);
    
    // 3. Processar resposta transformando em JSON
    const data = await response.json();
    
    // 4. Exibir usuários se a requisição deu certo
    if (response.ok) {
        // Mapeia os dados da API para criar o HTML visual
        const htmlUsuarios = data.map(user => `
            <div style="padding: 12px; margin-top: 10px; border: 1px solid var(--border-color); border-radius: 8px; background-color: var(--input-bg);">
                <strong>${user.name}</strong> (${user.email})<br>
                <small style="color: var(--text-muted)">🏢 Empresa: ${user.company.name}</small>
            </div>
        `).join('');
        container.innerHTML = htmlUsuarios;
    } else {
        throw new Error('Falha ao buscar usuários na API');
    }

    // 5. Atualizar painel de informações da requisição
    const tempo = Date.now() - startTime;
    atualizarInfo('GET', url, response.status, tempo);
    
  } catch (error) {
    container.innerHTML = `<p style="color: #ef4444; margin-top: 10px;">❌ Erro: ${error.message}</p>`;
  } finally {
    // Esconder o texto de "Carregando..." no final, dando erro ou não
    loading.style.display = 'none';
  }
}


// --- Função: Criar Novo Post (Requisição POST) ---
async function criarPost(event) {
  event.preventDefault(); // Evita que a página recarregue ao clicar em enviar
  const startTime = Date.now();
  
  // Pegando os valores digitados no HTML
  const titulo = document.getElementById('titulo').value;
  const conteudo = document.getElementById('conteudo').value;
  const resultado = document.getElementById('post-resultado');
  
  try {
    resultado.innerHTML = '<p style="color: var(--text-muted); margin-top: 15px;">⏳ Enviando post...</p>';

    // 1. Configurar e enviar dados (POST)
    const url = `${API_URL}/posts`;
    const response = await fetch(url, {
        method: 'POST', // Informamos que estamos enviando dados
        body: JSON.stringify({
            title: titulo,
            body: conteudo,
            userId: 1, // ID fictício necessário para essa API específica
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8', // Avisa o servidor que estamos mandando um JSON
        },
    });
    
    // 2. Processar resposta
    const data = await response.json();
    
    // 3. Exibir confirmação
    if (response.ok) {
        resultado.innerHTML = `
            <div style="margin-top: 15px; padding: 15px; background-color: #dcfce7; color: #166534; border-radius: 8px; border: 1px solid #bbf7d0;">
                 Post criado com sucesso! (ID gerado pelo servidor: <strong>${data.id}</strong>)
            </div>
        `;
    } else {
        throw new Error('Falha ao enviar o post');
    }
    
    // 4. Limpar formulário para o usuário poder digitar de novo
    document.getElementById('form-post').reset();
    
    // 5. Atualizar painel de informações da requisição
    const tempo = Date.now() - startTime;
    atualizarInfo('POST', url, response.status, tempo);
    
  } catch (error) {
    resultado.innerHTML = `<p style="color: #ef4444; margin-top: 15px;"> Erro: ${error.message}</p>`;
    console.error('Erro detalhado:', error);
  }
}


// --- Função Auxiliar: Atualizar painel inferior ---
function atualizarInfo(metodo, url, status, tempo) {
  document.getElementById('info-metodo').textContent = metodo;
  document.getElementById('info-url').textContent = url;
  
  // Destacar o status em verde (sucesso 200) ou vermelho (erro)
  const statusEl = document.getElementById('info-status');
  statusEl.textContent = status;
  statusEl.style.color = (status >= 200 && status < 300) ? '#22c55e' : '#ef4444';
  statusEl.style.fontWeight = 'bold';

  document.getElementById('info-tempo').textContent = `${tempo} ms`;
}

// =========================================================
// EVENT LISTENERS (Ligando os botões às funções)
// =========================================================
document.getElementById('btn-carregar').addEventListener('click', carregarUsuarios);
document.getElementById('form-post').addEventListener('submit', criarPost);