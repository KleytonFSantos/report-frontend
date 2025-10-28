// Este é o Jenkinsfile para o projeto Frontend (report-frontend)

pipeline {
    agent any // Executa em qualquer 'agente' (máquina) disponível no Jenkins

    environment {
        // Define o diretório exato do projeto no servidor
        PROJECT_DIR = '/var/www/report-frontend'

        // Define o caminho para o NVM, que pertence ao utilizador 'ubuntu'
        NVM_DIR = '/home/ubuntu/.nvm'
    }

    stages {
        // --- Fase 1: Obter o Código (CI) ---
        stage('Checkout') {
            steps {
                echo "A obter o código mais recente..."
                cleanWs()
                checkout scm
            }
        }

        // --- Fase 2: Testes, Lint e Build (CI) ---
        stage('Test, Lint & Build (CI)') {
            steps {
                sh '''
                    #!/bin/bash
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
                dir(PROJECT_DIR) {
                    script {
                        echo "A iniciar o deploy no diretório: ${PROJECT_DIR}"

                        sh '''
                            #!/bin/bash
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
                            npm install -g pm2

                            pm2 reload report-frontend 2>/dev/null || pm2 start "npm run start" --name "report-frontend"
                        '''

                        echo "🚀 Deploy do Frontend concluído!"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Limpeza... (se necessário)'
        }
    }
}