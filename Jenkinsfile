// Este é o Jenkinsfile para o projeto Frontend (report-frontend)

pipeline {
    agent any // Executa em qualquer 'agente' (máquina) disponível no Jenkins

    environment {
        // Define o diretório exato do projeto no servidor
        PROJECT_DIR = '/var/www/report-frontend'

        // Define o caminho para o NVM, que pertence ao utilizador 'ubuntu'
        // (O utilizador 'jenkins' precisa de permissão de leitura para esta pasta)
        NVM_DIR = '/home/ubuntu/.nvm'
    }

    stages {
        // --- Fase 1: Obter o Código (CI) ---
        stage('Checkout') {
            steps {
                echo "A obter o código mais recente..."
                // Limpa o espaço de trabalho antes de obter o código
                cleanWs()
                // Obtém o código (já configurado na UI do Jenkins)
                checkout scm
            }
        }

        // --- Fase 2: Testes, Lint e Build (CI) ---
        // Ao contrário do Laravel (onde simulámos), aqui podemos executar
        // o build real, pois o Node/NVM está no servidor.
        stage('Test, Lint & Build (CI)') {
            steps {
                // O Jenkins não carrega o .bashrc, então temos que carregar o NVM manualmente
                sh '''
                    echo "A carregar NVM..."
                    export NVM_DIR="${env.NVM_DIR}"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

                    echo "A usar Node 20..."
                    nvm use 20

                    echo "A instalar dependências (npm ci)..."
                    npm ci

                    echo "A executar Lint..."
                    npm run lint

                    echo "A executar Build (para teste)..."
                    npm run build
                '''
            }
        }

        // --- Fase 3: Deploy (CD) ---
        stage('Deploy') {
            steps {
                // Entra no diretório do projeto para executar os comandos
                dir(PROJECT_DIR) {
                    script {
                        echo "A iniciar o deploy no diretório: ${PROJECT_DIR}"

                        // Usamos o 'sh' multi-linha para carregar o NVM e executar comandos
                        sh '''
                            echo "A carregar NVM..."
                            export NVM_DIR="${env.NVM_DIR}"
                            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

                            echo "A usar Node 20..."
                            nvm use 20

                            echo "A instalar dependências de produção (npm ci)..."
                            npm ci

                            echo "A gerar build de produção..."
                            npm run build

                            echo "A reiniciar a aplicação com PM2..."
                            # Instala o PM2 (para o caso de não estar lá nesta versão do Node)
                            npm install -g pm2

                            # Reinicia a aplicação de frontend
                            pm2 reload report-frontend 2>/dev/null || pm2 start "npm run start" --name "report-frontend"
                        '''

                        echo "🚀 Deploy do Frontend concluído!"
                    }
                }
            }
        }
    }

    post {
        // Acontece sempre no final, quer falhe ou tenha sucesso
        always {
            echo 'Limpeza... (se necessário)'
        }
    }
}