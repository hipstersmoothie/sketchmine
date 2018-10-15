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

  environment {
    ANGULAR_COMPONENTS_BRANCH = 'feat/poc-sketch'
    VERBOSE = 'true'
  }

  stages {

    stage('Prepare') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: "*/${ANGULAR_COMPONENTS_BRANCH}"]],
          doGenerateSubmoduleConfigurations: false,
          extensions: [
            [
              $class: 'CloneOption',
              noTags: false,
              reference: '',
              shallow: true
            ],
            [
              $class: 'SparseCheckoutPaths',
              sparseCheckoutPaths: [
                [path: 'src/lib/core/style/_colors.scss'],
                [path: 'package.json']
              ]
            ],
            [
              $class: 'RelativeTargetDirectory',
              relativeTargetDir: './_tmp'
            ]
          ],
          submoduleCfg: [],
          userRemoteConfigs: [
            [
              credentialsId: 'Buildmaster',
              url: 'https://bitbucket.lab.dynatrace.org/scm/rx/angular-components.git'
            ]
          ]
        ])

        nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm install'
          }
        }
      }
    }

    stage('Lint') {
      steps {
        nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm run lint'
          }
        }
      }
    }

    // Build need to run before test because the dom traverser has to be build!
    stage('Build') {
      steps {
        nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm run build'
          }
        }
      }
    }

    stage('Test') {
      steps {
        nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm run test'
          }
        }
      }
    }

    stage('Build Docker image') {
      // when {
      //   branch 'master'
      // }

      steps {
        withCredentials([usernamePassword(credentialsId: 'Buildmaster-encoded', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
          sh '''
            # get Package version from Angular Components
            PACKAGE_VERSION=$(cat ./_tmp/package.json \\
              | grep version \\
              | head -1 \\
              | awk -F: \'{ print $2 }\' \\
              | sed \'s/[",]//g\' \\
              | tr -d \'[[:space:]]\')
            echo $PACKAGE_VERSION

            docker build \
              -t webkins.lab.dynatrace.org:5000/ng-sketch:${PACKAGE_VERSION} \
              -t webkins.lab.dynatrace.org:5000/ng-sketch:latest \
              --build-arg GIT_PASS=$GIT_PASS \
              --build-arg GIT_USER=$GIT_USER \
              --build-arg GIT_BRANCH=${ANGULAR_COMPONENTS_BRANCH} \
              .


            docker push webkins.lab.dynatrace.org:5000/ng-sketch:${PACKAGE_VERSION}
            docker push webkins.lab.dynatrace.org:5000/ng-sketch:latest
          '''
        }
      }
    }

    stage('Generate .sketch library') {
      // when {
      //   branch 'master'
      // }

      steps {
        sh '''
          docker pull webkins.lab.dynatrace.org:5000/ng-sketch:latest
          mkdir _library

          docker run\
            -it \
            -v $(pwd)/_library/:/lib/_library/ \
            -e DOCKER=true \
            -e DEBUG=true \
            --cap-add=SYS_ADMIN \
            ng-sketch \
            node dist/library
        '''
      }
    }

  }

  post {
    always {
      cleanWs()
    }
  }
}
