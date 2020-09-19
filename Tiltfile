docker_build('gcr.io/essintial-tech-helper/poll', './build',dockerfile='./build/poll.Dockerfile')
k8s_yaml(helm('essintialtechhelper'))
k8s_resource(workload='chart-ethdb', port_forwards=5432)
