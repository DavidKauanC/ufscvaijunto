// Arquivo: minhas-caronas.js (Versão Melhorada)

document.addEventListener('DOMContentLoaded', function() {
  
  // COLOQUE SUA URL REAL E ÚNICA DO SHEETDB AQUI
  const sheetDBUrl = 'https://sheetdb.io/api/v1/njhrwhu3xo8rg'; 
  
  // Elementos da página
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-name-input');
  const myRidesContainer = document.getElementById('my-rides-container');
  const bidsContainer = document.getElementById('bids-container');

  // Evento para buscar as caronas do motorista
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const driverName = searchInput.value.trim().toLowerCase();
    
    if (!driverName) return;

    myRidesContainer.innerHTML = '<p>Buscando suas caronas...</p>';
    bidsContainer.innerHTML = ''; // Limpa a área de lances

    // 1. Busca TODAS as ofertas
    fetch(`${sheetDBUrl}?sheet=ofertas`)
      .then(response => response.json())
      .then(data => {
        // 2. Filtra para encontrar apenas as do motorista (de forma mais segura)
        const myRides = data.filter(ride => 
            ride.nome && ride.nome.trim().toLowerCase() === driverName
        );

        if (myRides.length === 0) {
          myRidesContainer.innerHTML = '<p>Nenhuma carona encontrada com este nome. Verifique se o nome foi digitado exatamente como no momento da oferta.</p>';
          return;
        }

        // 3. Exibe as caronas encontradas
        myRidesContainer.innerHTML = '<h3>Suas Caronas Oferecidas (clique para ver os lances):</h3>';
        myRides.forEach(ride => {
          const rideCard = document.createElement('div');
          rideCard.className = 'my-ride-card';
          rideCard.dataset.caronaId = ride.id_carona; // Guarda o ID da carona no elemento
          rideCard.innerHTML = `<strong>De:</strong> ${ride.origem} <strong>Para:</strong> ${ride.destino} - <strong>Data:</strong> ${new Date(ride.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;
          myRidesContainer.appendChild(rideCard);
        });
      })
      .catch(error => {
          console.error('Erro ao buscar caronas:', error);
          myRidesContainer.innerHTML = '<p>Ocorreu um erro de conexão ao buscar suas caronas. Verifique sua URL da API e a conexão com a internet.</p>';
      });
  });

  // (O resto do código para buscar os lances e copiar o contato continua o mesmo)
  // ...
  myRidesContainer.addEventListener('click', function(event) {
    const rideCard = event.target.closest('.my-ride-card');
    if (!rideCard) return;

    const caronaId = rideCard.dataset.caronaId;
    bidsContainer.innerHTML = '<h3>Lances Recebidos para esta Carona:</h3><p>Carregando lances...</p>';

    // ... (Lógica para buscar os lances)
    fetch(`${sheetDBUrl}?sheet=lances`)
      .then(response => response.json())
      .then(data => {
        const bidsForThisRide = data.filter(bid => bid.id_carona === caronaId);
        if (bidsForThisRide.length === 0) {
          bidsContainer.innerHTML = '<h3>Lances Recebidos para esta Carona:</h3><p>Nenhum lance recebido para esta carona ainda.</p>';
          return;
        }
        bidsContainer.innerHTML = '<h3>Lances Recebidos para esta Carona:</h3>';
        bidsForThisRide.forEach(bid => {
          const bidCard = document.createElement('div');
          bidCard.className = 'bid-card';
          bidCard.innerHTML = `
            <p><strong>Nome do Passageiro:</strong> ${bid.nome_passageiro}</p>
            <p><strong>Valor do Lance:</strong> R$ ${parseFloat(bid.valor_lance).toFixed(2)}</p>
            <p class="contact-line">
              <span><strong>Contato:</strong> ${bid.contato_passageiro}</span>
              <button class="copy-btn" data-contact="${bid.contato_passageiro}">
                <i class="fa-solid fa-copy"></i> Copiar
              </button>
            </p>
          `;
          bidsContainer.appendChild(bidCard);
        });
      })
      .catch(error => console.error('Erro ao buscar lances:', error));
  });

  document.addEventListener('click', function(event) {
    const copyButton = event.target.closest('.copy-btn');
    if (copyButton) {
        const contactToCopy = copyButton.dataset.contact;
        navigator.clipboard.writeText(contactToCopy).then(() => {
            copyButton.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
            copyButton.classList.add('success');
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar';
                copyButton.classList.remove('success');
            }, 2000);
        }).catch(err => console.error('Falha ao copiar:', err));
    }
  });

});