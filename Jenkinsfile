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

        sh '''
        # get Package version from Angular Components
          PACKAGE_VERSION=$(cat ./_tmp/package.json \\
            | grep version \\
            | head -1 \\
            | awk -F: \'{ print $2 }\' \\
            | sed \'s/[",]//g\' \\
            | tr -d \'[[:space:]]\')
          echo $PACKAGE_VERSION > .version
        '''

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
            PACKAGE_VERSION=$(cat ./.version)

            echo "Build Library for version: ${PACKAGE_VERSION}"

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

    stage('Prepare for Deployment') {
      // when {
      //   branch 'master'
      // }

      failFast true
      parallel {
        stage('Generate .sketch library 💎') {
          steps {
            ansiColor('xterm') {
              sh '''
                docker pull webkins.lab.dynatrace.org:5000/ng-sketch:latest

                # create _library for out dir of the generated file
                mkdir _library

                # for verbose logging add -e DEBUG=true
                docker run\
                  -v $(pwd)/_library/:/lib/_library/ \
                  -e DOCKER=true \
                  --cap-add=SYS_ADMIN \
                  webkins.lab.dynatrace.org:5000/ng-sketch \
                  node dist/library
              '''
            }
          }
        }
        stage('clone UX global ressources 🗄') {
          steps {
            checkout([
              $class: 'GitSCM',
              branches: [[name: '*/master']],
              doGenerateSubmoduleConfigurations: false,
              extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'ux-global-ressources']],
              submoduleCfg: [],
              userRemoteConfigs: [[
                credentialsId: 'Buildmaster',
                url: 'https://bitbucket.lab.dynatrace.org/scm/ux/global-resources.git'
              ]]
            ])

            dir('ux-global-ressources') {
              sh '''
                PACKAGE_VERSION=$(cat ../.version)
                git checkout -b feat/library-update-version-${PACKAGE_VERSION}-${BUILD_NUMBER}
              '''
          }
          }
        }
      }
    }

    stage('deploy the library 🚀') {
      steps {
        sh '''
          PACKAGE_VERSION=$(cat ./.version)
          cp ./_library/dt-asset-lib.sketch ./ux-global-ressources/dt-asset-lib.sketch
          BRANCH_NAME=feat/library-update-version-${PACKAGE_VERSION}-${BUILD_NUMBER}
        '''
        dir('ux-global-ressources') {
          sh 'git add .'
          sh 'git commit -m "feat(library): new library version was generated"'

          withCredentials([usernamePassword(credentialsId: 'Buildmaster-encoded', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {

          sh '''
          git push https://${GIT_USER}:${GIT_PASS}@bitbucket.lab.dynatrace.org/scm/ux/global-resources.git ${BRANCH_NAME}
          curl --request \
            POST \
            --url https://${GIT_USER}:${GIT_PASS}@bitbucket.lab.dynatrace.org/rest/api/1.0/projects/UX/repos/global-resources/pull-requests \
            --header 'content-type: application/json' \
            --data '{ \
              "title": "Automatic Library update for Angular Components version: '"$PACKAGE_VERSION"'",\
              "description": "**New Library updates** 🚀 \\nPlease update your sketch library!.", \
              "state": "OPEN", \
              "open": true, \
              "closed": false, \
              "fromRef": { "id": "refs/heads/'"$BRANCH_NAME"'" }, \
              "toRef": { "id": "refs/heads/master" }, \
              "locked": false, \
              "reviewers": [ \
                { "user": { "name": "simon.ludwig" } }, \
                { "user": { "name": "lukas.holzer" } } \
              ] }'
          '''
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
