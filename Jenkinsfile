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
        /* Sparse checkout Angular Components/ ... core/_colors.scss (for validation) */
        checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', noTags: false, reference: '', shallow: true], [$class: 'SparseCheckoutPaths', sparseCheckoutPaths: [[path: 'src/lib/core/style/_colors.scss']]], [$class: 'RelativeTargetDirectory', relativeTargetDir: './_angular-components']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'Buildmaster', url: 'https://bitbucket.lab.dynatrace.org/scm/rx/angular-components.git']]]
        sh 'ls -lah ./_angular-components/src/lib/core/style/'
        sh 'mkdir ./src/validate/rules/color-validation/_tmp/'
        sh 'mv ./_angular-components/src/lib/core/style/_colors.scss ./src/validate/rules/color-validation/_tmp/_colors.scss'
        dir('_angular-components') {
          deleteDir()
        }
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

    post {
      always {
        cleanWs()
      }
    }
  }
}
