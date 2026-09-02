# Hospet — reservas de hospedagens para cães e gatos
Hospet é uma aplicação web interativa desenvolvida para facilitar e organizar a reserva de hospedagens para animais de estimação. A plataforma conta com um fluxo contínuo (Single Page Application), permitindo ao tutor navegar entre o agendamento, formulário de dados com consulta automática de CEP e receber a confirmação do agendamento via WhatsApp - após enviar sua solicitação

# Funcionalidades
Navegação Dinâmica: 
Transição suave entre telas sem recarregamento da página.
Calendário Interativo:
Visualização mensal com navegação.
Sinalização de status das datas (Verde = Disponível, Vermelho = Reservado).
Bloqueio automático de datas após a confirmação da reserva.
Integração com API ViaCEP: 
Preenchimento automático de logradouro, bairro, cidade e estado ao digitar o CEP.
Formulário de Solicitação: 
Coleta de dados do tutor (nome, telefone, e-mail e observações). É bom que o solicitante informe no campo de observações as 
características de seu animal de estimação, como raça e peso, e informações sobre restrições, estado de saúde e etc.
Finalização do atendimento Via WhatsApp: 
Após a solicitação do agendamento, a empresa entrará em contato com o solicitante para confirmar o agendamento.

# Tecnologias Utilizadas
HTML5: Estrutura semântica do projeto.
CSS3: Estilização responsiva com suporte a variáveis, Flexbox e CSS Grid.
JavaScript: Lógica do calendário, controle de estados, manipulação de eventos do DOM e requisições HTTP (fetch).
ViaCEP Webservice: API para busca e validação de CEP em tempo real.

# Estrutura do Projeto
Hospet/
README.md         Documentação e apresentação do projeto.
LICENSE           Licença de uso e distribuição (MIT License).
hospet.html       Arquivo HTML principal e telas da aplicação.
style.css         Estilos visuais e layout responsivo.
script.js         Lógica do calendário e consumo da API ViaCEP.
doggy.jpeg        Imagem interativa da tela principal.


