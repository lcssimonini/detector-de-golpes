// Detector de Golpes - JavaScript Principal
(function() {
    'use strict';

    // Variáveis globais
    let currentPage = 'verificador';
    let quizAtual = 0;
    let pontuacaoQuiz = 0;
    let phishingAtual = 0;
    let pontuacaoPhishing = 0;
    let emailsRespondidos = 0;
    let passwordAtual = 0;
    let pontuacaoPassword = 0;

    // Perguntas do Quiz
    const perguntasQuiz = [
        {
            pergunta: "Qual destes é um sinal de site seguro?",
            opcoes: ["URL começa com http://", "URL começa com https://", "Site tem muitos pop-ups"],
            correta: 1,
            explicacao: "Sites seguros sempre usam HTTPS (com 'S' de Secure/Seguro)!"
        },
        {
            pergunta: "O que você deve fazer ao receber um link suspeito?",
            opcoes: ["Clicar imediatamente", "Não clicar e verificar a fonte", "Compartilhar com amigos"],
            correta: 1,
            explicacao: "Sempre desconfie de links suspeitos e verifique a fonte antes de clicar!"
        },
        {
            pergunta: "Qual é uma característica de golpes online?",
            opcoes: ["Ofertas muito baratas", "Sites profissionais", "Informações claras"],
            correta: 0,
            explicacao: "Ofertas 'boas demais para ser verdade' são um sinal clássico de golpe!"
        }
    ];

    // Desafios do Jogo de Senhas
    const desafiosSenha = [
        {
            nivel: 1,
            tarefa: "Crie uma senha básica segura",
            dica: "Pelo menos 8 caracteres com maiúscula, minúscula e número",
            requisitos: ['minimo8', 'maiuscula', 'minuscula', 'numero']
        },
        {
            nivel: 2,
            tarefa: "Adicione símbolos especiais",
            dica: "Inclua pelo menos um símbolo como !@#$%",
            requisitos: ['minimo8', 'maiuscula', 'minuscula', 'numero', 'simbolo']
        },
        {
            nivel: 3,
            tarefa: "Evite sequências óbvias",
            dica: "Não use 123, abc, qwerty ou password",
            requisitos: ['minimo12', 'maiuscula', 'minuscula', 'numero', 'simbolo', 'naoSequencia']
        }
    ];

    // Dados para detector de phishing
    const emailsPhishing = [
        {
            remetente: "banco@bancoseguro.com.br",
            assunto: "Confirmação de Transferência",
            conteudo: "Olá! Sua transferência de R$ 1.500,00 foi processada com sucesso. Verifique seu extrato no app oficial do banco.",
            seguro: true,
            explicacao: "Email legítimo: remetente oficial, linguagem profissional, não pede dados pessoais."
        },
        {
            remetente: "noreply@banko-brasil.tk",
            assunto: "URGENTE: Sua conta será bloqueada em 24h!",
            conteudo: "Prezado cliente, detectamos atividade suspeita. CLIQUE AQUI para confirmar seus dados e evitar o bloqueamento: www.banco-falso.tk/login",
            seguro: false,
            explicacao: "GOLPE: domínio suspeito (.tk), urgência excessiva, link suspeito, pede dados pessoais."
        },
        {
            remetente: "promocoes@ofertas-incriveis.net",
            assunto: "🎉 VOCÊ GANHOU R$ 50.000! Clique para resgatar!",
            conteudo: "PARABÉNS! Você foi sorteado em nossa promoção! Para resgatar seus R$ 50.000, informe: CPF, RG, dados bancários. CORRA, só hoje!",
            seguro: false,
            explicacao: "GOLPE: prêmio não solicitado, pede dados pessoais, urgência falsa, valor muito alto."
        }
    ];

    // Conteúdo das páginas
    const paginasConteudo = {
        prevencao: `
            <div class="container mx-auto px-4 py-12">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold mb-4">🛡️ Como se Proteger</h2>
                    <p class="text-xl text-gray-300">Dicas essenciais para navegar com segurança</p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <div class="bg-emerald-800 border-2 border-emerald-500 rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-6 text-emerald-200">🔒 Sinais de Sites Seguros</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start space-x-3">
                                <span class="text-emerald-300 text-xl">✓</span>
                                <span>URL começa com <strong>https://</strong></span>
                            </li>
                            <li class="flex items-start space-x-3">
                                <span class="text-emerald-300 text-xl">✓</span>
                                <span>Ícone de cadeado na barra de endereços</span>
                            </li>
                            <li class="flex items-start space-x-3">
                                <span class="text-emerald-300 text-xl">✓</span>
                                <span>Design profissional e sem erros</span>
                            </li>
                            <li class="flex items-start space-x-3">
                                <span class="text-emerald-300 text-xl">✓</span>
                                <span>Informações de contato claras</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="bg-rose-800 border-2 border-rose-500 rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-6 text-rose-200">🚨 Sinais de Alerta</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start space-x-3">
                                <span class="text-rose-300 text-xl">✗</span>
                                <span>Ofertas "boas demais para ser verdade"</span>
                            </li>
                            <li class="flex items-start space-x-3">
                                <span class="text-rose-300 text-xl">✗</span>
                                <span>Urgência excessiva ("só hoje!")</span>
                            </li>
                            <li class="flex items-start space-x-3">
                                <span class="text-rose-300 text-xl">✗</span>
                                <span>Erros de português ou design ruim</span>
                            </li>
                            <li class="flex items-start space-x-3">
                                <span class="text-rose-300 text-xl">✗</span>
                                <span>Pedidos de dados pessoais suspeitos</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
        vitima: `
            <div class="container mx-auto px-4 py-12">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold mb-4">🆘 Fui Vítima de Golpe</h2>
                    <p class="text-xl text-gray-300">Não se desespere! Veja o que fazer agora</p>
                </div>
                
                <div class="max-w-4xl mx-auto">
                    <div class="bg-red-900 rounded-2xl p-8 mb-8">
                        <h3 class="text-2xl font-bold mb-6 text-center">⚡ Ações Imediatas</h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="bg-red-800 rounded-xl p-6">
                                <h4 class="font-bold mb-3 text-lg">1. 🔒 Proteja suas Contas</h4>
                                <ul class="space-y-2 text-sm">
                                    <li>• Mude todas as senhas</li>
                                    <li>• Ative autenticação em duas etapas</li>
                                    <li>• Verifique atividades suspeitas</li>
                                </ul>
                            </div>
                            <div class="bg-red-800 rounded-xl p-6">
                                <h4 class="font-bold mb-3 text-lg">2. 🏦 Contate o Banco</h4>
                                <ul class="space-y-2 text-sm">
                                    <li>• Bloqueie cartões imediatamente</li>
                                    <li>• Conteste transações fraudulentas</li>
                                    <li>• Solicite novos cartões</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-900 rounded-2xl p-8 mb-8">
                        <h3 class="text-2xl font-bold mb-6 text-center text-blue-400">📞 Onde Denunciar</h3>
                        <div class="grid md:grid-cols-3 gap-6">
                            <div class="bg-blue-800 rounded-xl p-6 text-center">
                                <div class="text-3xl mb-3">🚔</div>
                                <h4 class="font-bold mb-2">Polícia Civil</h4>
                                <p class="text-sm mb-3">Delegacia de Crimes Cibernéticos</p>
                                <button onclick="window.open('tel:197', '_blank')" class="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm transition-colors">
                                    Ligar: 197
                                </button>
                            </div>
                            <div class="bg-blue-800 rounded-xl p-6 text-center">
                                <div class="text-3xl mb-3">🛡️</div>
                                <h4 class="font-bold mb-2">Procon</h4>
                                <p class="text-sm mb-3">Defesa do Consumidor</p>
                                <button onclick="window.open('tel:151', '_blank')" class="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm transition-colors">
                                    Ligar: 151
                                </button>
                            </div>
                            <div class="bg-blue-800 rounded-xl p-6 text-center">
                                <div class="text-3xl mb-3">💻</div>
                                <h4 class="font-bold mb-2">SaferNet</h4>
                                <p class="text-sm mb-3">Crimes na Internet</p>
                                <button onclick="window.open('https://new.safernet.org.br/denuncie', '_blank', 'noopener,noreferrer')" class="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm transition-colors">
                                    Denunciar Online
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        jogos: `
            <div class="container mx-auto px-4 py-12">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold mb-4">🎮 Jogos Educativos</h2>
                    <p class="text-xl text-gray-300">Aprenda segurança digital se divertindo!</p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <!-- Quiz de Segurança -->
                    <div class="bg-gray-900 rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-6 text-center text-purple-400">🧠 Quiz de Segurança</h3>
                        <div id="quiz-container">
                            <div id="quiz-question" class="mb-6">
                                <h4 class="text-lg font-semibold mb-4">Qual destes é um sinal de site seguro?</h4>
                                <div class="space-y-3">
                                    <button onclick="responderQuiz(0)" class="quiz-option w-full text-left p-3 bg-gray-800 hover:bg-blue-800 rounded-lg transition-colors">
                                        A) URL começa com http://
                                    </button>
                                    <button onclick="responderQuiz(1)" class="quiz-option w-full text-left p-3 bg-gray-800 hover:bg-blue-800 rounded-lg transition-colors">
                                        B) URL começa com https://
                                    </button>
                                    <button onclick="responderQuiz(2)" class="quiz-option w-full text-left p-3 bg-gray-800 hover:bg-blue-800 rounded-lg transition-colors">
                                        C) Site tem muitos pop-ups
                                    </button>
                                </div>
                            </div>
                            <div id="quiz-result" class="hidden text-center">
                                <div id="quiz-feedback" class="mb-4"></div>
                                <button onclick="proximaPergunta()" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold transition-colors">
                                    Próxima Pergunta
                                </button>
                            </div>
                            <div class="text-center mt-4">
                                <span id="quiz-score" class="text-lg font-semibold">Pontuação: 0/0</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Detector de Phishing -->
                    <div class="bg-gray-900 rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-6 text-center text-orange-400">🎣 Detector de Phishing</h3>
                        <div class="text-center mb-4">
                            <p class="mb-2">Analise os e-mails e identifique quais são golpes:</p>
                            <p class="text-sm text-gray-400 mb-4">Clique em "Iniciar Jogo" para começar!</p>
                            <span id="phishing-score" class="text-lg font-semibold">Pontuação: 0/0</span>
                        </div>
                        
                        <div id="phishing-game" class="hidden">
                            <div id="email-display" class="bg-gray-800 rounded-lg p-4 mb-4 min-h-48">
                                <!-- Email será exibido aqui -->
                            </div>
                            
                            <div class="flex justify-center space-x-4">
                                <button onclick="classificarEmail(true)" class="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                                    <span>✅</span>
                                    <span>Seguro</span>
                                </button>
                                <button onclick="classificarEmail(false)" class="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                                    <span>❌</span>
                                    <span>Golpe</span>
                                </button>
                            </div>
                            
                            <div id="phishing-feedback" class="hidden mt-4 p-4 rounded-lg">
                                <!-- Feedback será exibido aqui -->
                            </div>
                        </div>
                        
                        <div id="phishing-start" class="text-center">
                            <button onclick="iniciarPhishing()" class="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-lg font-semibold transition-colors">
                                Iniciar Jogo
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Jogo de Senhas -->
                <div class="mt-12 bg-gray-900 rounded-2xl p-8 max-w-4xl mx-auto">
                    <h3 class="text-2xl font-bold mb-6 text-center text-cyan-400">🔐 Criador de Senhas Seguras</h3>
                    <div class="text-center mb-6">
                        <p class="mb-4">Aprenda a criar senhas super seguras passando pelos desafios!</p>
                    </div>
                    
                    <div id="startPasswordBtn" class="text-center">
                        <button onclick="iniciarPasswordGame()" class="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-lg font-semibold transition-colors">
                            Iniciar Desafio
                        </button>
                    </div>
                    
                    <div id="passwordContent" class="hidden">
                        <div class="mb-6">
                            <h4 id="passwordTask" class="text-lg font-semibold mb-4 text-center"></h4>
                            <div class="mb-4">
                                <input type="text" id="passwordInput" placeholder="Digite sua senha aqui..." class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none">
                            </div>
                            <div class="text-center mb-4">
                                <button id="checkPasswordBtn" onclick="verificarSenha()" class="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-lg font-semibold transition-colors mr-3">
                                    Verificar Senha
                                </button>
                                <button id="nextPasswordBtn" onclick="proximaFaseSenha()" class="hidden bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold transition-colors">
                                    Próximo Nível
                                </button>
                            </div>
                        </div>
                        
                        <div id="passwordFeedback" class="space-y-2 text-sm">
                            <!-- Feedback será exibido aqui -->
                        </div>
                    </div>
                    
                    <div id="passwordScore" class="hidden text-center">
                        <h4 class="text-2xl font-bold mb-4">🎯 Desafio Concluído!</h4>
                        <p id="passwordScoreText" class="text-lg mb-6"></p>
                        <button onclick="reiniciarPasswordGame()" class="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-lg font-semibold transition-colors">
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </div>
        `,
        sobre: `
            <div class="container mx-auto px-4 py-12">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold mb-4">Sobre o Projeto</h2>
                </div>
                
                <div class="max-w-4xl mx-auto">
                    <div class="bg-gray-900 rounded-2xl p-8 mb-8">
                        <div class="text-center mb-8">
                            <h3 class="text-2xl font-bold mb-4">Detector de Golpes</h3>
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="bg-blue-900 rounded-2xl p-8">
                            <h3 class="text-2xl font-bold mb-6">Nosso Objetivo</h3>
                            <p class="text-gray-300 leading-relaxed">
                                Educar pessoas de todas as idades - crianças, jovens, adultos e idosos - sobre os perigos da internet e como se proteger de golpes online. 
                                Queremos criar uma sociedade mais consciente e segura no mundo digital.
                            </p>
                        </div>
                        
                        <div class="bg-purple-900 rounded-2xl p-8">
                            <h3 class="text-2xl font-bold mb-6">Nossa Missão</h3>
                            <p class="text-gray-300 leading-relaxed">
                                Tornar o aprendizado sobre segurança digital divertido e acessível, 
                                usando uma linguagem jovem e ferramentas interativas.
                            </p>
                        </div>
                    </div>
                    
                    <div class="bg-gray-900 rounded-2xl p-8 mb-8">
                        <h3 class="text-2xl font-bold mb-6 text-center">Equipe do Projeto</h3>
                        <div class="text-center mb-6">
                            <div class="mb-6">
                                <h4 class="text-xl font-bold mb-4 text-blue-400">6° ano Gama</h4>
                                <div class="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                                    <div class="bg-blue-800 rounded-lg p-3">
                                        <span class="font-semibold">Isabela Gomes Ribeiro</span>
                                    </div>
                                    <div class="bg-blue-800 rounded-lg p-3">
                                        <span class="font-semibold">Henrique Pires Ferreira</span>
                                    </div>
                                    <div class="bg-blue-800 rounded-lg p-3">
                                        <span class="font-semibold">Luiza Costa Simonini</span>
                                    </div>
                                    <div class="bg-blue-800 rounded-lg p-3">
                                        <span class="font-semibold">Rafael Melo Ribeiro</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    // Navegação
    window.showPage = function(pageName) {
        // Esconder todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Mostrar página selecionada
        const pageElement = document.getElementById(pageName);
        pageElement.classList.remove('hidden');
        
        // Carregar conteúdo se necessário
        if (paginasConteudo[pageName] && pageElement.innerHTML.trim() === '') {
            pageElement.innerHTML = paginasConteudo[pageName];
        }
        
        // Atualizar botões do menu
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('text-indigo-400');
            btn.classList.add('text-white');
        });
        
        event.target.classList.add('text-indigo-400');
        event.target.classList.remove('text-white');
        
        currentPage = pageName;
        
        // Fechar menu mobile
        document.getElementById('mobileMenu').classList.add('hidden');
    };
    
    window.toggleMobileMenu = function() {
        const menu = document.getElementById('mobileMenu');
        menu.classList.toggle('hidden');
    };
    
    // Verificador de Sites
    window.verificarSite = function() {
        const url = document.getElementById('urlInput').value;
        const resultado = document.getElementById('resultado');
        
        if (!url) {
            resultado.innerHTML = '<div class="bg-red-800 text-white p-4 rounded-lg">Por favor, insira uma URL!</div>';
            resultado.classList.remove('hidden');
            return;
        }
        
        // Mostrar loading
        resultado.innerHTML = `
            <div class="bg-blue-800 text-white p-4 rounded-lg text-center">
                <div class="pulse-animation">🔍 Analisando site...</div>
            </div>
        `;
        resultado.classList.remove('hidden');
        
        // Simular delay de análise
        setTimeout(() => {
            const dadosAnalise = gerarDadosAnalise(url);
            mostrarResultadoDetalhado(dadosAnalise);
        }, 2000);
    };
    
    function gerarDadosAnalise(url) {
        let pontuacao = 0;
        let alertas = [];
        let aspectosPositivos = [];
        let aspectosNegativos = [];
        
        // CRITÉRIOS POSITIVOS (+pontos)
        
        // 1. HTTPS presente (+15 pontos)
        if (url.startsWith('https://')) {
            pontuacao += 15;
            aspectosPositivos.push('Conexão segura HTTPS');
        }
        
        // 2. Domínios conhecidos e confiáveis (+30 pontos)
        const dominiosConfiaveis = [
            'github.io', 'google.com', 'microsoft.com', 'apple.com',
            'amazon.com.br', 'mercadolivre.com.br', 'magazineluiza.com.br',
            'americanas.com.br', 'casasbahia.com.br', 'extra.com.br',
            'gov.br', 'edu.br', 'wikipedia.org', 'youtube.com',
            'facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com',
            'netflix.com', 'spotify.com', 'nubank.com.br', 'itau.com.br',
            'bradesco.com.br', 'santander.com.br', 'caixa.gov.br',
            'correios.com.br', 'uol.com.br', 'globo.com', 'terra.com.br',
            'outlook.com', 'yahoo.com'
        ];
        if (dominiosConfiaveis.some(dominio => url.includes(dominio))) {
            pontuacao += 30;
            aspectosPositivos.push('Domínio de plataforma confiável');
        }
        
        // 3. Domínio brasileiro (.br, .com.br) (+10 pontos)
        if (url.match(/\.(com\.br|gov\.br|edu\.br|org\.br)/) || url.includes('.br/')) {
            pontuacao += 10;
            aspectosPositivos.push('Domínio brasileiro registrado');
        }
        
        // 4. URL com tamanho razoável (+5 pontos)
        if (url.length < 100) {
            pontuacao += 5;
            aspectosPositivos.push('URL com tamanho adequado');
        }
        
        // CRITÉRIOS NEGATIVOS (-pontos)
        
        // 0. Domínio desconhecido (não está na lista de confiáveis) - informativo
        const isDominioConhecido = dominiosConfiaveis.some(dominio => url.includes(dominio));
        if (!isDominioConhecido && !url.includes('.gov.br') && !url.includes('.edu.br')) {
            aspectosNegativos.push('Domínio não está na lista de sites conhecidos e confiáveis');
        }
        
        // 1. Palavras suspeitas (-20 pontos cada)
        const palavrasSuspeitas = [
            'gratis', 'free', 'premio', 'ganhe', 'sorteio',
            'urgente', 'bloqueio', 'senha', 'dados', 'confirme',
            'atualize', 'verificacao', 'clique', 'click', 'winner',
            'promocao', 'oferta', 'desconto', 'barato', 'bonus',
            'dinheiro', 'money', 'cash', 'pix', 'transferencia',
            'conta', 'cartao', 'credito', 'banco', 'cpf'
        ];
        palavrasSuspeitas.forEach(palavra => {
            if (url.toLowerCase().includes(palavra)) {
                pontuacao -= 20;
                alertas.push(`Palavra suspeita detectada: "${palavra}"`);
                aspectosNegativos.push(`Contém palavra suspeita: "${palavra}"`);
            }
        });
        
        // 2. Domínios suspeitos (-30 pontos)
        const tldsSuspeitos = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz'];
        if (tldsSuspeitos.some(tld => url.includes(tld))) {
            pontuacao -= 30;
            alertas.push('Domínio de extensão suspeita');
            aspectosNegativos.push('Extensão de domínio suspeita');
        }
        
        // 3. Números excessivos no domínio (-15 pontos)
        const parteDominio = url.split('/')[2] || url;
        const numerosNoDominio = (parteDominio.match(/\d/g) || []).length;
        if (numerosNoDominio > 3) {
            pontuacao -= 15;
            alertas.push('Muitos números no domínio');
            aspectosNegativos.push(`Domínio com muitos números (${numerosNoDominio})`);
        }
        
        // 4. Hífens excessivos (-10 pontos)
        const hifens = (parteDominio.match(/-/g) || []).length;
        if (hifens > 2) {
            pontuacao -= 10;
            alertas.push('Muitos hífens no domínio');
            aspectosNegativos.push(`Domínio com muitos hífens (${hifens})`);
        }
        
        // 5. URL muito longa (-15 pontos)
        if (url.length > 150) {
            pontuacao -= 15;
            alertas.push('URL suspeita muito longa');
            aspectosNegativos.push(`URL muito longa (${url.length} caracteres)`);
        } else if (url.length > 80) {
            aspectosNegativos.push(`URL um pouco longa (${url.length} caracteres) - prefira URLs mais curtas`);
        }
        
        // 6. Sem HTTPS (-25 pontos)
        if (!url.startsWith('https://')) {
            pontuacao -= 25;
            alertas.push('Conexão não segura (sem HTTPS)');
            aspectosNegativos.push('Não usa HTTPS (conexão insegura)');
        }
        
        // 7. Subdomínios suspeitos (-20 pontos)
        const subdominiosSuspeitos = ['login', 'secure', 'account', 'verify', 'update'];
        if (subdominiosSuspeitos.some(sub => url.includes(sub + '.'))) {
            pontuacao -= 20;
            alertas.push('Subdomínio suspeito detectado');
            aspectosNegativos.push('Subdomínio suspeito (login, secure, etc)');
        }
        
        // CLASSIFICAÇÃO FINAL
        let status, cor, icone, risco, mensagem;
        
        if (pontuacao >= 30) {
            status = 'Seguro';
            cor = 'green';
            icone = '✅';
            risco = 'Baixo';
            mensagem = 'Este site apresenta boas práticas de segurança.';
        } else if (pontuacao >= 0) {
            status = 'Suspeito';
            cor = 'yellow';
            icone = '⚠️';
            risco = 'Médio';
            mensagem = 'Site apresenta algumas características suspeitas. Tenha cuidado.';
        } else {
            status = 'Perigoso';
            cor = 'red';
            icone = '🚨';
            risco = 'Alto';
            mensagem = 'Site apresenta múltiplos sinais de perigo! Evite acessar.';
        }
        
        // Dados que podem ser obtidos apenas pela URL
        const ssl = url.startsWith('https://') ? 'Ativo' : 'Inativo';
        
        // Identificar tipo de domínio
        let tipoDominio = 'Domínio comum';
        if (url.includes('.gov.br')) tipoDominio = '🏛️ Governo (.gov.br)';
        else if (url.includes('.edu.br')) tipoDominio = '🎓 Educacional (.edu.br)';
        else if (url.includes('.com.br')) tipoDominio = '🇧🇷 Comercial brasileiro (.com.br)';
        else if (url.includes('github.io')) tipoDominio = '💻 GitHub Pages';
        else if (tldsSuspeitos.some(tld => url.includes(tld))) tipoDominio = '⚠️ Extensão suspeita';
        
        return {
            url, status, cor, icone, risco, mensagem,
            ssl, tipoDominio,
            pontuacao, alertas, aspectosPositivos, aspectosNegativos
        };
    }
    
    function mostrarResultadoDetalhado(dados) {
        const resultado = document.getElementById('resultado');
        const corClass = dados.cor === 'green' ? 'bg-green-800' : dados.cor === 'yellow' ? 'bg-yellow-600' : 'bg-red-800';
        
        resultado.innerHTML = `
            <div class="${corClass} text-white p-6 rounded-lg">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-3">
                        <span class="text-3xl">${dados.icone}</span>
                        <div>
                            <h3 class="text-2xl font-bold">Status: ${dados.status}</h3>
                            <p class="text-sm opacity-90">Nível de Risco: ${dados.risco}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold">${dados.pontuacao}</div>
                        <div class="text-xs opacity-75">pontos</div>
                    </div>
                </div>
                
                <div class="bg-black bg-opacity-30 p-3 rounded-lg mb-6">
                    <div class="text-sm opacity-75 mb-1">URL Analisada:</div>
                    <div class="font-mono text-sm break-all">${dados.url}</div>
                </div>
                
                <div class="mb-6">
                    <h4 class="text-lg font-bold mb-3">🔍 O que conseguimos ver na URL:</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-black bg-opacity-30 p-3 rounded-lg">
                            <div class="text-xs opacity-75 mb-1">Conexão</div>
                            <div class="font-semibold ${dados.ssl === 'Ativo' ? 'text-green-300' : 'text-red-300'}">
                                ${dados.ssl === 'Ativo' ? '🔒 HTTPS (Seguro)' : '⚠️ HTTP (Não seguro)'}
                            </div>
                        </div>
                        <div class="bg-black bg-opacity-30 p-3 rounded-lg">
                            <div class="text-xs opacity-75 mb-1">Tipo de Domínio</div>
                            <div class="font-semibold">${dados.tipoDominio}</div>
                        </div>
                    </div>
                </div>
                
                <div class="border-t border-white border-opacity-30 pt-4 mb-4">
                    <h4 class="text-lg font-bold mb-3">📊 Análise de Segurança</h4>
                    <p class="mb-4">${dados.mensagem}</p>
                </div>
                
                ${dados.aspectosPositivos.length > 0 ? `
                    <div class="bg-green-900 bg-opacity-50 p-4 rounded-lg mb-4">
                        <h5 class="font-semibold text-green-300 mb-2">✓ Aspectos Positivos:</h5>
                        <ul class="text-sm space-y-1 list-disc list-inside">
                            ${dados.aspectosPositivos.map(asp => `<li>${asp}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${dados.aspectosNegativos.length > 0 ? `
                    <div class="bg-red-900 bg-opacity-50 p-4 rounded-lg">
                        <h5 class="font-semibold text-red-300 mb-2">✗ Aspectos Negativos:</h5>
                        <ul class="text-sm space-y-1 list-disc list-inside">
                            ${dados.aspectosNegativos.map(asp => `<li>${asp}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Exemplos de Sites
    window.mostrarExemplo = function(tipo) {
        const modal = document.getElementById('modalExemplo');
        const conteudo = document.getElementById('conteudoModal');
        
        let exemplo = '';
        
        switch(tipo) {
            case 'seguro':
                exemplo = `
                    <h3 class="text-2xl font-bold mb-4 text-green-400">✅ Exemplo de Site Seguro</h3>
                    <div class="bg-gray-800 p-4 rounded-lg mb-4">
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-green-400">🔒</span>
                            <span class="text-sm">https://loja-confiavel.com.br</span>
                        </div>
                        <h4 class="font-bold mb-2">Loja Confiável - Eletrônicos</h4>
                        <p class="text-sm text-gray-300">Design profissional, informações claras de contato, política de privacidade visível.</p>
                    </div>
                    <h4 class="font-bold mb-2 text-green-400">Sinais de Segurança:</h4>
                    <ul class="space-y-1 text-sm">
                        <li>✓ URL com HTTPS</li>
                        <li>✓ Design profissional</li>
                        <li>✓ Informações de contato claras</li>
                        <li>✓ Política de privacidade</li>
                        <li>✓ Avaliações de clientes reais</li>
                    </ul>
                `;
                break;
            case 'suspeito':
                exemplo = `
                    <h3 class="text-2xl font-bold mb-4 text-yellow-400">⚠️ Exemplo de Site Suspeito</h3>
                    <div class="bg-gray-800 p-4 rounded-lg mb-4">
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-yellow-400">⚠️</span>
                            <span class="text-sm">http://promosincriveis.net</span>
                        </div>
                        <h4 class="font-bold mb-2">PROMOÇÃO IMPERDÍVEL - 90% OFF!!!</h4>
                        <p class="text-sm text-gray-300">iPhone por R$ 200! Últimas unidades! Compre AGORA!</p>
                    </div>
                    <h4 class="font-bold mb-2 text-yellow-400">Sinais de Alerta:</h4>
                    <ul class="space-y-1 text-sm">
                        <li>⚠️ Preços muito baixos</li>
                        <li>⚠️ Urgência excessiva</li>
                        <li>⚠️ Sem HTTPS</li>
                        <li>⚠️ Design amador</li>
                        <li>⚠️ Informações de contato vagas</li>
                    </ul>
                `;
                break;
            case 'perigoso':
                exemplo = `
                    <h3 class="text-2xl font-bold mb-4 text-red-400">🚨 Exemplo de Site Perigoso</h3>
                    <div class="bg-gray-800 p-4 rounded-lg mb-4">
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-red-400">🚨</span>
                            <span class="text-sm">http://ganhe-dinheiro-facil.tk</span>
                        </div>
                        <h4 class="font-bold mb-2">GANHE R$ 5000 EM 1 DIA!!!</h4>
                        <p class="text-sm text-gray-300">Método secreto! Digite seu CPF e dados bancários para receber!</p>
                    </div>
                    <h4 class="font-bold mb-2 text-red-400">PERIGOS Identificados:</h4>
                    <ul class="space-y-1 text-sm">
                        <li>🚨 Promessas impossíveis</li>
                        <li>🚨 Pede dados pessoais</li>
                        <li>🚨 Domínio suspeito (.tk)</li>
                        <li>🚨 Sem informações da empresa</li>
                        <li>🚨 Design com muitos erros</li>
                    </ul>
                `;
                break;
        }
        
        conteudo.innerHTML = exemplo;
        modal.style.display = 'block';
    };
    
    window.fecharModal = function() {
        document.getElementById('modalExemplo').style.display = 'none';
    };

    // Quiz
    window.responderQuiz = function(opcaoSelecionada) {
        const pergunta = perguntasQuiz[quizAtual];
        const opcoes = document.querySelectorAll('.quiz-option');
        const resultado = document.getElementById('quiz-result');
        const feedback = document.getElementById('quiz-feedback');
        
        // Desabilitar todas as opções
        opcoes.forEach(opcao => opcao.disabled = true);
        
        // Mostrar resposta correta e incorreta
        opcoes[pergunta.correta].classList.add('correct');
        if (opcaoSelecionada !== pergunta.correta) {
            opcoes[opcaoSelecionada].classList.add('incorrect');
        }
        
        // Atualizar pontuação
        if (opcaoSelecionada === pergunta.correta) {
            pontuacaoQuiz++;
            feedback.innerHTML = `<div class="text-green-400 text-lg font-bold">✅ Correto!</div><p>${pergunta.explicacao}</p>`;
        } else {
            feedback.innerHTML = `<div class="text-red-400 text-lg font-bold">❌ Incorreto!</div><p>${pergunta.explicacao}</p>`;
        }
        
        document.getElementById('quiz-question').classList.add('hidden');
        resultado.classList.remove('hidden');
        
        // Atualizar pontuação
        document.getElementById('quiz-score').textContent = `Pontuação: ${pontuacaoQuiz}/${quizAtual + 1}`;
    };
    
    window.proximaPergunta = function() {
        quizAtual++;
        
        if (quizAtual >= perguntasQuiz.length) {
            // Fim do quiz
            document.getElementById('quiz-result').innerHTML = `
                <div class="text-center">
                    <h4 class="text-2xl font-bold mb-4">🎉 Quiz Concluído!</h4>
                    <p class="text-lg mb-4">Sua pontuação final: ${pontuacaoQuiz}/${perguntasQuiz.length}</p>
                    <button onclick="reiniciarQuiz()" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold transition-colors">
                        Jogar Novamente
                    </button>
                </div>
            `;
            return;
        }
        
        // Próxima pergunta
        const pergunta = perguntasQuiz[quizAtual];
        document.getElementById('quiz-question').innerHTML = `
            <h4 class="text-lg font-semibold mb-4">${pergunta.pergunta}</h4>
            <div class="space-y-3">
                ${pergunta.opcoes.map((opcao, index) => `
                    <button onclick="responderQuiz(${index})" class="quiz-option w-full text-left p-3 bg-gray-800 hover:bg-blue-800 rounded-lg transition-colors">
                        ${String.fromCharCode(65 + index)}) ${opcao}
                    </button>
                `).join('')}
            </div>
        `;
        
        document.getElementById('quiz-question').classList.remove('hidden');
        document.getElementById('quiz-result').classList.add('hidden');
    };
    
    window.reiniciarQuiz = function() {
        quizAtual = 0;
        pontuacaoQuiz = 0;
        proximaPergunta();
        document.getElementById('quiz-score').textContent = 'Pontuação: 0/0';
    };

    // Detector de Phishing
    window.iniciarPhishing = function() {
        phishingAtual = 0;
        pontuacaoPhishing = 0;
        emailsRespondidos = 0;
        
        document.getElementById('phishing-start').classList.add('hidden');
        document.getElementById('phishing-game').classList.remove('hidden');
        
        mostrarProximoEmail();
    };
    
    function mostrarProximoEmail() {
        if (phishingAtual >= emailsPhishing.length) {
            finalizarJogoPhishing();
            return;
        }
        
        const email = emailsPhishing[phishingAtual];
        const emailDisplay = document.getElementById('email-display');
        
        emailDisplay.innerHTML = `
            <div class="border-b border-gray-600 pb-3 mb-3">
                <div class="flex items-center space-x-2 mb-2">
                    <span class="text-gray-400 text-sm">De:</span>
                    <span class="font-mono text-sm">${email.remetente}</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-gray-400 text-sm">Assunto:</span>
                    <span class="font-semibold">${email.assunto}</span>
                </div>
            </div>
            <div class="text-gray-300 leading-relaxed">
                ${email.conteudo}
            </div>
        `;
        
        // Esconder feedback anterior
        document.getElementById('phishing-feedback').classList.add('hidden');
        
        // Habilitar botões
        document.querySelectorAll('#phishing-game button').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('opacity-50');
        });
    }
    
    window.classificarEmail = function(respostaUsuario) {
        const email = emailsPhishing[phishingAtual];
        const feedback = document.getElementById('phishing-feedback');
        const isCorreto = respostaUsuario === email.seguro;
        
        // Desabilitar botões
        document.querySelectorAll('#phishing-game button').forEach(btn => {
            btn.disabled = true;
            btn.classList.add('opacity-50');
        });
        
        emailsRespondidos++;
        if (isCorreto) {
            pontuacaoPhishing++;
        }
        
        // Mostrar feedback
        const corFeedback = isCorreto ? 'bg-green-800' : 'bg-red-800';
        const iconeFeedback = isCorreto ? '✅' : '❌';
        const textoFeedback = isCorreto ? 'Correto!' : 'Incorreto!';
        
        feedback.innerHTML = `
            <div class="${corFeedback} p-4 rounded-lg">
                <div class="flex items-center space-x-2 mb-3">
                    <span class="text-2xl">${iconeFeedback}</span>
                    <span class="text-xl font-bold">${textoFeedback}</span>
                </div>
                <p class="mb-4">${email.explicacao}</p>
                <div class="text-center">
                    <button onclick="proximoEmailPhishing()" class="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg font-semibold transition-colors">
                        ${phishingAtual + 1 >= emailsPhishing.length ? 'Ver Resultado Final' : 'Próximo Email'}
                    </button>
                </div>
            </div>
        `;
        
        feedback.classList.remove('hidden');
        
        // Atualizar pontuação
        document.getElementById('phishing-score').textContent = `Pontuação: ${pontuacaoPhishing}/${emailsRespondidos}`;
    };
    
    window.proximoEmailPhishing = function() {
        phishingAtual++;
        mostrarProximoEmail();
    };
    
    function finalizarJogoPhishing() {
        const porcentagem = Math.round((pontuacaoPhishing / emailsPhishing.length) * 100);
        let mensagem, cor;
        
        if (porcentagem >= 80) {
            mensagem = "🎉 Excelente! Você é um expert em detectar golpes!";
            cor = "bg-green-800";
        } else if (porcentagem >= 60) {
            mensagem = "👍 Bom trabalho! Continue praticando para ficar ainda melhor!";
            cor = "bg-yellow-600";
        } else {
            mensagem = "📚 Que tal revisar as dicas de segurança e tentar novamente?";
            cor = "bg-red-800";
        }
        
        document.getElementById('email-display').innerHTML = `
            <div class="${cor} p-6 rounded-lg text-center">
                <h4 class="text-2xl font-bold mb-4">Jogo Concluído!</h4>
                <p class="text-xl mb-4">Sua pontuação: ${pontuacaoPhishing}/${emailsPhishing.length} (${porcentagem}%)</p>
                <p class="mb-6">${mensagem}</p>
                <button onclick="reiniciarPhishing()" class="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-lg font-semibold transition-colors">
                    Jogar Novamente
                </button>
            </div>
        `;
        
        document.getElementById('phishing-feedback').classList.add('hidden');
    }
    
    window.reiniciarPhishing = function() {
        document.getElementById('phishing-game').classList.add('hidden');
        document.getElementById('phishing-start').classList.remove('hidden');
        document.getElementById('phishing-score').textContent = 'Pontuação: 0/0';
    };

    // Jogo de Senhas
    window.iniciarPasswordGame = function() {
        passwordAtual = 0;
        pontuacaoPassword = 0;
        document.getElementById('startPasswordBtn').classList.add('hidden');
        document.getElementById('passwordContent').classList.remove('hidden');
        document.getElementById('passwordScore').classList.add('hidden');
        mostrarDesafioSenha();
    };
    
    function mostrarDesafioSenha() {
        if (passwordAtual >= desafiosSenha.length) {
            finalizarPasswordGame();
            return;
        }
        
        const desafio = desafiosSenha[passwordAtual];
        document.getElementById('passwordTask').textContent = `Nível ${desafio.nivel}: ${desafio.tarefa}`;
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').placeholder = desafio.dica;
        document.getElementById('passwordFeedback').innerHTML = '';
        document.getElementById('checkPasswordBtn').classList.remove('hidden');
        document.getElementById('nextPasswordBtn').classList.add('hidden');
    }
    
    window.verificarSenha = function() {
        const senha = document.getElementById('passwordInput').value;
        
        if (!senha) {
            alert('Por favor, digite uma senha!');
            return;
        }
        
        const desafio = desafiosSenha[passwordAtual];
        const feedback = document.getElementById('passwordFeedback');
        let passou = true;
        let feedbackHtml = '<div class="space-y-2">';
        
        // Verificar cada requisito
        desafio.requisitos.forEach(req => {
            let status = false;
            let texto = '';
            
            switch(req) {
                case 'minimo8':
                    status = senha.length >= 8;
                    texto = `Pelo menos 8 caracteres (atual: ${senha.length})`;
                    break;
                case 'minimo12':
                    status = senha.length >= 12;
                    texto = `Pelo menos 12 caracteres (atual: ${senha.length})`;
                    break;
                case 'maiuscula':
                    status = /[A-Z]/.test(senha);
                    texto = 'Pelo menos uma letra maiúscula (A-Z)';
                    break;
                case 'minuscula':
                    status = /[a-z]/.test(senha);
                    texto = 'Pelo menos uma letra minúscula (a-z)';
                    break;
                case 'numero':
                    status = /[0-9]/.test(senha);
                    texto = 'Pelo menos um número (0-9)';
                    break;
                case 'simbolo':
                    status = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
                    texto = 'Pelo menos um símbolo (!@#$%^&*)';
                    break;
                case 'naoSequencia':
                    status = !/123|abc|qwerty|password|asdf|zxcv/i.test(senha);
                    texto = 'Sem sequências óbvias (123, abc, qwerty, password)';
                    break;
            }
            
            if (!status) passou = false;
            
            feedbackHtml += `
                <div class="flex items-center gap-3 p-2 rounded ${status ? 'bg-green-900 bg-opacity-50' : 'bg-red-900 bg-opacity-50'}">
                    <span class="text-xl">${status ? '✅' : '❌'}</span>
                    <span class="${status ? 'text-green-300' : 'text-red-300'} text-sm">${texto}</span>
                </div>
            `;
        });
        
        feedbackHtml += '</div>';
        
        if (passou) {
            feedbackHtml += `
                <div class="mt-4 p-4 bg-green-800 rounded-lg text-center">
                    <div class="text-2xl mb-2">🎉</div>
                    <div class="text-green-200 font-bold">Perfeito! Senha aprovada no Nível ${desafio.nivel}!</div>
                </div>
            `;
            document.getElementById('checkPasswordBtn').classList.add('hidden');
            document.getElementById('nextPasswordBtn').classList.remove('hidden');
        }
        
        feedback.innerHTML = feedbackHtml;
    };
    
    window.proximaFaseSenha = function() {
        passwordAtual++;
        pontuacaoPassword++;
        mostrarDesafioSenha();
    };
    
    function finalizarPasswordGame() {
        document.getElementById('passwordContent').classList.add('hidden');
        document.getElementById('passwordScore').classList.remove('hidden');
        
        const porcentagem = Math.round((pontuacaoPassword / desafiosSenha.length) * 100);
        let mensagem = '';
        
        if (porcentagem >= 90) {
            mensagem = '🔐 Mestre das Senhas! Suas senhas são ultra-seguras!';
        } else if (porcentagem >= 70) {
            mensagem = '🛡️ Muito bom! Você cria senhas seguras!';
        } else {
            mensagem = '🔑 Continue praticando a criação de senhas!';
        }
        
        document.getElementById('passwordScoreText').innerHTML = `
            <div class="text-3xl font-bold mb-2">${pontuacaoPassword}/${desafiosSenha.length}</div>
            <div class="text-xl mb-4">${porcentagem}% de aproveitamento</div>
            <div class="text-lg">${mensagem}</div>
        `;
    }
    
    window.reiniciarPasswordGame = function() {
        document.getElementById('passwordScore').classList.add('hidden');
        document.getElementById('startPasswordBtn').classList.remove('hidden');
    };

    // Inicialização
    document.addEventListener('DOMContentLoaded', function() {
        // Fechar modal ao clicar fora
        window.onclick = function(event) {
            const modal = document.getElementById('modalExemplo');
            if (event.target === modal) {
                fecharModal();
            }
        };
    });

})();