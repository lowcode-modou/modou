import equal from 'fast-deep-equal/es6'
import { isEmpty } from 'lodash'
import { debug } from 'loglevel'

import { CodeMirrorTernServiceInstance } from './CodeMirrorTernService'
import {
  AdditionalDynamicDataTree,
  customTreeTypeDefCreator,
} from './customTreeTypeDefCreator'

class CustomDef {
  private static lastCustomDataDef: AdditionalDynamicDataTree | undefined

  update(customData?: AdditionalDynamicDataTree) {
    if (customData && !isEmpty(customData)) {
      const customDataDef = customTreeTypeDefCreator(customData)
      if (!equal(CustomDef.lastCustomDataDef, customDataDef)) {
        const start = performance.now()

        CodeMirrorTernServiceInstance.updateDef('customDataTree', customDataDef)

        debug(
          'Tern: updateDef for customDataTree took',
          (performance.now() - start).toFixed(),
          'ms',
        )

        CustomDef.lastCustomDataDef = customDataDef
      }
    } else if (CustomDef.lastCustomDataDef) {
      const start = performance.now()
      CodeMirrorTernServiceInstance.removeDef('customDataTree')
      debug(
        'Tern: removeDef for customDataTree took',
        (performance.now() - start).toFixed(),
        'ms',
      )
      CustomDef.lastCustomDataDef = undefined
    }
  }
}

/**
 * This method is responsible for both add and remove def in CodemirrorTernService for customDataTree.
 *
 * if customData is not defined then check if lastCustomDataDef was present and remove it.
 *
 * if customData is defined then generate new customDataDef and compare with lastCustomDataDef
 * if different then run updateDef
 * @param customData
 */
export const updateCustomDef = new CustomDef().update
