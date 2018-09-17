#! groovy
library 'pipeline-library'

timestamps {
  def isMaster = false
  def packageVersion
  def nodeVersion = '8.11.4'
  def yarnVersion = 'latest'
  node('osx || linux') {
    stage('Checkout') {
      // checkout scm
      // Hack for JENKINS-37658 - see https://support.cloudbees.com/hc/en-us/articles/226122247-How-to-Customize-Checkout-for-Pipeline-Multibranch
      // do a git clean before checking out
      checkout([
        $class: 'GitSCM',
        branches: scm.branches,
        extensions: scm.extensions + [[$class: 'CleanBeforeCheckout']],
        userRemoteConfigs: scm.userRemoteConfigs
      ])

      isMaster = env.BRANCH_NAME.equals('master')
      packageVersion = jsonParse(readFile('package.json'))['version']
      currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"
    }

    nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
      ansiColor('xterm') {
        stage('Install') {
          timeout(15) {
            // Install yarn if not installed
            ensureYarn(yarnVersion)
            sh 'yarn'
            fingerprint 'package.json'
          } // timeout
        } // stage

        stage('Lint') {
            sh 'yarn run lerna exec gulp lint'
        }

      } // ansiColor
    } // nodejs
  } // node
} // timestamps
