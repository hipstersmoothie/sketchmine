pipeline {
  agent {
    node {
      label 'default'
    }
  }

  options {
    timestamps()
    skipDefaultCheckout()
    buildDiscarder(logRotator(numToKeepStr: '10'))
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
            def diff = sh(returnStdout: true, script: "git diff --name-only HEAD ${parentCommit}").tokenize('\n').findAll { it.contains('.sketch') };
            diff.each {
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
      }
    }

    stage('Validate') {
      steps {
        dir('sketch-validator') {
          script {
            env.DIFF.each {
              sh(returnStdout: true, script: "VERBOSE=true node dist/validate --file=${it}");
            }
          }
        }
      }
    }
  }

  // post {
  //   always {
  //     cleanWs()
  //   }
  // }
}
