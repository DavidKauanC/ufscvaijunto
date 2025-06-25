// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
  
  // A URL da sua API do SheetDB (a mesma do formulário de 'oferecer.html')
  const sheetDBUrl = 'https://sheetdb.io/api/v1/njhrwhu3xo8rg';

  const caronasContainer = document.getElementById('caronas-container');
  const loadingMessage = document.getElementById('loading-message');

  // Função para buscar os dados da planilha
  fetch(sheetDBUrl)
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
      loadingMessage.style.display = 'none'; // Esconde a mensagem "Carregando..."

      // Verifica se retornou alguma carona
      if (data.length === 0) {
        caronasContainer.innerHTML = '<p>Nenhuma carona disponível no momento.</p>';
        return;
      }

      // Para cada carona encontrada, cria um card e exibe na tela
      data.forEach(carona => {
        const card = document.createElement('div');
        card.className = 'carona-card';

        // --- ALTERAÇÃO AQUI ---
        // Adicionamos um botão de copiar ao lado do contato.
        // Usamos um atributo `data-contact` para armazenar o valor a ser copiado.
        card.innerHTML = `
          <h3><i class="fa-solid fa-route"></i> De: ${carona.origem} Para: ${carona.destino}</h3>
          <p><i class="fa-solid fa-user-check"></i> <strong>Motorista:</strong> ${carona.nome}</p>
          <p><i class="fa-solid fa-calendar-days"></i> <strong>Data:</strong> ${new Date(carona.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
          <p><i class="fa-solid fa-clock"></i> <strong>Hora:</strong> ${carona.hora}</p>
          <p><i class="fa-solid fa-chair"></i> <strong>Vagas:</strong> ${carona.vagas}</p>
          <p>
            <i class="fa-solid fa-address-book"></i> <strong>Contato:</strong> ${carona.contato}
            <button class="copy-btn" data-contact="${carona.contato}">
              <i class="fa-solid fa-copy"></i> Copiar
            </button>
          </p>
        `;
        
        caronasContainer.appendChild(card);
      });
    })
    .catch(error => {
      // Em caso de erro na busca
      console.error('Erro ao buscar caronas:', error);
      loadingMessage.style.display = 'none';
      caronasContainer.innerHTML = '<p>Ocorreu um erro ao carregar as caronas. Tente novamente mais tarde.</p>';
    });

  // --- NOVA FUNCIONALIDADE AQUI ---
  // Adiciona um único "escutador de eventos" ao container principal.
  // Isso é mais eficiente do que adicionar um para cada botão. (Event Delegation)
  caronasContainer.addEventListener('click', function(event) {
    // Procura por um botão .copy-btn que tenha sido clicado
    const copyButton = event.target.closest('.copy-btn');

    if (copyButton) {
      const contactToCopy = copyButton.dataset.contact; // Pega o contato do atributo data-contact
      
      navigator.clipboard.writeText(contactToCopy).then(() => {
        // Sucesso! Muda a aparência do botão para dar feedback.
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        copyButton.classList.add('success');

        // Volta ao normal depois de 2 segundos
        setTimeout(() => {
          copyButton.innerHTML = originalText;
          copyButton.classList.remove('success');
        }, 2000);

      }).catch(err => {
        console.error('Falha ao copiar o texto: ', err);
        // Opcional: dar um feedback de erro ao usuário
        alert("Não foi possível copiar o contato.");
      });
    }
  });
});