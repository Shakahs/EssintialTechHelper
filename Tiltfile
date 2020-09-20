docker_build('gcr.io/essintial-tech-helper/poll', './build',dockerfile='./build/poll.Dockerfile')
docker_build('gcr.io/essintial-tech-helper/server', './build',dockerfile='./build/server.Dockerfile')

k8s_yaml(helm('essintialtechhelper'))
k8s_resource(workload='chart-ethdb', port_forwards=5432)
k8s_resource(workload='chart-ethserver', port_forwards=3000)
