import { setExperiment } from '../ducks/experiments'

export const experimentName = 'ESDSOptions'
export const NO_OPTIONS = 'No Options'
export const OPTIONS_MODAL_1 = 'Options Modal V1'
export const OPTIONS_MODAL_2 = 'Options Modal V2'
export const OPTIONS_LONG = 'Options Long'
export const OPTIONS_SHORT = 'Options Short'

const experimentCookieKey = 'egt.pg.options'

const variations = {
  NO_OPTIONS: (store) => {
    store.dispatch(setExperiment(experimentName, NO_OPTIONS))
  },
  OPTIONS_MODAL_1: (store) => {
    store.dispatch(setExperiment(experimentName, OPTIONS_MODAL_1))
  },
  OPTIONS_MODAL_2: (store) => {
    store.dispatch(setExperiment(experimentName, OPTIONS_MODAL_2))
  },
  OPTIONS_LONG: (store) => {
    store.dispatch(setExperiment(experimentName, OPTIONS_LONG))
  },
  OPTIONS_SHORT: (store) => {
    store.dispatch(setExperiment(experimentName, OPTIONS_SHORT))
  },
}

const variationsList = Object.keys(variations)

const getVariation = (value = 0) => {
  return variationsList[value]
}

const shouldActivate = () => {
  return true
}

const config = {
  activate: (req, res, store) => {
    console.log('info', 'checking to see if experiment should be activated')
    if (shouldActivate()) {
      console.log('info', 'matched activation criteria')

      let splitValue = req.cookies && req.cookies[experimentCookieKey]
      if (splitValue) {
        console.log('info', 'cookie exists', { cookie: { name: experimentCookieKey, value: splitValue } })
      } else {
        splitValue = getVariation(Math.floor(Math.random() * variationsList.length))
        res.cookie(experimentCookieKey, splitValue, { maxAge: 900000 })
        console.log('info', 'cookie created successfully', { cookie: { name: experimentCookieKey, value: splitValue } })
      }

      console.log('info', 'split test', { splitValue })
      return variations[splitValue](store)
    } else {
      throw new Error('Experiment did not meet activation requirements.')
    }
  },
  name: experimentName,
}

export default config
