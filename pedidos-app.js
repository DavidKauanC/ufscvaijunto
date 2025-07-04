// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
  

  const sheetDBUrl = 'https://sheetdb.io/api/v1/njhrwhu3xo8rg?sheet=pedidos';

  const pedidosContainer = document.getElementById('pedidos-container');
  const loadingMessage = document.getElementById('loading-message');

  // Função para buscar os dados da planilha
  fetch(sheetDBUrl)
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
      loadingMessage.style.display = 'none'; // Esconde a mensagem "Carregando..."

      // Verifica se retornou algum pedido
      if (data.length === 0) {
        pedidosContainer.innerHTML = '<p>Nenhum pedido de carona no momento.</p>';
        return;
      }

      // Para cada pedido encontrado, cria um card e exibe na tela
      data.forEach(pedido => {
        const card = document.createElement('div');
        card.className = 'carona-card';

        // --- ALTERAÇÃO NO CARD ---
        // Adicionamos ícones para consistência e o novo botão de copiar.
        // Dentro de pedidos-app.js
        card.innerHTML = `
          <h3><i class="fa-solid fa-route"></i> De: ${pedido.origem} <br> Para: ${pedido.destino}</h3>
          <p><i class="fa-solid fa-user"></i> <strong>Solicitante:</strong> ${pedido.nome}</p>
          <p><i class="fa-solid fa-calendar-day"></i> <strong>Data Preferencial:</strong> ${new Date(pedido.data_preferencial).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
          
          <p class="contact-line">
            <span><i class="fa-solid fa-address-book"></i> <strong>Contato:</strong> ${pedido.contato}</span>
            <button class="copy-btn" data-contact="${pedido.contato}">
              <i class="fa-solid fa-copy"></i> Copiar
            </button>
          </p>
        `;
        
        pedidosContainer.appendChild(card);
      });
    })
    .catch(error => {
      // Em caso de erro na busca
      console.error('Erro ao buscar pedidos:', error);
      loadingMessage.style.display = 'none';
      pedidosContainer.innerHTML = '<p>Ocorreu um erro ao carregar os pedidos. Tente novamente mais tarde.</p>';
    });

  // Adiciona um único "escutador de eventos" ao container principal para gerenciar todos os botões de cópia.
  pedidosContainer.addEventListener('click', function(event) {
    // Procura por um botão .copy-btn que tenha sido clicado
    const copyButton = event.target.closest('.copy-btn');

    if (copyButton) {
      // Pega o contato do atributo data-contact do botão
      const contactToCopy = copyButton.dataset.contact;
      
      // Usa a API do navegador para escrever o texto na área de transferência
      navigator.clipboard.writeText(contactToCopy).then(() => {
        // Sucesso! Muda a aparência do botão para dar feedback ao usuário.
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        copyButton.classList.add('success');

        // Volta ao estado original depois de 2 segundos (2000 milissegundos)
        setTimeout(() => {
          copyButton.innerHTML = originalText;
          copyButton.classList.remove('success');
        }, 2000);

      }).catch(err => {
        console.error('Falha ao copiar o texto: ', err);
        alert("Não foi possível copiar o contato.");
      });
    }
  });
});