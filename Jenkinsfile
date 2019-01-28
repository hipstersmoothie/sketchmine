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
    COMP_VOL_NAME = 'SketchmineComponentsLibrary'
    SHARED_VOL_NAME = 'SketchmineShared'
    APP_VOL_NAME = 'SketchmineApp'
    APP_NETWORK = 'SketchmineNetwork'
    GIT_REPO = 'https://bitbucket.lab.dynatrace.org/scm/rx/angular-components.git'
    FEATURE_BRANCH_PREFIX = 'feat/library-update-version'
    VERBOSE = 'true'
  }

  stages {

    stage('Install dependencies 📦') {
      steps {
        nodejs(nodeJSInstallationName: 'Node 10.x') {
          ansiColor('xterm') {
            sh 'yarn install --registry http://artifactory.lab.dynatrace.org/artifactory/api/npm/registry-npmjs-org'
            sh 'yarn bootstrap'
          }
        }
      }
    }

    stage('🔨 Get angular-components version') {
      steps {

        dir('packages/build') {
          nodejs(nodeJSInstallationName: 'Node 10.x') {
            sh 'yarn get-latest-tag -r=RX -p=angular-components -f="../../VERSION"'
          }
        }

        script {
          def version = sh(returnStdout: true, script: "cat ./VERSION");
          env.VERSION = version;
        }

        sh 'echo "\n💎 Library Version:\t$VERSION"'
      }
    }

    stage('Build ⚒') {
      steps {
        nodejs(nodeJSInstallationName: 'Node 10.x') {
          ansiColor('xterm') {
            sh 'yarn build'
          }
        }
      }
    }

    stage('Prepare Volumes 💾') {
      steps {
        sh '''
          echo "Create Volumes"
          docker volume create --name ${COMP_VOL_NAME}
          docker volume create --name ${SHARED_VOL_NAME}
          docker volume create --name ${APP_VOL_NAME}

          echo "Create Network"
          docker network create -d bridge ${APP_NETWORK} || true
        '''
      }
    }

    stage('Build 🐳 🏙') {
      steps {

        script {
          def version = sh(returnStdout: true, script: "cat ./VERSION");
          env.VERSION = version;
        }

        sh '''
          docker build -t sketchmine/components-library . -f ./config/Dockerfile --build-arg GIT_TAG=${VERSION} --build-arg GIT_REPO=${GIT_REPO}
          docker build -t sketchmine/code-analyzer . -f ./packages/code-analyzer/Dockerfile
          docker build -t sketchmine/app-builder . -f ./packages/app-builder/Dockerfile
          docker build -t sketchmine/sketch-builder . -f ./packages/sketch-builder/Dockerfile
          docker build -t sketchmine/sketch-validator . -f ./packages/sketch-validator-nodejs-wrapper/Dockerfile
        '''
      }
    }

    stage('Prepare Material Examples 👩🏼‍🔧') {
      steps {
        sh '''
          docker run --rm \
            --name components_library \
            -v ${COMP_VOL_NAME}:/components-library \
            sketchmine/components-library \
            /bin/sh -c './node_modules/.bin/gulp barista-example:generate'
        '''
      }
    }

    stage('Generate meta-information.json 🕵🏻‍') {
      steps {
        sh '''
           docker run --rm \
            --name code_analyzer \
            -v ${COMP_VOL_NAME}:/angular-components \
            -v ${SHARED_VOL_NAME}:/shared \
            sketchmine/code-analyzer \
            /bin/sh -c 'node ./lib/bin --config="config.json"'
        '''
      }
    }

    stage('Generate examples angular application 🧰') {
      steps {
        sh '''
          docker run --rm \
            --name app_builder \
            -v ${COMP_VOL_NAME}:/angular-components \
            -v ${SHARED_VOL_NAME}:/shared \
            -v ${APP_VOL_NAME}:/app-shell \
            sketchmine/app-builder \
            /bin/sh -c '\
              yarn schematics --config="config.json" --dryRun=false && \
              mkdir -p ./sketch-library/src/assets && \
              cp /shared/* ./sketch-library/src/assets/ && \
              cd ./sketch-library && \
              yarn ng build && \
              cd dist && \
              cp -R ./angular-app-shell/* /app-shell'
        '''
      }
    }

    stage('Start Webserver 🌍') {
      steps {
        sh '''
           docker run --rm \
            -v ${APP_VOL_NAME}:/usr/share/nginx/html \
            --name web_server \
            --net ${APP_NETWORK} \
            -p 4200:80 \
            -d \
            nginx:alpine
        '''
      }
    }

    stage('Generate the Sketch file 💎') {
      steps {
        sh '''

          echo "create ./_library for out dir of the generated file"
          mkdir _library

          docker run --rm \
            -e DOCKER=true \
            -e DEBUG=true \
            --cap-add=SYS_ADMIN \
            --name sketch_builder \
            --net ${APP_NETWORK} \
            -v ${APP_VOL_NAME}:/app-shell \
            -v $(pwd)/_library:/generated \
            sketchmine/sketch-builder \
            /bin/sh -c 'node ./lib/bin --config="config.json"'
        '''
      }
    }

    stage('🗄 Clone UX global ressources') {
      // when {
      //   branch 'master'
      // }

      steps {

        script {
          def version = sh(returnStdout: true, script: "cat ./VERSION");
          env.VERSION = version;
        }

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

        nodejs(nodeJSInstallationName: 'Node 10.x') {
          ansiColor('xterm') {
            withCredentials([usernamePassword(credentialsId: 'Buildmaster-encoded', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {

              dir('packages/build') {
                sh '''
                  yarn commit-pr \
                    --user $GIT_USER \
                    --password $GIT_PASS \
                    -v="${VERSION}" \
                    --cwd="../../ux-global-ressources"
                '''
              }
            }
          }
        }
      }

      //   dir('ux-global-ressources') {
      //     sh '''
      //       # replace dot with divis for branchname
      //       version=$(echo $GIT_TAG | sed 's/[\\.]/-/g')
      //       FEATURE_BRANCH="${FEATURE_BRANCH_PREFIX}-${version}-${BUILD_NUMBER}"
      //       git checkout -b ${FEATURE_BRANCH}
      //     '''
      //   }
      // }
    }

    // stage('🚀 make PR with the generated library 💎') {
    //   // when {
    //   //   branch 'master'
    //   // }

    //   steps {
    //     dir('ux-global-ressources') {
    //       sh '''
    //         version=$(echo $GIT_TAG | sed 's/[\\.]/-/g')
    //         FEATURE_BRANCH="${FEATURE_BRANCH_PREFIX}-${version}-${BUILD_NUMBER}"

    //         cp ../_library/library.sketch ./library.sketch

    //         git add .
    //         message="feat(library): new library for version ${GIT_TAG} was generated."
    //         git commit -m "$message"
    //         git status
    //       '''

    //       withCredentials([usernamePassword(credentialsId: 'Buildmaster-encoded', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {

    //       sh '''
    //         version=$(echo $GIT_TAG | sed 's/[\\.]/-/g')
    //         FEATURE_BRANCH="${FEATURE_BRANCH_PREFIX}-${version}-${BUILD_NUMBER}"

    //         git push https://${GIT_USER}:${GIT_PASS}@bitbucket.lab.dynatrace.org/scm/ux/global-resources.git ${FEATURE_BRANCH}
    //         curl --request \
    //           POST \
    //           --url https://${GIT_USER}:${GIT_PASS}@bitbucket.lab.dynatrace.org/rest/api/1.0/projects/UX/repos/global-resources/pull-requests \
    //           --header 'content-type: application/json' \
    //           --data '{ \
    //             "title": "Automatic Library update for Angular Components version: '"${GIT_TAG}"'",\
    //             "description": "**New Library updates** 🚀 \\nPlease update your sketch library!.", \
    //             "state": "OPEN", \
    //             "open": true, \
    //             "closed": false, \
    //             "fromRef": { "id": "refs/heads/'"${FEATURE_BRANCH}"'" }, \
    //             "toRef": { "id": "refs/heads/master" }, \
    //             "locked": false, \
    //             "reviewers": [ \
    //               { "user": { "name": "simon.ludwig" } }, \
    //               { "user": { "name": "lukas.holzer" } } \
    //             ] }'
    //       '''
    //       }
    //     }
    //   }
    // }

  }

  post {
    always {
      cleanWs()
      sh '''
        echo "Stop Nginx Web Server"
        docker stop web_server

        echo "Remove Volumes"
        docker volume rm ${COMP_VOL_NAME}
        docker volume rm ${SHARED_VOL_NAME}
        docker volume rm ${APP_VOL_NAME}


        echo "Remove Networks"
        docker network rm ${APP_NETWORK}
      '''
    }
  }
}
