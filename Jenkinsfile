pipeline {
  agent {
    node {
      label 'default'
    }
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {
    stage('Prepare') {
      steps {
        nvm(version: 'v8.9.4', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm install'
          }
        }
      }
    }

    stage('Build') {
      steps {
        nvm(version: 'v8.9.4', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm run build'
          }
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
}
