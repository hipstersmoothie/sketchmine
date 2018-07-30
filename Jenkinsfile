pipeline {
  agent {
    node {
      label 'default'
    }
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '1'))
    timeout(time: 30, unit: 'MINUTES')
  }

  stages {
    stage('Prepare') {
      steps {
        nvm(version: 'v8.9.4', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          sh 'npm install'
        }
      }
    }

    stage('Validate') {
      steps {
        nvm(version: 'v8.9.4', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm run test'
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
