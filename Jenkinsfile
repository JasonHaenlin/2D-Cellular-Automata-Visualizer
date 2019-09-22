#!/usr/bin/env groovy

pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    timeout(time: 1, unit: 'HOURS')
  }
  stages {
    stage('Checkout') {
      steps {
        echo 'Checkout'
      }
    }
    stage('Deployment') {
      when {
        expression { env.GIT_BRANCH == 'master' }
      }
        // ls -ld /var/www/site1/
        // sudo addgroup site1
        // sudo adduser user1 site1
        // sudo chown -vR :site1 /var/www/site1/
        // sudo chmod -vR g+w /var/www/site1/
        // sudo adduser www-data site1
      steps {
        echo 'Deployement'
        sh '''
        sg otake -c 'rm -rf /var/www/html/automata/*'
        sg otake -c 'mv * /var/www/html/automata/'
        '''
      }
    }
  }

  post {
    always {
      echo 'JENKINS PIPELINE'
    }

    success {
      echo 'JENKINS PIPELINE SUCCESSFUL'
    }

    failure {
      echo 'JENKINS PIPELINE FAILED'
    }

    unstable {
      echo 'JENKINS PIPELINE WAS MARKED AS UNSTABLE'
    }

    changed {
      echo 'JENKINS PIPELINE STATUS HAS CHANGED SINCE LAST EXECUTION'
    }
  }
}
