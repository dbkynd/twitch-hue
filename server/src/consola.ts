import consola, { BasicReporter } from 'consola'

if (process.env.DOCKER === 'true') {
  consola.setReporters([new BasicReporter()])
}

export default consola
