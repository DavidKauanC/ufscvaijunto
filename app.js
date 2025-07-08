// Arquivo: app.js (Versão Final Simplificada)

document.addEventListener('DOMContentLoaded', function() {
  
  const sheetDBUrl = 'https://sheetdb.io/api/v1/njhrwhu3xo8rg'; 
  
  // Elementos do DOM
  const caronasContainer = document.getElementById('caronas-container');
  const loadingMessage = document.getElementById('loading-message');
  const modal = document.getElementById('bid-modal');
  const closeModalBtn = document.querySelector('.close-btn');
  const bidForm = document.getElementById('bid-form');
  const modalCaronaIdInput = document.getElementById('modal_id_carona');
  
  // Elementos do Slider
  const bidSlider = document.getElementById('bid-slider');
  const amountDisplay = document.getElementById('selected-bid-amount');
  const hiddenBidValueInput = document.getElementById('modal_valor_lance_hidden');

  // --- LÓGICA DO SLIDER SIMPLIFICADA ---
  if (bidSlider) {
    // Define o valor inicial do display
    amountDisplay.textContent = `R$ ${parseFloat(bidSlider.value).toFixed(2).replace('.', ',')}`;
    hiddenBidValueInput.value = bidSlider.value;
    
    // Evento que atualiza o texto e o campo escondido a cada movimento
    bidSlider.addEventListener('input', function() {
      amountDisplay.textContent = `R$ ${parseFloat(this.value).toFixed(2).replace('.', ',')}`;
      hiddenBidValueInput.value = this.value;
    });
  }

  // --- BUSCAR E EXIBIR AS OFERTAS DE CARONA ---
  if(caronasContainer) {
    fetch(`${sheetDBUrl}?sheet=ofertas`)
      .then(response => response.json())
      .then(data => {
        loadingMessage.style.display = 'none';
        if (data.length === 0) {
            caronasContainer.innerHTML = '<p>Nenhuma carona disponível no momento.</p>';
            return;
        }
        data.forEach(carona => {
            const card = document.createElement('div');
            card.className = 'carona-card';
            card.innerHTML = `
              <h3><i class="fa-solid fa-route"></i> De: ${carona.origem} <br> Para: ${carona.destino}</h3>
              <p><i class="fa-solid fa-user-check"></i> <strong>Motorista:</strong> ${carona.nome}</p>
              <p><i class="fa-solid fa-calendar-days"></i> <strong>Data:</strong> ${new Date(carona.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
              <p><i class="fa-solid fa-clock"></i> <strong>Hora:</strong> ${carona.hora}</p>
              <p><i class="fa-solid fa-chair"></i> <strong>Vagas:</strong> ${carona.vagas}</p>
              <p class="contact-line">
                <span><i class="fa-solid fa-address-book"></i> <strong>Contato:</strong> ${carona.contato}</span>
                <button class="copy-btn" data-contact="${carona.contato}"><i class="fa-solid fa-copy"></i> Copiar</button>
              </p>
              <div class="card-actions">
                 <button class="bid-btn button" data-carona-id="${carona.id_carona}"><i class="fa-solid fa-gavel"></i> Fazer um Lance</button>
              </div>
            `;
            caronasContainer.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Erro ao buscar caronas:', error);
        loadingMessage.style.display = 'none';
        caronasContainer.innerHTML = '<p>Ocorreu um erro ao carregar as caronas.</p>';
      });
  }

  // --- LÓGICA DE EVENTOS E FORMULÁRIO ---
  function closeModal() { if(modal) modal.style.display = 'none'; }
  if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (event) => { if (event.target == modal) closeModal(); });

  document.addEventListener('click', function(event){
    const copyButton = event.target.closest('.copy-btn');
    if(copyButton){
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

    const bidButton = event.target.closest('.bid-btn');
    if(bidButton){
        const caronaId = bidButton.dataset.caronaId;
        if(modalCaronaIdInput) modalCaronaIdInput.value = caronaId; 
        if(modal) modal.style.display = 'block'; 
    }
  });

  if(bidForm) {
    bidForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const submitBtn = document.getElementById('modal-submit-button');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';
      document.getElementById('modal_data_lance').value = new Date().toISOString();
      const formData = new FormData(bidForm);
      fetch(`${sheetDBUrl}?sheet=lances`, { method: 'POST', body: formData })
      .then(response => response.json())
      .then(data => {
        if (data.created >= 1) {
          alert('Lance enviado com sucesso!');
          bidForm.reset();
          if(bidSlider) {
            bidSlider.value = 10;
            amountDisplay.textContent = `R$ ${parseFloat(bidSlider.value).toFixed(2).replace('.', ',')}`;
          }
          closeModal();
        } else {
          alert('Ocorreu um erro ao enviar seu lance.');
        }
      })
      .catch(error => console.error('Erro:', error))
      .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Lance';
      });
    });
  }
});