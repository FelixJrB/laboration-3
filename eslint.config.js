import base from '@lnu/eslint-config'
import browser from '@lnu/eslint-config/browser'
import jsdoc from '@lnu/eslint-config/jsdoc'
import node from '@lnu/eslint-config/node'
import typescript from '@lnu/eslint-config/typescript'

/**
 * Restricts a config layer to the given files, so that Node rules and browser rules
 * do not leak into each other.
 *
 * @param {string[]} files Glob patterns the layer applies to.
 * @param {object[]} layer The config layer to restrict.
 * @param {string[]} ignores Glob patterns to exclude from the layer.
 * @returns {object[]} The restricted layer.
 */
const onlyFor =(files, layer, ignores = []) =>
  layer.map((config) => ({ ...config, files, ignores }))

export default [
  { ignores: ['dist/', 'node_modules/'] },
  ...base,
  ...typescript,
  ...jsdoc,
  ...onlyFor(['src/**'], node),
  ...onlyFor(['public/**'], browser),
]
