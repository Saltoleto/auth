node {
    stage('Checkout') {
        checkout scm
    }

    stage('Version') {
        def version = "1.0.${env.BUILD_NUMBER}"
        currentBuild.description = version
        sh "sed -i 's/development/$version/g' ./public/project-version.txt"
    }

    stage('Publish') {
        def dockerHome = tool 'Docker17'
        configFileProvider([configFile(fileId: 'docker-registry', variable: 'CONFIG_DOCKER_REGISTRY')]) {
            def dockerRegistry = readFile("$CONFIG_DOCKER_REGISTRY")
            def context = "$JOB_NAME".replace('-ng', '').replace('-temp', '')

            withCredentials([usernamePassword(credentialsId: 'docker-registry-push', passwordVariable: 'CONFIG_DOCKER_PASSWORD', usernameVariable: 'CONFIG_DOCKER_USER')]) {
                sh "${dockerHome}/bin/docker -H $dockerRegistry login -u $CONFIG_DOCKER_USER -p $CONFIG_DOCKER_PASSWORD $dockerRegistry"
            }

            sh "${dockerHome}/bin/docker -H $dockerRegistry build -t $dockerRegistry/$JOB_NAME:${currentBuild.description} ."
            sh "${dockerHome}/bin/docker -H $dockerRegistry push $dockerRegistry/$JOB_NAME:${currentBuild.description}"
            sh "${dockerHome}/bin/docker -H $dockerRegistry rmi $dockerRegistry/$JOB_NAME:${currentBuild.description}"
        }
    }

      stage('Tag') {
            if(!env.JOB_NAME.contains('-temp')){
                sh "git tag ${currentBuild.description}"
                sh "git push --tags"
            }
        }
}