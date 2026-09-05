document.addEventListener('DOMContentLoaded', () => {

    // SENHA PADRÃO DE ACESSO
    const ADMIN_PASSWORD = "admin123";

    // --- CONTROLE DE TELAS & LOGIN ---
    const viewCliente = document.getElementById('viewCliente');
    const viewDono = document.getElementById('viewDono');
    const modalLogin = document.getElementById('modalLogin');

    const btnAbrirLogin = document.getElementById('btnAbrirLogin');
    const btnCancelarLogin = document.getElementById('btnCancelarLogin');
    const loginForm = document.getElementById('loginForm');
    const adminPassword = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    const btnLogout = document.getElementById('btnLogout');

    btnAbrirLogin.addEventListener('click', () => {
        adminPassword.value = '';
        loginError.classList.add('hidden');
        modalLogin.classList.remove('hidden');
    });

    btnCancelarLogin.addEventListener('click', () => {
        modalLogin.classList.add('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (adminPassword.value === ADMIN_PASSWORD) {
            modalLogin.classList.add('hidden');
            viewCliente.classList.add('hidden');
            viewDono.classList.remove('hidden');
            renderBookings();
        } else {
            loginError.classList.remove('hidden');
        }
    });

    btnLogout.addEventListener('click', () => {
        viewDono.classList.add('hidden');
        viewCliente.classList.remove('hidden');
    });

    // --- LÓGICA DO CLIENTE ---
    const mainContainer = document.getElementById('mainContainer');
    const calendarScreen = document.getElementById('calendarScreen');
    const formScreen = document.getElementById('formScreen');
    const successScreen = document.getElementById('successScreen');

    const monthYearTitle = document.getElementById('monthYearTitle');
    const btnPrevMonth = document.getElementById('btnPrevMonth');
    const btnNextMonth = document.getElementById('btnNextMonth');
    const calendarGrid = document.getElementById('calendarGrid');

    const btnReserva = document.getElementById('btnReserva');
    const btnVoltarInicio = document.getElementById('btnVoltarInicio');
    const btnVoltarCalendar = document.getElementById('btnVoltarCalendar');
    const btnNovoAgendamento = document.getElementById('btnNovoAgendamento');
    const bookingForm = document.getElementById('bookingForm');
    const selectedDateText = document.getElementById('selectedDateText');

    const cepInput = document.getElementById('tutorCep');
    const addressInput = document.getElementById('tutorAddress');
    const cepError = document.getElementById('cepError');

    let currentDate = new Date();
    let selectedDateString = null;

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    function getReservedDates() {
        const bookings = JSON.parse(localStorage.getItem('miauspedagem_bookings')) || [];
        return new Set(bookings.map(b => b.date));
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearTitle.innerText = `${monthNames[month]} ${year}`;

        const headers = Array.from(calendarGrid.querySelectorAll('.day-header'));
        calendarGrid.innerHTML = '';
        headers.forEach(h => calendarGrid.appendChild(h));

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            const span = document.createElement('span');
            calendarGrid.appendChild(span);
        }

        const reservedDates = getReservedDates();

        for (let day = 1; day <= totalDays; day++) {
            const btn = document.createElement('button');
            btn.innerText = day;

            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

            btn.dataset.date = dateKey;
            btn.classList.add('day');

            if (reservedDates.has(dateKey)) {
                btn.classList.add('reserved');
            } else {
                btn.classList.add('available');
            }

            calendarGrid.appendChild(btn);
        }
    }

    btnPrevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    btnNextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

   btnReserva.addEventListener('click', () => {
        mainContainer.classList.add('hidden');
        calendarScreen.classList.remove('hidden');
        renderCalendar();
    });

    btnVoltarInicio.addEventListener('click', () => {
        calendarScreen.classList.add('hidden');
        mainContainer.classList.remove('hidden');
    });

    calendarGrid.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('day') && target.classList.contains('available')) {
            selectedDateString = target.dataset.date;
            const [y, m, d] = selectedDateString.split('-');
            selectedDateText.innerText = `Data Selecionada: ${d}/${m}/${y}`;

            calendarScreen.classList.add('hidden');
            formScreen.classList.remove('hidden');
        }
    });

    btnVoltarCalendar.addEventListener('click', () => {
        formScreen.classList.add('hidden');
        calendarScreen.classList.remove('hidden');
    });

    // Busca CEP (ViaCEP API)
    cepInput.addEventListener('blur', () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (!data.erro) {
                        addressInput.value = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
                        cepError.classList.add('hidden');
                    } else {
                        cepError.classList.remove('hidden');
                        addressInput.value = '';
                    }
                })
                .catch(() => {
                    cepError.classList.remove('hidden');
                });
        }
    });

    // Enviar solicitação
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newBooking = {
            id: Date.now(),
            date: selectedDateString,
            tutorName: document.getElementById('tutorName').value,
            tutorPhone: document.getElementById('tutorPhone').value,
            tutorEmail: document.getElementById('tutorEmail').value,
            tutorAddress: addressInput.value,
            tutorDetails: document.getElementById('tutorDetails').value,
            status: 'pendente'
        };

        const savedBookings = JSON.parse(localStorage.getItem('miauspedagem_bookings')) || [];
        savedBookings.push(newBooking);
        localStorage.setItem('miauspedagem_bookings', JSON.stringify(savedBookings));

        formScreen.classList.add('hidden');
        successScreen.classList.remove('hidden');

        bookingForm.reset();
        addressInput.value = '';
    });

    btnNovoAgendamento.addEventListener('click', () => {
        successScreen.classList.add('hidden');
        mainContainer.classList.remove('hidden');
    });

    // --- LÓGICA DO PROPRIETÁRIO ---
    const bookingList = document.getElementById('bookingList');

    function renderBookings() {
        const bookings = JSON.parse(localStorage.getItem('miauspedagem_bookings')) || [];

        if (bookings.length === 0) {
            bookingList.innerHTML = '<div class="empty-msg">Nenhuma solicitação de reserva cadastrada no momento.</div>';
            return;
        }

        bookingList.innerHTML = '';
        bookings.sort((a, b) => b.id - a.id);

        bookings.forEach((item) => {
            const cleanPhone = item.tutorPhone.replace(/\D/g, '');
            const [y, m, d] = item.date.split('-');
            const formattedDate = `${d}/${m}/${y}`;

            const message = encodeURIComponent(
                `Olá ${item.tutorName}! Recebemos a sua solicitação de hospedagem na MiAuspedagem para a data ${formattedDate}. Gostaria de confirmar os detalhes do seu pet para finalizar a reserva!`
            );

            const card = document.createElement('div');
            card.className = 'booking-card';
            card.innerHTML = `
                <div class="booking-header-row">
                    <strong>📅 Data da Hospedagem: ${formattedDate}</strong>
                    <span class="status-badge status-${item.status}">${item.status.toUpperCase()}</span>
                </div>
                <p><strong>👨‍🦱 Tutor:</strong> ${item.tutorName}</p>
                <p><strong>📱 Telefone:</strong> ${item.tutorPhone}</p>
                <p><strong>✉ E-mail:</strong> ${item.tutorEmail}</p>
                <p><strong>🌎 Endereço:</strong> ${item.tutorAddress}</p>
                <p><strong>🐾 Detalhes/Pet:</strong> ${item.tutorDetails || 'Nenhum detalhe informado'}</p>
                
                <div class="actions-group">
                    <a href="https://wa.me/55${cleanPhone}?text=${message}" target="_blank" class="btn-wa">
                        Confirmar via WhatsApp
                    </a>
                    ${item.status === 'pendente' ? `<button class="btn-confirm" onclick="confirmBooking(${item.id})">✓ Marcar como Confirmado</button>` : ''}
                </div>
            `;

            bookingList.appendChild(card);
        });
    }

    window.confirmBooking = function (id) {
        let bookings = JSON.parse(localStorage.getItem('miauspedagem_bookings')) || [];
        bookings = bookings.map(item => {
            if (item.id === id) {
                item.status = 'confirmado';
            }
            return item;
        });
        localStorage.setItem('miauspedagem_bookings', JSON.stringify(bookings));
        renderBookings();
    };

    window.deleteBooking = function (id) {
        if (confirm("Tem certeza que deseja excluir esta solicitação?")) {
            let bookings = JSON.parse(localStorage.getItem('miauspedagem_bookings')) || [];
            bookings = bookings.filter(item => item.id !== id);
            localStorage.setItem('miauspedagem_bookings', JSON.stringify(bookings));
            renderBookings();
        }
    };
});
