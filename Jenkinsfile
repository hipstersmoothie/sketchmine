pipeline {
  agent {
    node {
      label 'default'
    }
  }

  options {
    timestamps()
    skipDefaultCheckout()
    buildDiscarder(logRotator(numToKeepStr: '1'))
    timeout(time: 30, unit: 'MINUTES')
  }

  stages {
    stage('Prepare') {
      steps {
        sh """
          rm -rf ./workdir
          ls -lah
          git clone --no-checkout --depth=100 -b $BRANCH_NAME https://github.lab.dynatrace.org/dynatrace/ux_global_resources.git ./workdir
        """

        dir('workdir') {
          script {
            def firstCommitInBranch = sh(returnStdout: true, script: 'git fetch origin master; git cherry FETCH_HEAD HEAD | head -1 | sed -e "s/^+ //"').trim();
            def parentCommit = sh(returnStdout: true, script: "git rev-list --parents -n 1 ${firstCommitInBranch}").tokenize(' ').last();
            def diff = sh(returnStdout: true, script: "git diff --name-only HEAD ${parentCommit}");
            def diffTokenized = diff.tokenize('\n').findAll { it.contains('.sketch') };
            diffTokenized.each {
              sh(returnStdout: true, script: "git lfs pull --include=${it}");
            }
            print(diff);
            env.DIFF = diff;
          }
        }
        
        checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/feat/sketch-dt-validation']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: './sketch-validator']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'Buildmaster', url: 'https://bitbucket.lab.dynatrace.org/scm/wx/ng-sketch.git']]]
        dir('sketch-validator') {
          nvm(version: 'v8.9.4', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
            sh 'npm install && npm run build'
          }
        }
        checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'SparseCheckoutPaths', sparseCheckoutPaths: [[path: 'barista/_data/colors.json']]], [$class: 'RelativeTargetDirectory', relativeTargetDir: './asset-library-data']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'Buildmaster', url: 'https://bitbucket.lab.dynatrace.org/scm/wx/asset-library-data.git']]]
        sh 'cp -rf ./asset-library-data/barista/_data/colors.json ./sketch-validator/tests/fixtures/colors.json'
      }
    }

    stage('Validate') {
      steps {
        dir('sketch-validator') {
          nvm(version: 'v8.9.4', nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', nvmIoJsOrgMirror: 'https://iojs.org/dist', nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
            ansiColor('css') {
              sh '''#!/bin/bash
                  diffFiles=$(echo "$DIFF" | grep '.sketch')
                  FAILURE=0
                  
                  for x in $diffFiles
                  do
                    node dist/validate --file="../workdir/\"$x\"" || FAILURE=1
                  done
                  if [ $FAILURE -eq 1 ]
                  then
                      echo "One or more failures!"
                      exit 1
                  fi
              '''
            }
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
