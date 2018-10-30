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
    FEATURE_BRANCH_PREFIX = 'feat/library-update-version'
  }

  stages {

    stage('🔧 Prepare') {
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

      }
    }

    stage('🔨 controll versions') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'Buildmaster-encoded', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
          nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
            sh 'node config/sem-versioning -p src/validate/package.json -b origin/master -c origin/$BRANCH_NAME '
            sh 'echo $(node config/get-package-version -p package.json) > .version'
          }
        }
        script {
          def packageVersion = sh(returnStdout: true, script: "cat ./.version");
          def version = sh(returnStdout: true, script: "cat ./.validator-version");
          env.PACKAGE_VERSION = packageVersion;
          env.VALIDATION_VERSION = version;
        }

        sh 'echo "\n💎 Library Version:\t$PACKAGE_VERSION"'
        sh 'echo "\n🖍 Sketch Validator Version:\t$VALIDATION_VERSION"'
      }
    }

    stage('⛏ Install') {
      steps {
        nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm install'
          }
        }
      }
    }

    stage('🔎 Lint') {
      steps {
        nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm run lint'
          }
        }
      }
    }

    // Build need to run before test because the dom traverser has to be build!
    stage('⚒ Build') {
      steps {
        nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm run build'
          }
        }
      }
    }

    stage('🌡 Test') {
      steps {
        nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
          ansiColor('xterm') {
            sh 'npm run test'
          }
        }
      }
    }

    stage('🚀 Publish validation to npm') {
      when {
        allOf {
          branch 'master'
          expression { return env.VALIDATION_VERSION != 'true' }
          expression { return env.VALIDATION_VERSION != 'no-version' }
        }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'npm-artifactory', passwordVariable: 'npm_pass', usernameVariable: 'npm_user')]) {

          nvm(version: 'v10.6.0', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
            dir('dist/sketch-validator/npm') {
               sh '''
                echo "@dynatrace:registry=https://artifactory.lab.dynatrace.org/artifactory/api/npm/npm-dynatrace-release-local/" > .npmrc
                curl -u$npm_user:$npm_pass https://artifactory.lab.dynatrace.org/artifactory/api/npm/auth >> .npmrc
                cat .npmrc

                echo "publish new version of the @dynatrace/sketch-validation with version: ${VALIDATION_VERSION}"
                npx yarn publish --verbose --no-git-tag-version --new-version $VALIDATION_VERSION ./
              '''
            }
          }
        }
      }
    }

    stage('🐳 Build Docker image') {
      when {
        branch 'master'
      }

      steps {
        withCredentials([usernamePassword(credentialsId: 'Buildmaster-encoded', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
          sh '''
            echo "Build Library for version: ${PACKAGE_VERSION}"

            docker build \
              -t webkins.lab.dynatrace.org:5000/ng-sketch:${PACKAGE_VERSION} \
              -t webkins.lab.dynatrace.org:5000/ng-sketch:latest \
              --build-arg GIT_PASS=$GIT_PASS \
              --build-arg GIT_USER=$GIT_USER \
              --build-arg GIT_BRANCH=${ANGULAR_COMPONENTS_BRANCH} \
              .
          '''
        }
      }
    }

    stage('✈️ Push docker image to regestry') {
      when {
        branch 'master'
      }

      steps {
        sh '''
          docker push webkins.lab.dynatrace.org:5000/ng-sketch:${PACKAGE_VERSION}
          docker push webkins.lab.dynatrace.org:5000/ng-sketch:latest
        '''
      }
    }

    stage('💎 Generate .sketch library') {
      when {
        branch 'master'
      }

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
              -e DEBUG=true \
              --cap-add=SYS_ADMIN \
              webkins.lab.dynatrace.org:5000/ng-sketch \
              node dist/library
          '''
        }
      }
    }

    stage('🗄 Clone UX global ressources') {
      when {
        branch 'master'
      }

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
            # replace dot with divis for branchname
            version=$(echo $PACKAGE_VERSION | sed 's/[\\.]/-/g')
            FEATURE_BRANCH="${FEATURE_BRANCH_PREFIX}-${version}-${BUILD_NUMBER}"
            git checkout -b ${FEATURE_BRANCH}
          '''
      }
      }
    }

    stage('🚀 deploy the library') {
      when {
        branch 'master'
      }

      steps {
        dir('ux-global-ressources') {
          sh '''
            version=$(echo $PACKAGE_VERSION | sed 's/[\\.]/-/g')
            FEATURE_BRANCH="${FEATURE_BRANCH_PREFIX}-${version}-${BUILD_NUMBER}"

            cp ../_library/dt-asset-lib.sketch ./dt-asset-lib.sketch

            git add .
            message="feat(library): new library for version ${PACKAGE_VERSION} was generated."
            git commit -m "$message"
            git status
          '''

          withCredentials([usernamePassword(credentialsId: 'Buildmaster-encoded', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {

          sh '''
            version=$(echo $PACKAGE_VERSION | sed 's/[\\.]/-/g')
            FEATURE_BRANCH="${FEATURE_BRANCH_PREFIX}-${version}-${BUILD_NUMBER}"

            git push https://${GIT_USER}:${GIT_PASS}@bitbucket.lab.dynatrace.org/scm/ux/global-resources.git ${FEATURE_BRANCH}
            curl --request \
              POST \
              --url https://${GIT_USER}:${GIT_PASS}@bitbucket.lab.dynatrace.org/rest/api/1.0/projects/UX/repos/global-resources/pull-requests \
              --header 'content-type: application/json' \
              --data '{ \
                "title": "Automatic Library update for Angular Components version: '"${PACKAGE_VERSION}"'",\
                "description": "**New Library updates** 🚀 \\nPlease update your sketch library!.", \
                "state": "OPEN", \
                "open": true, \
                "closed": false, \
                "fromRef": { "id": "refs/heads/'"${FEATURE_BRANCH}"'" }, \
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
