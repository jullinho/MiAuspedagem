document.addEventListener('DOMContentLoaded', () => {
    // Telas
    const mainContainer = document.getElementById('mainContainer');
    const calendarScreen = document.getElementById('calendarScreen');
    const formScreen = document.getElementById('formScreen');
    const successScreen = document.getElementById('successScreen');

    // Elementos do Calendário
    const monthYearTitle = document.getElementById('monthYearTitle');
    const btnPrevMonth = document.getElementById('btnPrevMonth');
    const btnNextMonth = document.getElementById('btnNextMonth');
    const calendarGrid = document.getElementById('calendarGrid');

    // Botões e Formulário
    const btnDalmata = document.getElementById('btnDalmata');
    const btnVoltarInicio = document.getElementById('btnVoltarInicio');
    const btnVoltarCalendar = document.getElementById('btnVoltarCalendar');
    const btnNovoAgendamento = document.getElementById('btnNovoAgendamento');
    const bookingForm = document.getElementById('bookingForm');
    const selectedDateText = document.getElementById('selectedDateText');

    // CEP elementos
    const cepInput = document.getElementById('tutorCep');
    const addressInput = document.getElementById('tutorAddress');
    const cepError = document.getElementById('cepError');

    // Estado da data atual e reservas
    let currentDate = new Date();
    let selectedDateString = null; // Ex: "2026-09-15"
    const reservedDates = new Set(); // Guarda as datas que já foram reservadas

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Renderiza o Calendário de acordo com Mês e Ano atuais
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearTitle.innerText = `${monthNames[month]} ${year}`;

        // Limpa apenas os dias, mantendo o cabeçalho dos dias da semana (D S T Q Q S S)
        const headers = Array.from(calendarGrid.querySelectorAll('.day-header'));
        calendarGrid.innerHTML = '';
        headers.forEach(h => calendarGrid.appendChild(h));

        // Primeiro dia do mês (0 = Domingo, 1 = Segunda...)
        const firstDayIndex = new Date(year, month, 1).getDay();

        // Total de dias do mês
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Adiciona espaços vazios antes do dia 1
        for (let i = 0; i < firstDayIndex; i++) {
            const span = document.createElement('span');
            calendarGrid.appendChild(span);
        }

        // Gera cada dia do mês
        for (let day = 1; day <= totalDays; day++) {
            const btn = document.createElement('button');
            btn.innerText = day;

            // Formatador AAAA-MM-DD
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

            btn.dataset.date = dateKey;
            btn.classList.add('day');

            // Se a data já foi confirmada como reservada
            if (reservedDates.has(dateKey)) {
                btn.classList.add('reserved');
            } else {
                btn.classList.add('available');
            }

            calendarGrid.appendChild(btn);
        }
    }

    // Controles de Navegação do Mês
    btnPrevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    btnNextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Abrir Calendário
    btnDalmata.addEventListener('click', () => {
        mainContainer.classList.add('hidden');
        calendarScreen.classList.remove('hidden');
        renderCalendar();
    });

    // Voltar para tela inicial
    btnVoltarInicio.addEventListener('click', () => {
        calendarScreen.classList.add('hidden');
        mainContainer.classList.remove('hidden');
    });

    // Clique na Data Disponível
    calendarGrid.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('day') && target.classList.contains('available')) {
            selectedDateString = target.dataset.date;

            // Formata exibição da data no formulário (DD/MM/AAAA)
            const [y, m, d] = selectedDateString.split('-');
            selectedDateText.innerText = `Data Selecionada: ${d}/${m}/${y}`;

            calendarScreen.classList.add('hidden');
            formScreen.classList.remove('hidden');
        }
    });

    // Voltar para Calendário
    btnVoltarCalendar.addEventListener('click', () => {
        formScreen.classList.add('hidden');
        calendarScreen.classList.remove('hidden');
    });

    // Busca CEP (ViaCEP)
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

    // Submeter Formulário
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Adiciona a data à lista de reservadas
        if (selectedDateString) {
            reservedDates.add(selectedDateString);
        }

        formScreen.classList.add('hidden');
        successScreen.classList.remove('hidden');

        bookingForm.reset();
        addressInput.value = '';
    });

    // Voltar da confirmação para o Início
    btnNovoAgendamento.addEventListener('click', () => {
        successScreen.classList.add('hidden');
        mainContainer.classList.remove('hidden');
    });
});